package com.safe.backend.domain.community.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "VISIT_POST")
public class VisitPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long postId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "category", length = 30, nullable = false)
    private String category;

    @Column(name = "title", length = 200, nullable = false)
    private String title;

    @Lob
    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "visit_count", nullable = false)
    private Integer visitCount = 0;

    @Column(name = "like_count", nullable = false)
    private Integer likeCount = 0;

    @Column(name = "report_count", nullable = false)
    private Integer reportCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status = Status.NORMAL;

    @Column(name = "is_hidden", nullable = false)
    private Boolean isHidden = false;

    @Column(name = "created_date", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date", nullable = false)
    private LocalDateTime updatedDate;

    // 내부 Enum 정의 (외부 import 필요 없음)
    public enum Status {
        NORMAL, BLINDED, DELETED
    }

    // 생성 전용 메서드
    public static VisitPost create(Long userId, String category, String title, String content) {
        VisitPost p = new VisitPost();
        p.userId = userId;
        p.category = category;
        p.title = title;
        p.content = content;

        p.visitCount = 0;
        p.likeCount = 0;
        p.reportCount = 0;
        p.status = Status.NORMAL;
        p.isHidden = false;

        LocalDateTime now = LocalDateTime.now();
        p.createdDate = now;
        p.updatedDate = now;
        return p;
    }

    // 수정 시 시간 갱신
    public void touchUpdatedDate(){
        this.updatedDate = LocalDateTime.now();
    }
}