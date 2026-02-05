package com.safe.backend.domain.community.service;

import com.safe.backend.domain.community.dto.CommentCreate;
import com.safe.backend.domain.community.dto.CommentResponse;
import com.safe.backend.domain.community.entity.Comment;
import com.safe.backend.domain.community.entity.CommentLike;
import com.safe.backend.domain.community.repository.CommentLikeRepository;
import com.safe.backend.domain.community.repository.CommentRepository;
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
        if (dto == null) throw new RuntimeException("요청 데이터가 없습니다.");
        if (dto.getPostId() == null) throw new RuntimeException("post_id가 없습니다.");
        if (dto.getUserId() == null) throw new RuntimeException("user_id가 없습니다.");
        if (dto.getContent() == null || dto.getContent().trim().isEmpty())
            throw new RuntimeException("content가 없습니다.");

        Comment comment = Comment.create(
                dto.getPostId(),
                dto.getUserId(),
                dto.getContent()
        );

        if (dto.getParentCommentId() != null) {
            comment.setParentCommentId(dto.getParentCommentId());
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

        if (userId == null || !comment.getUserId().equals(userId)) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }

        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("content가 없습니다.");
        }

        comment.updateContent(content);
        return CommentResponse.from(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글 없음"));

        if (userId == null || !comment.getUserId().equals(userId)) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }

        commentRepository.hardDeleteById(commentId);
    }

    @Transactional
    public void likeComment(Long commentId, Long userId) {
        if (userId == null) {
            throw new RuntimeException("로그인 필요");
        }

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("해당 댓글을 찾을 수 없습니다."));

        Optional<CommentLike> existingLike =
                commentLikeRepository.findByCommentIdAndUserId(commentId, userId);

        if (existingLike.isPresent()) {
            commentLikeRepository.delete(existingLike.get());
            comment.decreaseLikeCount();
        } else {
            commentLikeRepository.save(new CommentLike(commentId, userId));
            comment.increaseLikeCount();
        }
    }
}
