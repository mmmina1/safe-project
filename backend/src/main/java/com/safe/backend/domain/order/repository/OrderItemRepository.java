package com.safe.backend.domain.order.repository;

import com.safe.backend.domain.order.entity.PurchaseOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<PurchaseOrderItem, Long> {
}
