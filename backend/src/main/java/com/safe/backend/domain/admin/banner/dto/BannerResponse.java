package com.safe.backend.domain.admin.banner.dto;

import com.safe.backend.domain.admin.banner.Banner;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class BannerResponse {
    private Long bannerId;
    private String title;
    private String imageUrl;
    private String linkUrl;
    private Integer displayOrder;
    private Integer isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime startAt;
    private LocalDateTime endAt;

    public BannerResponse(Banner banner) {
        if (banner == null) {
            throw new IllegalArgumentException("Banner cannot be null");
        }
        try {
            this.bannerId = banner.getBannerId();
            this.title = banner.getTitle();
            this.imageUrl = banner.getImageUrl();
            this.linkUrl = banner.getLinkUrl();
            this.displayOrder = banner.getDisplayOrder();
            this.isActive = banner.getIsActive();
            this.createdAt = banner.getCreatedAt();
            this.updatedAt = banner.getUpdatedAt();
            this.startAt = banner.getStartAt();
            this.endAt = banner.getEndAt();
        } catch (Exception e) {
            System.err.println("BannerResponse 생성 중 오류 - bannerId: " + banner.getBannerId());
            e.printStackTrace();
            throw new RuntimeException("배너 응답 생성 실패: " + e.getMessage(), e);
        }
    }
}
