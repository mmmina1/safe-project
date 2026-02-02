package com.safe.backend.domain.admin.product.dto;

import com.safe.backend.domain.admin.product.PriceType;
import com.safe.backend.domain.admin.product.ServiceProduct;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ServiceProductResponse {
    private Long productId;
    private String name;
    private Long baseCategoryId;
    private PriceType priceType;
    private String mainImage;
    private String summary;
    private String description;
    private String status;
    private Integer isActive;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    public ServiceProductResponse(ServiceProduct product) {
        this.productId = product.getProductId();
        this.name = product.getName();
        this.baseCategoryId = product.getBaseCategoryId();
        this.priceType = product.getPriceType();
        this.mainImage = product.getMainImage();
        this.summary = product.getSummary();
        this.description = product.getDescription();
        this.status = product.getStatus();
        this.isActive = product.getIsActive();
        this.createdDate = product.getCreatedDate();
        this.updatedDate = product.getUpdatedDate();
    }
}
