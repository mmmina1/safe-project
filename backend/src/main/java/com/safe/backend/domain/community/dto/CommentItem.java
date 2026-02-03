package com.safe.backend.domain.community.dto;

import java.time.LocalDateTime;
import com.safe.backend.domain.community.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 프론트엔드에 댓글 데이터를 쏴주기 위한 힙한 DTO
 * MySQL 컬럼명 변경 사항(created_date)을 완벽 반영했습니다.
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor // JSON 변환을 위해 기본 생성자 추가 권장
public class CommentItem {
    
    private Long commentId;
    private Long postId;
    private Long userId;
    private String name;           
    private Long parentCommentId;
    private String content;
    private Integer likeCount;
    
    // 🔥 MySQL의 created_date 컬럼과 매핑된 필드
    private LocalDateTime createdDate; 
    
    /**
     * Entity -> DTO 변환 메서드
     * comment.getCreatedDate()가 null이면 에러가 날 수 있으니 안전하게 매핑합니다.
     */
    public static CommentItem from(Comment comment) {
        String name = null;
        if (comment.getUser() != null) {
            // User 엔티티의 필드가 name인지 확인하세요! (보통 name 혹은 nickname 사용)
            name = comment.getUser().getName(); 
        }
        
        return new CommentItem(
            comment.getCommentId(),
            comment.getPostId(),
            comment.getUserId(),
            name,
            null, //
            comment.getContent(),
            0,    //
            comment.getCreatedDate() // 🔥 엔티티에서 가져온 created_date
        );
    }
}