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

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    // 핵심: DB 컬럼명과 필드명을 강제로 매핑해서 500 에러 방지
    @Column(name = "comment_like_count", nullable = false)
    private int commentLikeCount = 0; 

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date", nullable = false)
    private LocalDateTime updatedDate;

    @Column(name = "parent_comment_id")
    private Long parentCommentId;

    public static Comment create(Long postId, Long userId, String content) {
        Comment c = new Comment();
        c.setPostId(postId);
        c.setUserId(userId);
        c.setContent(content);
        c.setCommentLikeCount(0); // 초기값 명시
        c.setIsDeleted(false);
        
        LocalDateTime now = LocalDateTime.now();
        c.setCreatedDate(now);
        c.setUpdatedDate(now);
        return c;
    }

    public void updateContent(String content) {
        this.content = content;
        this.updatedDate = LocalDateTime.now();
    }

    // 500 에러 방지용 안전한 증가 로직
    public void increaseLikeCount() {
        this.commentLikeCount += 1;
        this.updatedDate = LocalDateTime.now();
    }
}