package com.safe.backend.domain.serviceProduct.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.safe.backend.domain.serviceProduct.dto.ProductDetail;
import com.safe.backend.domain.serviceProduct.dto.ProductListItem;
import com.safe.backend.domain.serviceProduct.entity.Product;
import com.safe.backend.domain.serviceProduct.entity.ProductStatus;
import com.safe.backend.domain.serviceProduct.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)//읽기 전용
public class ProductService {
    
    private final ProductRepository productRepository;

    //1. 상품 목록 조회
    public Page<ProductListItem> getProducts(String q, String category, Pageable pageable) {
        ProductStatus status = ProductStatus.ON_SALE;

        boolean hasQ = q!= null && !q.isBlank();
        boolean hasCategory = category != null && !category.isBlank() && !category.equals("ALL");

        Page<Product> page;

        //2. 검색 조건
        if(hasCategory) {

            Long catId = Long.valueOf(category);
            if(hasQ) {
                page = productRepository.findByStatusAndBaseCategory_CategoryIdAndNameContainingIgnoreCase(status, catId, q, pageable);
            }else {
                page = productRepository.findByStatusAndBaseCategory_CategoryId(status, catId, pageable);
            }
        }else{
            if(hasQ){
                page = productRepository.findByStatusAndNameContainingIgnoreCase(status, q, pageable);
            }else{
                page = productRepository.findByStatus(status, pageable);
            }
        }

        //dto 반환
        return page.map(p -> ProductListItem.of(p, 0, 0.0, 0));

    }

    public ProductDetail getProductDetail(Long productId) {
        // SERVICE_PRODUCTS 테이블에서 기본 정보 조회
        Product p = productRepository.findByProductIdAndStatus(productId, ProductStatus.ON_SALE)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        // 실제 상품 데이터 사용
        Integer price = 0; // price 필드가 없으므로 0으로 설정 (priceType으로 판단)
        String description = p.getDescription() != null && !p.getDescription().isEmpty() 
                ? p.getDescription() 
                : (p.getSummary() != null ? p.getSummary() : "");
        // 평점과 리뷰 수는 추후 실제 데이터로 교체 필요
        return ProductDetail.of(p, price, description, 4.5, 10);
    }
}