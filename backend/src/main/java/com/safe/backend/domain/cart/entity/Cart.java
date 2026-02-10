package com.safe.backend.domain.cart.entity;

import java.time.LocalDateTime;

import com.safe.backend.domain.serviceProduct.entity.Product;
import com.safe.backend.domain.user.entity.User;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cart")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Long cartId;

    // 누가 담았는지 (User와 강력한 연결)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 무엇을 담았는지 (Product와 강력한 연결)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // 어떤 옵션인지 (Plan은 엔티티가 없으므로 ID 숫자만 저장 - 약한 연결)
    @Column(name = "plan_id")
    private Long planId;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    // 생성자 (필수 정보만)
    public Cart(User user, Product product, Long planId, Integer quantity) {
        this.user = user;
        this.product = product;
        this.planId = planId;
        this.quantity = quantity;
        this.createdDate = LocalDateTime.now();
    }

    // 비즈니스 로직: 수량 변경
    public void updateQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
