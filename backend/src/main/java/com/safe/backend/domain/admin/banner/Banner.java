package com.safe.backend.domain.admin.banner;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "banners")
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "banner_id")
    private Long bannerId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "link_url", length = 500)
    private String linkUrl;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Column(name = "is_active", nullable = false)
    private Integer isActive; // 1=ON, 0=OFF

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "created_date", nullable = true, updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "start_at")
    private LocalDateTime startAt; // 시작일

    @Column(name = "end_at")
    private LocalDateTime endAt; // 종료일

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (this.createdAt == null) {
            this.createdAt = now;
        }
        if (this.createdDate == null) {
            this.createdDate = now;
        }
        if (this.updatedAt == null) {
            this.updatedAt = now;
        }
        if (this.startAt == null) {
            this.startAt = now;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public static Banner of(String title, String imageUrl, String linkUrl, Integer displayOrder) {
        Banner b = new Banner();
        b.title = title;
        b.imageUrl = imageUrl;
        b.linkUrl = linkUrl;
        b.displayOrder = displayOrder;
        b.isActive = 1;
        LocalDateTime now = LocalDateTime.now();
        b.createdAt = now;
        b.createdDate = now;
        b.updatedAt = now;
        b.startAt = now; // 기본값: 현재 시간
        return b;
    }

    public void update(String title, String imageUrl, String linkUrl, LocalDateTime startAt, LocalDateTime endAt) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.linkUrl = linkUrl;
        this.startAt = startAt;
        this.endAt = endAt;
        this.updatedAt = LocalDateTime.now();
    }

    public void toggleActive() {
        this.isActive = (this.isActive != null && this.isActive == 1) ? 0 : 1;
        this.updatedAt = LocalDateTime.now();
    }

    public void setDisplayOrder(Integer order) {
        this.displayOrder = order;
        this.updatedAt = LocalDateTime.now();
    }
}
