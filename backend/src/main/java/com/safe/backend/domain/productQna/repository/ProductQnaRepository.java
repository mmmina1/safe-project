package com.safe.backend.domain.productQna.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.safe.backend.domain.productQna.entity.ProductQna;

public interface ProductQnaRepository extends JpaRepository<ProductQna, Long>{

    Page<ProductQna> findByProduct_ProductId(Long productId, Pageable pageable);

    Page<ProductQna> findByWriter_UserId(Long userId, Pageable pageable);
    
}
