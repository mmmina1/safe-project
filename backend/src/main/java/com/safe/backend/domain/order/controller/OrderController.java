package com.safe.backend.domain.order.controller;

import com.safe.backend.domain.order.dto.OrderResponse;
import com.safe.backend.domain.order.service.OrderService;
import com.safe.backend.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * 결제 완료 처리2 (장바구니 -> 주문)
     */
    @PostMapping("/checkout")
    public ResponseEntity<Long> checkout(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        Long orderId = orderService.createOrderFromCart(user);
        return ResponseEntity.ok(orderId);
    }

    /**
     * 주문 내역 조회
     */
    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        List<OrderResponse> orders = orderService.getMyOrders(user);
        return ResponseEntity.ok(orders);
    }

    /**
     * 주문 취소
     */
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long orderId, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        orderService.cancelOrder(orderId, user);
        return ResponseEntity.ok().build();
    }

    /**
     * 주문 상세 조회
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long orderId, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        OrderResponse order = orderService.getOrder(orderId, user);
        return ResponseEntity.ok(order);
    }
}
