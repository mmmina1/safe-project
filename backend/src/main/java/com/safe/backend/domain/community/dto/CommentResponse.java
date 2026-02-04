package com.safe.backend.domain.community.dto;

import com.safe.backend.domain.community.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter 
@Setter // 🔥 값 주입을 위해 Setter 추가
@NoArgsConstructor // 🔥 기본 생성자 추가
@AllArgsConstructor
public class CommentResponse {
    
    private Long commentId;
    private Long postId;
    private Long userId;
    private String name;
    private Long parentCommentId; // 🔥 프론트에서 parent_comment_id로 쓰는지 확인 필요
    private String content;
    private Integer commentLikeCount; // 🔥 이름을 commentLikeCount로 통일 (엔티티와 일치)
    private Boolean isDeleted;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    // Entity -> DTO 변환
    public static CommentResponse from(Comment comment) {
        CommentResponse dto = new CommentResponse();
        dto.setCommentId(comment.getCommentId());
        dto.setPostId(comment.getPostId());
        dto.setUserId(comment.getUserId());
        // 유저 이름 가져오기
        dto.setName(comment.getUser() != null ? comment.getUser().getName() : "익명");
        dto.setParentCommentId(comment.getParentCommentId());
        dto.setContent(comment.getContent());
        
        // 🔥 여기가 핵심! 고정값 0이 아니라 실제 엔티티의 숫자를 넣어줍니다.
        dto.setCommentLikeCount(comment.getCommentLikeCount()); 
        
        dto.setIsDeleted(comment.getIsDeleted());
        dto.setCreatedDate(comment.getCreatedDate());
        dto.setUpdatedDate(comment.getUpdatedDate());
        
        return dto;
    }
}