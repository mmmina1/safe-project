package com.safe.backend.domain.productReview.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_review_like")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ProductReviewLike {
    
    @EmbeddedId
    private ProductReviewLikeId id;

    @CreationTimestamp
    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    public static ProductReviewLike of(Long reviewId, Long userId){
        return ProductReviewLike.builder()
            .id(new ProductReviewLikeId(reviewId, userId))
            .build();
    }
    
}
