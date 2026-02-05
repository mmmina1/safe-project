package com.safe.backend.domain.productReview.dto;

import java.math.BigDecimal;

public record ReviewUpdateRequest (

    BigDecimal rating,
    String title, 
    String content
    
){}
