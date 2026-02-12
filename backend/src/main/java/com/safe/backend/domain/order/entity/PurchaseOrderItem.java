package com.safe.backend.domain.order.entity;

import com.safe.backend.domain.serviceProduct.entity.Product;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "purchase_order_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PurchaseOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Long orderItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "order_price", nullable = false)
    private Integer orderPrice; // 주문 시점의 가격

    @Column(nullable = false)
    private Integer quantity; // 주문 수량

    // --- 생성 메서드 ---
    public static PurchaseOrderItem createOrderItem(Product product, int orderPrice, int quantity) {
        PurchaseOrderItem orderItem = new PurchaseOrderItem();
        orderItem.product = product;
        orderItem.orderPrice = orderPrice;
        orderItem.quantity = quantity;
        return orderItem;
    }

    protected void setPurchaseOrder(PurchaseOrder purchaseOrder) {
        this.purchaseOrder = purchaseOrder;
    }

    public int getTotalPrice() {
        return orderPrice * quantity;
    }
}
