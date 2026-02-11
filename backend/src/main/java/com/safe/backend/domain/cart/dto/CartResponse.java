package com.safe.backend.domain.cart.dto;

import com.safe.backend.domain.cart.entity.Cart;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CartResponse {
    private Long cartId;
    private Long productId;
    private String productName;
    private Long planId;
    private Integer quantity;
    private Integer price; // 상품 가격 (옵션 가격은 로직에 따라 추가 필요)
    private LocalDateTime createdDate;

    // Entity -> DTO 변환 생성자
    public CartResponse(Cart cart) {
        this.cartId = cart.getCartId();
        this.productId = cart.getProduct().getProductId();
        this.productName = cart.getProduct().getName();
        this.planId = cart.getPlanId();
        this.quantity = cart.getQuantity();
        // ProductDetail이 있다면 가격을 가져올 수 있음
        this.price = (cart.getProduct().getDetail() != null) ? cart.getProduct().getDetail().getPrice() : 0;
        this.createdDate = cart.getCreatedDate();
    }
}
