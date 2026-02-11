package com.safe.backend.domain.productReview.dto;

public record ReviewLikeResponse(

    Long reviewId,
    Long likeCount,
    boolean likeByMe

){}
