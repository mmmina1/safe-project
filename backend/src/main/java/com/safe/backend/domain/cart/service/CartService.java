package com.safe.backend.domain.cart.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.safe.backend.domain.cart.entity.Cart;
import com.safe.backend.domain.cart.repository.CartRepository;
import com.safe.backend.domain.serviceProduct.entity.Product;
import com.safe.backend.domain.serviceProduct.repository.ProductRepository;
import com.safe.backend.domain.user.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository; // 상품 정보 조회용

    /**
     * C. 장바구니 담기
     */
    @Transactional
    public void addToCart(User user, Long productId, Long planId, Integer quantity) {
        // 1. 상품 존재 확인
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));

        // 2. 이미 장바구니에 있는지 확인
        Optional<Cart> existingCart = cartRepository.findByUserAndProductAndPlanId(user, product, planId);

        if (existingCart.isPresent()) {
            // 3. 있으면 수량만 추가 (더하기)
            Cart cart = existingCart.get();
            cart.updateQuantity(cart.getQuantity() + quantity);
        } else {
            // 4. 없으면 새로 생성
            Cart newCart = new Cart(user, product, planId, quantity);
            cartRepository.save(newCart);
        }
    }

    /**
     * R. 장바구니 목록 조회
     */
    public List<Cart> getMyCart(User user) {
        return cartRepository.findByUserOrderByCreatedDateDesc(user);
    }

    /**
     * U. 장바구니 수정
     */
    @Transactional
    public void updateCartItem(User user, Long cartId, Integer quantity) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니 상품이 존재하지 않습니다."));

        // 내 장바구니가 맞는지 보안 체크
        if (!cart.getUser().getUserId().equals(user.getUserId())) {
            throw new SecurityException("본인의 장바구니만 수정할 수 있습니다.");
        }

        cart.updateQuantity(quantity);
    }

    /**
     * D. 장바구니 삭제
     */
    @Transactional
    public void deleteCartItem(User user, Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니 상품이 존재하지 않습니다."));

        // 내 장바구니가 맞는지 보안 체크
        if (!cart.getUser().getUserId().equals(user.getUserId())) {
            throw new SecurityException("본인의 장바구니만 삭제할 수 있습니다.");
        }

        cartRepository.delete(cart);
    }
}
