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

    @Column(name = "like_count", nullable = false)
    private int likeCount;

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
        c.postId = postId;
        c.userId = userId;
        c.content = content;
        c.likeCount = 0;
        c.isDeleted = false;
        LocalDateTime now = LocalDateTime.now();
        c.createdDate = now;
        c.updatedDate = now;
        return c;
    }

    public void updateContent(String content) {
        this.content = content;
        this.updatedDate = LocalDateTime.now();
    }

    public void softDelete() {
        this.isDeleted = true;
        this.updatedDate = LocalDateTime.now();
    }
}
