package com.safe.backend.domain.order.service;

import com.safe.backend.domain.cart.entity.Cart;
import com.safe.backend.domain.cart.repository.CartRepository;
import com.safe.backend.domain.order.dto.OrderResponse;
import com.safe.backend.domain.order.entity.PurchaseOrder;
import com.safe.backend.domain.order.entity.PurchaseOrderItem;
import com.safe.backend.domain.order.repository.OrderRepository;
import com.safe.backend.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;

    /**
     * 주문 생성 (장바구니 전체 결제)
     */
    @Transactional
    public Long createOrderFromCart(User user) {
        // 1. 장바구니 목록 조회
        List<Cart> cartItems = cartRepository.findByUserOrderByCreatedDateDesc(user);
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("장바구니가 비어있습니다.");
        }

        // 2. 주문 아이템 생성
        List<PurchaseOrderItem> orderItems = cartItems.stream()
                .map(cart -> {
                    int price = (cart.getProduct().getDetail() != null) ? cart.getProduct().getDetail().getPrice() : 0;
                    return PurchaseOrderItem.createOrderItem(cart.getProduct(), price, cart.getQuantity());
                })
                .collect(Collectors.toList());

        // 3. 주문 엔티티 생성
        PurchaseOrder order = PurchaseOrder.createOrder(user, orderItems);

        // 4. 저장
        orderRepository.save(order);

        // 5. 장바구니 비우기
        cartRepository.deleteAll(cartItems);

        return order.getOrderId();
    }

    /**
     * 주문 내역 조회
     */
    public List<OrderResponse> getMyOrders(User user) {
        List<PurchaseOrder> orders = orderRepository.findByUserWithItems(user);

        return orders.stream()
                .map(order -> new OrderResponse(
                        order.getOrderId(),
                        order.getOrderDate(),
                        order.getTotalPrice(),
                        order.getStatus(),
                        order.getOrderItems().stream()
                                .map(item -> new OrderResponse.OrderItemResponse(
                                        item.getProduct().getProductId(),
                                        item.getProduct().getName(),
                                        item.getQuantity(),
                                        item.getOrderPrice()))
                                .collect(Collectors.toList())))
                .collect(Collectors.toList());
    }
}
