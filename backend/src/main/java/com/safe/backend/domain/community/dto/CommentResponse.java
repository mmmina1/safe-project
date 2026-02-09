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
    
    // 1. 하트 상태를 담을 필드 추가
    private Boolean isLiked; 

    // 2. 서비스에서 호출할 수 있게 파라미터 2개(comment, isLiked) 받는 메서드로 수정
    public static CommentResponse from(Comment comment, boolean isLiked) {
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
        
        // 3. 좋아요 여부 세팅
        dto.setIsLiked(isLiked); 
        
        return dto;
    }
}