package com.safe.backend.domain.admin.notice;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Entity
@Table(name = "notices")
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_id")
    private Long noticeId;

    @Convert(converter = NoticeTypeConverter.class)
    @Column(name = "notice_type", nullable = false, length = 30)
    private NoticeType noticeType;

    @Column(nullable = false, length = 200)
    private String title;

    @Lob
    @Column(nullable = false)
    private String content;

    // ✅ 사용자 공개 여부 (0/1)
    @Column(name = "published_yn", nullable = false)
    private Integer publishedYn;

    @Column(name = "is_active", nullable = false)
    private Integer isActive;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public static Notice of(NoticeType type, String title, String content) {
        // 기본: 공개(1), 활성(1)
        return new Notice(null, type, title, content, 1, 1, LocalDateTime.now());
    }

    // 활성 토글
    public void toggleActive() {
        this.isActive = (this.isActive != null && this.isActive == 1) ? 0 : 1;
    }

    // 공개 토글
    public void togglePublished() {
        this.publishedYn = (this.publishedYn != null && this.publishedYn == 1) ? 0 : 1;
    }

    public void update(String title, String content, NoticeType type) {
        this.title = title;
        this.content = content;
        this.noticeType = type;
    }
}
