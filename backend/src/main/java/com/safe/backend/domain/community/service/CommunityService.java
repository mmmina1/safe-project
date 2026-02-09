package com.safe.backend.domain.community.service;

import com.safe.backend.domain.community.dto.*;
import com.safe.backend.domain.community.entity.VisitPost;
import com.safe.backend.domain.community.entity.CommentLike;
import com.safe.backend.domain.community.repository.PostRepository;
import com.safe.backend.domain.community.repository.CommentLikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; 

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final PostRepository postRepository;
    // 1. 좋아요 확인을 위해 레포지토리 주입 추가
    private final CommentLikeRepository commentLikeRepository;

    @Transactional(readOnly = true)
    public VisitPostList getVisitPosts(String query, String category, String sort, int page, int size) {
        Sort springSort = "popular".equalsIgnoreCase(sort)
                ? Sort.by(Sort.Direction.DESC, "likeCount").and(Sort.by(Sort.Direction.DESC, "createdDate"))
                : Sort.by(Sort.Direction.DESC, "createdDate");

        Pageable pageable = PageRequest.of(page - 1, size, springSort);

        Specification<VisitPost> spec = (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("isHidden"), false));
            predicates.add(cb.equal(root.get("status"), VisitPost.Status.NORMAL));

            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(root.get("category"), category));
            }

            if (query != null && !query.isBlank()) {
                String like = "%" + query.trim() + "%";
                predicates.add(
                        cb.or(
                                cb.like(root.get("title"), like),
                                cb.like(root.get("content"), like)
                        )
                );
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<VisitPost> result = postRepository.findAll(spec, pageable);
        List<VisitPostItem> items = result.getContent().stream()
                .map(VisitPostItem::from)
                .toList();

        return new VisitPostList(items, page, size, result.getTotalElements());
    }
    
    // 2. 상세 조회 시 로그인한 유저의 좋아요 여부 판단 로직 추가
    @Transactional(readOnly = true)
    public VisitPostDetail getVisitPostDetail(long postId, Long currentUserId) {
        VisitPost post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("VISIT_POST not found: " + postId));

        boolean isLiked = false;
        if (currentUserId != null) {
            isLiked = commentLikeRepository.existsByCommentIdAndUserId(postId, currentUserId);
        }

        // DTO의 from 메서드 인자 개수에 맞춰 호출
        return VisitPostDetail.from(post, isLiked);
    }

    @Transactional
    public Long createVisitPost(VisitPostCreate req) {
        if (req.getUserId() == null) throw new IllegalArgumentException("userId is required");
        if (req.getCategory() == null || req.getCategory().isBlank()) throw new IllegalArgumentException("category is required");
        if (req.getTitle() == null || req.getTitle().isBlank()) throw new IllegalArgumentException("title is required");
        if (req.getContent() == null || req.getContent().isBlank()) throw new IllegalArgumentException("content is required");

        VisitPost post = VisitPost.create(
                req.getUserId(),
                req.getCategory(),
                req.getTitle(),
                req.getContent()
        );

        if (post == null) throw new IllegalStateException("post is null");

        return postRepository.save(post).getPostId();
    }

    // 3. 좋아요 토글 로직 포함 (기존 엔티티의 증감 메서드 호출)
    @Transactional
    public boolean togglePostLike(Long postId, Long userId) {
        VisitPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글이 없습니다."));

        Optional<CommentLike> existingLike = commentLikeRepository.findByCommentIdAndUserId(postId, userId);

        if (existingLike.isPresent()) {
            commentLikeRepository.delete(existingLike.get());
            post.decrementLikeCount(); 
            return false; 
        } else {
            CommentLike newLike = new CommentLike(postId, userId);
            commentLikeRepository.save(newLike);
            post.incrementLikeCount();
            return true;
        }
    }
}