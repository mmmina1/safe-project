package com.safe.backend.domain.order.repository;

import com.safe.backend.domain.order.entity.PurchaseOrder;
import com.safe.backend.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<PurchaseOrder, Long> {

    @Query("SELECT o FROM PurchaseOrder o JOIN FETCH o.orderItems oi JOIN FETCH oi.product WHERE o.user = :user ORDER BY o.orderDate DESC")
    List<PurchaseOrder> findByUserWithItems(@Param("user") User user);
}
