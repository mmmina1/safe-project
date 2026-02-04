package com.safe.backend.domain.community.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter @NoArgsConstructor
@Table(name = "comment_likes") // 👈 DB에 이 이름의 테이블이 '진짜' 있어야 함
public class CommentLike {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "comment_id", nullable = false) // 👈 DB 컬럼명 확인
    private Long commentId;

    @Column(name = "user_id", nullable = false) // 👈 DB 컬럼명 확인
    private Long userId;

    public CommentLike(Long commentId, Long userId) {
        this.commentId = commentId;
        this.userId = userId;
    }
}