package com.safe.backend.domain.cart.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CartRequest {
    private Long productId;
    private Long planId;
    private Integer quantity;

    public CartRequest(Long productId, Long planId, Integer quantity) {
        this.productId = productId;
        this.planId = planId;
        this.quantity = quantity;
    }
}
