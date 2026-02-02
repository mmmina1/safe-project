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
    }
}
