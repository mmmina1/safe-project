package com.safe.backend.domain.productReview.dto;

import java.math.BigDecimal;

public record ReviewCreateRequest (

    BigDecimal rating,
    String title, 
    String content
    
){}