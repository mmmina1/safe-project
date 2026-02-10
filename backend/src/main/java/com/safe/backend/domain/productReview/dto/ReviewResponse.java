package com.safe.backend.domain.productReview.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.safe.backend.domain.productReview.entity.ProductReview;

public record ReviewResponse (

    Long reviewId,
    Long productId,
    Long writerUserId,
    String writerName,
    BigDecimal rating, 
    String title,
    String content,
    Long likeCount,
    Boolean isVisible,
    LocalDateTime createdDate,
    LocalDateTime updatedDate,
    boolean likeByMe
){
    
    public static ReviewResponse from(ProductReview r, boolean likeByMe){
        return new ReviewResponse(
            r.getReviewId(),
            r.getProduct().getProductId(),
            r.getWriter().getUserId(),
            r.getWriter().getName(),
            r.getRating(),
            r.getTitle(),
            r.getContent(),
            r.getLikeCount(),
            r.getIsVisible(),
            r.getCreatedDate(),
            r.getUpdatedDate(),
            likeByMe
        );
    }
}
