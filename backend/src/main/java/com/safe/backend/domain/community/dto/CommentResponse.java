package com.safe.backend.domain.community.dto;

import com.safe.backend.domain.community.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {

    private Long commentId;
    private Long postId;
    private Long userId;
    private String name;
    private Long parentCommentId;
    private Integer commentLikeCount;
    private String content;
    private Boolean isDeleted;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    public static CommentResponse from(Comment comment) {
        CommentResponse dto = new CommentResponse();
        dto.setCommentId(comment.getCommentId());
        dto.setPostId(comment.getPostId());
        dto.setUserId(comment.getUserId());
        dto.setName(comment.getUser() != null ? comment.getUser().getName() : "익명");
        dto.setParentCommentId(comment.getParentCommentId());
        dto.setCommentLikeCount(comment.getCommentLikeCount());
        dto.setContent(comment.getContent());
        dto.setIsDeleted(comment.getIsDeleted());
        dto.setCreatedDate(comment.getCreatedDate());
        dto.setUpdatedDate(comment.getUpdatedDate());
        return dto;
    }
}
