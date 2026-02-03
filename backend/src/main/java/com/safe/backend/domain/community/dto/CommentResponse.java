package com.safe.backend.domain.community.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

import com.safe.backend.domain.community.entity.Comment;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
public class CommentResponse {
    
    private Long commentId;
    private Long postId;
    private Long userId;
    private String name;             // username → name으로 변경
    private Long parentCommentId;
    private String content;
    private Integer likeCount;
    private Boolean isDeleted;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    

    // Entity -> DTO 변환
    public static CommentResponse from(Comment comment) {
        return new CommentResponse(
            comment.getCommentId(),
            comment.getPostId(),
            comment.getUserId(),
            comment.getUser() != null ? comment.getUser().getName() : "Unknown",
            null,
            comment.getContent(),
            0,                   // likeCount (엔티티에 없으면 일단 0)
            false,
            comment.getCreatedDate(),
            comment.getUpdatedDate()
        );
    }
}