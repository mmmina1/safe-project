package com.safe.backend.domain.productReview.dto;

import java.math.BigDecimal;

public record ReviewSummaryResponse (//평균 평점 + 리뷰 갯수
    
    Long productId,
    BigDecimal avgRating,
    Long reviewCount

){}