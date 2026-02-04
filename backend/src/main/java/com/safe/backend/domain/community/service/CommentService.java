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

    // 🔥 댓글 수정 (Setter 사용)
    @Transactional
    public CommentResponse updateComment(Long commentId, String content, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다"));

        // 🔥 본인 댓글인지 검증
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("본인의 댓글만 수정할 수 있습니다");
        }

        // 🔥 Setter로 간단하게 수정
        comment.setContent(content);
        comment.setUpdatedDate(LocalDateTime.now());

        return CommentResponse.from(comment);
    }

    // 🔥 댓글 삭제 (Setter 사용)
    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다"));

        // 🔥 본인 댓글인지 검증
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("본인의 댓글만 삭제할 수 있습니다");
        }

        // 🔥 Setter로 간단하게 삭제 (소프트 삭제)
        comment.setIsDeleted(true);
        comment.setUpdatedDate(LocalDateTime.now());
    }
}