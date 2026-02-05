package com.safe.backend.domain.admin.product.dto;

import com.safe.backend.domain.admin.product.PriceType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServiceProductRequest {
    private String name;
    private Long baseCategoryId;
    private PriceType priceType; // FREE / PAID
    private String mainImage;
    private String summary;
    private String description;
    private String status; // 판매 상태
}
