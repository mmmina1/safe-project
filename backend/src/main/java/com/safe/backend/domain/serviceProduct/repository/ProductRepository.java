package com.safe.backend.domain.serviceProduct.repository;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.safe.backend.domain.serviceProduct.entity.Product;
import com.safe.backend.domain.serviceProduct.entity.ProductStatus;


public interface ProductRepository extends JpaRepository<Product,Long> {

    // 1. 특정 상태(ON_SALE)인 상품 전체 조회
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    // 2. 특정 상태이면서 특정 카테고리에 속한 상품 조회 (서비스에서 필요한 메서드)
    Page<Product> findByStatusAndBaseCategory_CategoryId(ProductStatus status, Long categoryId, Pageable pageable);

    // 3. 특정 상태이면서 키워드 검색
    Page<Product> findByStatusAndNameContainingIgnoreCase(ProductStatus status, String q, Pageable pageable);
    
    // 4. 특정 상태 + 카테고리 필터 + 키워드 검색
    Page<Product> findByStatusAndBaseCategory_CategoryIdAndNameContainingIgnoreCase(
            ProductStatus status,
            Long categoryId,
            String q,
            Pageable pageable
    );

    // 5. 상세 페이지용 (단건 조회)
    Optional<Product> findByProductIdAndStatus(Long productId, ProductStatus status);   
}