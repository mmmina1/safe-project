package com.safe.backend.domain.order.entity;

import com.safe.backend.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "purchase_orders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PurchaseOrderItem> orderItems = new ArrayList<>();

    @Column(name = "total_price", nullable = false)
    private Integer totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(name = "payment_key")
    private String paymentKey; // Toss Payments paymentKey

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    // --- 생성 메서드 ---
    public static PurchaseOrder createOrder(User user, List<PurchaseOrderItem> orderItems) {
        PurchaseOrder order = new PurchaseOrder();
        order.user = user;
        order.status = OrderStatus.PAYMENT_COMPLETED; // 기본 완료로 처리 (Mock 연동용)
        order.orderDate = LocalDateTime.now();
        order.createdDate = LocalDateTime.now();
        order.updatedDate = LocalDateTime.now();

        int total = 0;
        for (PurchaseOrderItem orderItem : orderItems) {
            order.addOrderItem(orderItem);
            total += orderItem.getTotalPrice();
        }
        order.totalPrice = total;

        return order;
    }

    public void addOrderItem(PurchaseOrderItem orderItem) {
        orderItems.add(orderItem);
        orderItem.setPurchaseOrder(this);
    }

    public void setPaymentKey(String paymentKey) {
        this.paymentKey = paymentKey;
        this.updatedDate = LocalDateTime.now();
    }
}
