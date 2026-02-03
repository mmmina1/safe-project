package com.safe.backend.domain.serviceProduct.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.safe.backend.domain.serviceProduct.dto.ProductDetail;
import com.safe.backend.domain.serviceProduct.dto.ProductListItem;
import com.safe.backend.domain.serviceProduct.entity.Product;
import com.safe.backend.domain.serviceProduct.entity.ProductStatus;
import com.safe.backend.domain.serviceProduct.repository.ProductDetailRepository;
import com.safe.backend.domain.serviceProduct.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)//읽기 전용
public class ProductService {
    
    private final ProductRepository productRepository;
    private final ProductDetailRepository productDetailRepository;

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

        // price는 product_detail에서 (없으면 0)
        return page.map(p -> {
            Integer price = (p.getDetail() != null && p.getDetail().getPrice() != null)
                    ? p.getDetail().getPrice()
                    : 0;

            // rating/reviewCount는 아직 집계 로직 없으니 0 처리(나중에 PRODUCT_REVIEW에서 AVG/COUNT)
            return ProductListItem.of(p, price, 0.0, 0);
        });
    }

    // 2) 상품 상세 조회
    public ProductDetail getProductDetail(Long productId) {
        Product p = productRepository.findByProductIdAndStatus(productId, ProductStatus.ON_SALE)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        // detail이 없을 수도 있으니 null-safe
        var d = p.getDetail(); // EntityGraph로 같이 로딩됨

        Integer price = (d != null) ? d.getPrice() : null;
        String desc = (d != null && d.getDetailDesc() != null) ? d.getDetailDesc() : p.getDescription();

        // rating/reviewCount는 PRODUCT_REVIEW 집계 전이라 0 처리
        return ProductDetail.of(p, price, desc, 0.0, 0);
    }
}