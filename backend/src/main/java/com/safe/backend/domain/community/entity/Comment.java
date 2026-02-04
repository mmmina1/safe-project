package com.safe.backend.domain.community.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import com.safe.backend.domain.user.entity.User;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long commentId;

    @Column(name = "post_id", nullable = false)
    private Long postId;

    // 1. 매핑 복잡도를 줄이기 위해 직접 userId 필드만 사용하거나, 
    // 아래처럼 연관관계 설정이 되어있다면 중복된 Column 선언을 정리하는 게 좋습니다.
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "like_count", nullable = false)
    private int likeCount = 0; // 초기값 설정

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date", nullable = false)
    private LocalDateTime updatedDate;

    @Column(name = "parent_comment_id")
    private Long parentCommentId;

    // 2. 생성 메서드: 필드 누락 방지 및 가독성 최적화
    public static Comment create(Long postId, Long userId, String content) {
        Comment c = new Comment();
        c.setPostId(postId);
        c.setUserId(userId);
        c.setContent(content);
        c.setLikeCount(0);
        c.setIsDeleted(false);
        
        LocalDateTime now = LocalDateTime.now();
        c.setCreatedDate(now);
        c.setUpdatedDate(now);
        return c;
    }

    // 3. 수정 메서드: content가 null이거나 빈 값인 경우 방어 로직 추가 가능
    public void updateContent(String content) {
        if (content != null && !content.trim().isEmpty()) {
            this.content = content;
            this.updatedDate = LocalDateTime.now();
        }
    }

    // 4. 삭제 메서드: 상태값 변경
    public void softDelete() {
        this.isDeleted = true;
        this.updatedDate = LocalDateTime.now();
    }
}