package com.safe.backend.domain.admin.banner.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BannerRequest {
    private String title;
    private String imageUrl;
    private String linkUrl;
    private Integer displayOrder;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
}
