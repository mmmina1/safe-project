package com.safe.backend.domain.community.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter @NoArgsConstructor
@Table(name = "comment_likes")
public class CommentLike {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "likes_id")
    private Long likesId;

    @Column(name = "comment_id", nullable = false) 
    private Long commentId;

    @Column(name = "user_id", nullable = false) 
    private Long userId;

    public CommentLike(Long commentId, Long userId) {
        this.commentId = commentId;
        this.userId = userId;
    }
}