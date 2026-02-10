package com.safe.backend.domain.serviceProduct.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_plan")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long planId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Column(nullable = false)
    private Integer durationValue;   // 30, 12 등

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private DurationUnit durationUnit; // DAY / MONTH

    @Column
    private Integer priceOverride;   // null이면 PRODUCT_DETAIL.price 사용

    @Column(nullable = false)
    private Boolean isActive = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum DurationUnit { DAY, MONTH }
}
