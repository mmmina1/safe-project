package com.safe.backend.domain.productReview.dto;

import java.math.BigDecimal;

public record ReviewSummaryResponse (
    
    Long productId,
    BigDecimal avgRating,
    Long reviewCount

){}