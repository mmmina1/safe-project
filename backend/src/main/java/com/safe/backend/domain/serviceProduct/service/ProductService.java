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

        // 지금은 임시 데이터를 넣었지만, 실제로는 ProductDetailRepository 조회가 필요함
        return ProductDetail.of(p, 10000, "상세 설명입니다", 4.5, 10);
    }
}