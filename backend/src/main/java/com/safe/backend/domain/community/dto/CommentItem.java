package com.safe.backend.domain.community.dto;

import java.time.LocalDateTime;
import com.safe.backend.domain.community.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CommentItem {
    
    private Long commentId;
    private Long postId;
    private Long userId;
    private String name;           
    private Long parentCommentId; 
    private String content;
    private Integer commentLikeCount;
    private Boolean isLiked;  // 좋아요 상태 필드
    
    private LocalDateTime createdDate; 
    private LocalDateTime updatedDate; 

    /**
     * Entity -> DTO 변환 메서드
     * 서비스에서 해당 유저가 좋아요를 눌렀는지(isLiked) 판별해서 넘겨줘야 함
     */
    public static CommentItem from(Comment comment, boolean isLiked) {
        String userName = "익명";
        if (comment.getUser() != null) {
            userName = comment.getUser().getName(); 
        }
        
        return new CommentItem(
            comment.getCommentId(),
            comment.getPostId(),
            comment.getUserId(),
            userName,
            comment.getParentCommentId(),
            comment.getContent(),
            comment.getCommentLikeCount(),
            isLiked,             // 생성자 순서에 맞춰서 중간에 배치
            comment.getCreatedDate(),
            comment.getUpdatedDate()
        );
    }
}