package com.safe.backend.domain.community.service;

import com.safe.backend.domain.community.entity.Comment;
import com.safe.backend.domain.community.entity.CommentLike;
import com.safe.backend.domain.community.repository.CommentRepository;
import com.safe.backend.domain.community.repository.CommentLikeRepository;
import com.safe.backend.domain.community.dto.CommentCreate;
import com.safe.backend.domain.community.dto.CommentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {
    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;

    @Transactional
    public CommentResponse createCommentAndReturn(CommentCreate dto) {
        Comment comment = Comment.create(
            dto.getPost_id(), 
            dto.getUser_id() != null ? dto.getUser_id() : 1L, 
            dto.getContent()
        );
        if (dto.getParent_comment_id() != null) {
            comment.setParentCommentId(dto.getParent_comment_id());
        }
        Comment savedComment = commentRepository.save(comment);
        return CommentResponse.from(savedComment);
    }

    public List<CommentResponse> getCommentsByPostId(Long postId) {
        return commentRepository.findAllByPostIdWithUser(postId).stream()
                .map(CommentResponse::from)
                .toList();
    }

    @Transactional
    public CommentResponse updateComment(Long commentId, String content, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글 없음"));
        if (!comment.getUserId().equals(userId)) throw new RuntimeException("권한 없음");
        comment.updateContent(content); 
        return CommentResponse.from(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글 없음"));
        if (!comment.getUserId().equals(userId)) throw new RuntimeException("권한 없음");
        commentRepository.hardDeleteById(commentId);
    }

    // 🔥 좋아요 토글 로직 (500 에러 및 무한 증가 방지 버전)
    @Transactional
    public void likeComment(Long commentId, Long userId) {
        // 1. 해당 댓글이 있는지 확인
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("해당 댓글을 찾을 수 없습니다."));
        
        // 2. 중요: Repository의 메서드 인자 순서와 (commentId, userId)를 반드시 맞춰야 함!
        Optional<CommentLike> existingLike = commentLikeRepository.findByCommentIdAndUserId(commentId, userId);

        if (existingLike.isPresent()) {
            // 3. 기록이 있으면 삭제 (좋아요 취소)
            commentLikeRepository.delete(existingLike.get());
            // 즉시 반영을 위해 flush 사용 (선택사항이지만 안전함)
            commentLikeRepository.flush(); 
            comment.decreaseLikeCount(); 
        } else {
            // 4. 기록이 없으면 추가 (좋아요)
            commentLikeRepository.save(new CommentLike(commentId, userId));
            comment.increaseLikeCount();
        }
        
        // 5. 카운트 업데이트 반영
        commentRepository.saveAndFlush(comment); 
    }
}