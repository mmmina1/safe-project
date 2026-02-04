package com.safe.backend.domain.community.service;

import com.safe.backend.domain.community.entity.Comment;
import com.safe.backend.domain.community.repository.CommentRepository;
import com.safe.backend.domain.community.dto.CommentCreate;
import com.safe.backend.domain.community.dto.CommentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {
    private final CommentRepository commentRepository;

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

    // 🔥 하트 클릭 시 500 에러 박멸 로직 (수정 완료)
    @Transactional
    public void likeComment(Long commentId) {
        // 1. DB에서 최신 상태를 직접 가져옴
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("해당 댓글을 찾을 수 없습니다."));
        
        // 2. 엔티티 내의 증가 로직 실행 (comment_like_count 증가)
        comment.increaseLikeCount();
        
        // 3. 🔥 핵심: saveAndFlush를 사용하여 변경 내용을 DB에 즉시 강제 반영
        // 이렇게 해야 쿼리가 바로 날아가면서 500 에러를 방지할 수 있습니다.
        commentRepository.saveAndFlush(comment); 
    }
}