package com.safe.backend.domain.productReview.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

import com.safe.backend.domain.productReview.entity.ProductReview;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long>{

    Page<ProductReview> findByProduct_ProductIdAndIsVisibleTrue(Long productId, Pageable pageable);

    long countByProduct_ProductIdAndIsVisibleTrue(Long productId);

    @Query("select coalesce(avg(r.rating), 0) from ProductReview r where r.product.productId = :productId and r.isVisible = true")
    BigDecimal avgRating(@Param("productId") Long productId);
}