package com.safe.backend.domain.community.dto;

import java.time.LocalDateTime;
import com.safe.backend.domain.community.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 프론트엔드에 댓글 데이터를 쏴주기 위한 DTO
 * MySQL 컬럼명 변경 사항(comment_like_count, created_date)을 완벽 반영했습니다.
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CommentItem {
    
    private Long commentId;
    private Long postId;
    private Long userId;
    private String name;           
    private Long parentCommentId; // 프론트의 parent_comment_id와 매핑됨
    private String content;
    private Integer commentLikeCount;
    
    // 🔥 MySQL의 created_date 컬럼과 매핑된 필드
    private LocalDateTime createdDate; 
    private LocalDateTime updatedDate; // 수정일도 프론트에서 쓰기로 했으니 추가

    /**
     * Entity -> DTO 변환 메서드
     */
    public static CommentItem from(Comment comment) {
        String userName = "익명";
        if (comment.getUser() != null) {
            userName = comment.getUser().getName(); 
        }
        
        return new CommentItem(
            comment.getCommentId(),
            comment.getPostId(),
            comment.getUserId(),
            userName,
            comment.getParentCommentId(),   // 🔥 null 대신 실제 데이터 연결
            comment.getContent(),
            comment.getCommentLikeCount(), // 🔥 0 대신 실제 좋아요 수 연결
            comment.getCreatedDate(),      // 작성일
            comment.getUpdatedDate()       // 수정일 추가
        );
    }
}