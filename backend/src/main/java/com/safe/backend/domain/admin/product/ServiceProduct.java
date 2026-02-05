package com.safe.backend.domain.admin.product;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "service_products")
public class ServiceProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "base_category_id")
    private Long baseCategoryId; // FK → PRODUCT_CATEGORY.category_id

    @Enumerated(EnumType.STRING)
    @Column(name = "price_type", length = 20)
    private PriceType priceType; // FREE / PAID

    @Column(name = "main_image", length = 300)
    private String mainImage; // 대표 이미지

    @Column(name = "summary", length = 500)
    private String summary; // 짧은 소개

    @Column(length = 1000)
    private String description;

    @Column(name = "status", length = 20)
    private String status; // 판매 상태

    @Column(name = "is_active", nullable = false)
    private Integer isActive = 1;

    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
        this.updatedDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }

    public static ServiceProduct of(String name, PriceType priceType, String summary, String description) {
        ServiceProduct p = new ServiceProduct();
        p.name = name;
        p.priceType = priceType;
        p.summary = summary;
        p.description = description;
        p.isActive = 1;
        return p;
    }

    public void update(String name, PriceType priceType, String summary, String description, String mainImage, String status) {
        this.name = name;
        this.priceType = priceType;
        this.summary = summary;
        this.description = description;
        this.mainImage = mainImage;
        this.status = status;
    }

    public void toggleActive() {
        this.isActive = (this.isActive != null && this.isActive == 1) ? 0 : 1;
    }

    public void setBaseCategoryId(Long baseCategoryId) {
        this.baseCategoryId = baseCategoryId;
    }

    public void setMainImage(String mainImage) {
        this.mainImage = mainImage;
    }
}
