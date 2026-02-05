package com.safe.backend.domain.cart.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.safe.backend.domain.cart.entity.Cart;
import com.safe.backend.domain.user.entity.User;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    // 특정 유저의 장바구니 목록 조회 (최신순)
    List<Cart> findByUserOrderByCreatedDateDesc(User user);

    // 이미 장바구니에 담긴 상품인지 확인 (중복 담기 방지용)
    // 플랜(옵션)까지 같아야 같은 상품으로 취급
    Optional<Cart> findByUserAndProductAndPlanId(User user,
            com.safe.backend.domain.serviceProduct.entity.Product product, Long planId);
}
