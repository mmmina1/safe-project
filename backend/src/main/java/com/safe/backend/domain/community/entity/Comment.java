package com.safe.backend.domain.community.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import com.safe.backend.domain.user.entity.User;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id") // MySQL: comment_id
    private Long commentId;

    @Column(name = "post_id", nullable = false) // MySQL: post_id
    private Long postId;

    @Column(name = "user_id", nullable = false) // MySQL: user_id
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "like_count", nullable = false)
    private int likeCount;

    @Column(name = "is_deleted", nullable = false) // MySQL: is_deleted
    private Boolean isDeleted = false;

    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date", nullable = false)
    private LocalDateTime updatedDate;

    @Column(name = "parent_comment_id") // MySQL 컬럼명
    private Long parentCommentId;

    public static Comment create(Long postId, Long userId, String content) {
        Comment c = new Comment();
        c.postId = postId;
        c.userId = userId;
        c.content = content;
        c.likeCount = 0;
        c.isDeleted = false;
        LocalDateTime now = LocalDateTime.now();
        c.createdDate = now; // 매핑된 created_date 컬럼으로 저장
        c.updatedDate = now;
        return c;
    }
}