package com.safe.backend.domain.serviceProduct.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import com.safe.backend.domain.serviceProduct.dto.ProductDetail;
import com.safe.backend.domain.serviceProduct.dto.ProductListItem;
import com.safe.backend.domain.serviceProduct.service.ProductService;

import lombok.RequiredArgsConstructor;



@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    //상품 목록 조회
    @GetMapping
    public Page<ProductListItem> getProducts(
        @RequestParam(required = false) String q,
        @RequestParam(required = false) String category,
        @RequestParam(required = false, defaultValue = "NEW") String sort,
        @RequestParam(required = false, defaultValue = "0") int page,
        @RequestParam(required = false, defaultValue = "12") int size
    ){
        //정렬 조건 생성
        Sort s = toSort(sort);
        //페이징 정보 생성
        PageRequest pageable = PageRequest.of(page, size, s);
        //서비스 호출 및 결과 반환
        return productService.getProducts(q, category, pageable);
    }

    //상품 상세 정보 
    @GetMapping("/{productId}")
    public ProductDetail getProductDetail(@PathVariable Long productId){
        return productService.getProductDetail(productId);
    }

    // 정렬 키워드를 db엔티티 필드명과 매핑하는 메서드
    private Sort toSort(String sort){
        return switch (sort) {
            // 최신순: createdDate 필드 기준 내림차순
            case "NEW" -> Sort.by(Sort.Direction.DESC, "createdDate"); 
            case "NAME" -> Sort.by(Sort.Direction.ASC, "name");

            // 가격순: 엔티티에 price가 포함되어 있을 경우 작동 (현재 구조에선 조인 필요)
            case "PRICE_ASC", "PRICE_DESC", "POPULAR" -> Sort.by(Sort.Direction.DESC, "createdDate");

            // 기본값: 최신순
            default -> Sort.by(Sort.Direction.DESC, "createdDate");
        };
    }
}
