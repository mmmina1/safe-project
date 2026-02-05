package com.safe.backend.domain.cart.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.safe.backend.domain.cart.dto.CartRequest;
import com.safe.backend.domain.cart.dto.CartResponse;
import com.safe.backend.domain.cart.service.CartService;
import com.safe.backend.domain.user.entity.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // 1. 내 장바구니 조회 (Response DTO 반환)
    @GetMapping
    public ResponseEntity<List<CartResponse>> getMyCart(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        // Entity List -> DTO List 변환
        List<CartResponse> responses = cartService.getMyCart(user).stream()
                .map(CartResponse::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    // 2. 장바구니 담기 (Request DTO 사용)
    @PostMapping
    public ResponseEntity<String> addToCart(
            @AuthenticationPrincipal User user,
            @RequestBody CartRequest request) { // Map 대신 DTO 사용

        if (user == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        cartService.addToCart(user, request.getProductId(), request.getPlanId(), request.getQuantity());
        return ResponseEntity.ok("장바구니에 담겼습니다.");
    }

    // 3. 장바구니 삭제
    @DeleteMapping("/{cartId}")
    public ResponseEntity<String> deleteCartItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long cartId) {

        if (user == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        try {
            cartService.deleteCartItem(user, cartId);
            return ResponseEntity.ok("삭제되었습니다.");
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body("권한이 없습니다.");
        }
    }
}
