package com.safe.backend.domain.serviceProduct.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.safe.backend.domain.serviceProduct.entity.ProductDetail;

public interface ProductDetailRepository extends JpaRepository<ProductDetail, Long> {

    Optional<ProductDetail> findByProductId(Long productId);
}
