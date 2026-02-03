package com.safe.backend.domain.community.service;

import com.safe.backend.domain.community.entity.Comment;
import com.safe.backend.domain.community.repository.CommentRepository;
import com.safe.backend.domain.community.dto.CommentCreate;
import com.safe.backend.domain.community.dto.CommentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;

    @Transactional
    public CommentResponse createCommentAndReturn(CommentCreate dto) {
        Comment comment = Comment.create(
            dto.getPost_id(), 
            dto.getUser_id() != null ? dto.getUser_id() : 1L, 
            dto.getContent()
        );
        
        Comment savedComment = commentRepository.save(comment);
        return CommentResponse.from(savedComment);
    }

    public List<CommentResponse> getCommentsByPostId(Long postId) {
        return commentRepository.findAllByPostIdWithUser(postId).stream()
                .map(CommentResponse::from)
                .toList();
    }

    // 🔥 댓글 수정 메서드 추가
    @Transactional
    public CommentResponse updateComment(Long commentId, String content, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다"));

        // 🔥 본인 댓글인지 검증
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("본인의 댓글만 수정할 수 있습니다");
        }

        // 🔥 리플렉션으로 content, updatedDate 수정
        try {
            java.lang.reflect.Field contentField = Comment.class.getDeclaredField("content");
            contentField.setAccessible(true);
            contentField.set(comment, content);

            java.lang.reflect.Field updatedDateField = Comment.class.getDeclaredField("updatedDate");
            updatedDateField.setAccessible(true);
            updatedDateField.set(comment, LocalDateTime.now());
        } catch (Exception e) {
            throw new RuntimeException("댓글 수정 중 오류 발생", e);
        }

        return CommentResponse.from(comment);
    }

    // 🔥 댓글 삭제 메서드 추가
    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다"));

        // 🔥 본인 댓글인지 검증
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("본인의 댓글만 삭제할 수 있습니다");
        }

        // 🔥 실제 삭제 대신 isDeleted = true로 변경 (소프트 삭제)
        try {
            java.lang.reflect.Field isDeletedField = Comment.class.getDeclaredField("isDeleted");
            isDeletedField.setAccessible(true);
            isDeletedField.set(comment, true);

            java.lang.reflect.Field updatedDateField = Comment.class.getDeclaredField("updatedDate");
            updatedDateField.setAccessible(true);
            updatedDateField.set(comment, LocalDateTime.now());
        } catch (Exception e) {
            throw new RuntimeException("댓글 삭제 중 오류 발생", e);
        }
    }
}