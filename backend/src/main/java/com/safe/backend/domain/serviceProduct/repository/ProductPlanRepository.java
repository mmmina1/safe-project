package com.safe.backend.domain.serviceProduct.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.safe.backend.domain.serviceProduct.entity.ProductPlan;

public interface ProductPlanRepository extends JpaRepository<ProductPlan,Long>{

    Optional<ProductPlan> findByProduct_ProductId(Long productId);
    
}
