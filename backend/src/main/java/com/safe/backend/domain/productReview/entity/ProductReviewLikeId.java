package com.safe.backend.domain.productReview.entity;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ProductReviewLikeId implements Serializable {

    private Long reviewId;
    private Long userId;
    
}
