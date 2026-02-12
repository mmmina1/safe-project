package com.safe.backend.domain.order.dto;

import com.safe.backend.domain.order.entity.OrderStatus;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long orderId,
        LocalDateTime orderDate,
        Integer totalPrice,
        OrderStatus status,
        List<OrderItemResponse> items) {
    public record OrderItemResponse(
            Long productId,
            String productName,
            Integer quantity,
            Integer orderPrice) {
    }
}
