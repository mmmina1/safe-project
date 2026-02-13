package com.safe.backend.domain.order.entity;

public enum OrderStatus {
    PAYMENT_PENDING, // 결제 대기
    PAYMENT_COMPLETED, // 결제 완료
    PREPARING, // 배송 준비중
    SHIPPING, // 배송중
    DELIVERED, // 배송 완료
    CANCELLED, // 주문 취소
    REFUNDED // 환불 완료
}
