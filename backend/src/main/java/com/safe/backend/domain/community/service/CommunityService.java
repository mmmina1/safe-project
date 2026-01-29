package com.safe.backend.domain.community.service;

import com.safe.backend.domain.community.dto.*;
import com.safe.backend.domain.community.entity.VisitPost;
import com.safe.backend.domain.community.repository.PostRepository;
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

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final PostRepository postRepository;

    //목록 조회
    @Transactional(readOnly = true)
    public VisitPostList getVisitPosts(String query, String category, String sort, int page, int size) {

    //sort 정책
    Sort springSort = "popular".equalsIgnoreCase(sort)
                ? Sort.by(Sort.Direction.DESC, "likeCount").and(Sort.by(Sort.Direction.DESC, "createdDate"))
                : Sort.by(Sort.Direction.DESC, "createdDate");

        Pageable pageable = PageRequest.of(page - 1, size, springSort);

    Specification<VisitPost> spec = (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 중요한 기본조건: 운영자 숨김 + 삭제/블라인드 제외(목록에서는 NORMAL만 노출)
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
    
    //상세 조회
    @Transactional(readOnly = true)
    public VisitPostDetail getVisitPostDetail(Long postId) {
        VisitPost post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("VISIT_POST not found: " + postId));

        return VisitPostDetail.from(post);
    }

    //작성
    @Transactional
    public Long createVisitPost(VisitPostCreate req) {

        // 🔥 중요한 검증(최소)
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

        return postRepository.save(post).getPostId();
    }
}