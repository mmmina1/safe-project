package com.safe.backend.domain.serviceProduct.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.safe.backend.domain.serviceProduct.dto.ProductDetailResponse;
import com.safe.backend.domain.serviceProduct.dto.ProductListItem;
import com.safe.backend.domain.serviceProduct.dto.ProductPlanDto;
import com.safe.backend.domain.serviceProduct.entity.Product;
import com.safe.backend.domain.serviceProduct.entity.ProductDetail;
import com.safe.backend.domain.serviceProduct.entity.ProductPlan;
import com.safe.backend.domain.serviceProduct.entity.ProductStatus;
import com.safe.backend.domain.serviceProduct.repository.ProductDetailRepository;
import com.safe.backend.domain.serviceProduct.repository.ProductPlanRepository;
import com.safe.backend.domain.serviceProduct.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)//읽기 전용
public class ProductService {
    
    private final ProductRepository productRepository;
    private final ProductDetailRepository productDetailRepository;
    private final ProductPlanRepository productPlanRepository;

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
    public ProductDetailResponse getProductDetail(Long productId) {
        Product p = productRepository.findByProductIdAndStatus(productId, ProductStatus.ON_SALE)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        // detail이 없을 수도 있으니 null-safe
        ProductDetail d = p.getDetail();

        ProductPlan plan = productPlanRepository
                .findByProduct_ProductId(productId)
                .orElse(null);

        // ProductDetail이 없으면 기본값으로 처리
        if(d == null){
            // 기본값으로 ProductDetailResponse 생성
            Integer price = (p.getPriceType() != null && p.getPriceType().name().equals("FREE")) ? 0 : 0;
            ProductPlanDto planDto = buildPlanDtoWithDefaults(p, plan, price);
            
            Long categoryId = (p.getBaseCategory() != null) 
                ? p.getBaseCategory().getCategoryId() 
                : null;
            
            return new ProductDetailResponse(
                p.getProductId(),
                p.getName(),
                price,
                0.0,
                p.getSummary() != null ? p.getSummary() : "",
                0,
                0,
                p.getMainImage(),
                p.getDescription() != null ? p.getDescription() : "",
                categoryId,
                p.getStatus().name(),
                p.getPriceType().name(),
                planDto
            );
        }

        // 2. PlanDto 생성
        ProductPlanDto planDto = buildPlanDto(p, d, plan);

        return ProductDetailResponse.of(p,d,planDto,0.0, 0);
    }

    private ProductPlanDto buildPlanDto(Product p, ProductDetail d, ProductPlan plan) {

        boolean isFree = p.getPriceType().name().equals("FREE");

        // 1️⃣ 가격 결정
        Integer finalPrice;
        if (isFree) {
            finalPrice = 0;
        } else if (plan != null && plan.getPriceOverride() != null) {
            finalPrice = plan.getPriceOverride();
        } else {
            finalPrice = (d != null && d.getPrice() != null) ? d.getPrice() : 0; // fallback
        }

        // 2️⃣ 기간 텍스트
        Integer durationValue = (plan != null) ? plan.getDurationValue() : null;
        String durationUnit = (plan != null) ? plan.getDurationUnit().name() : null;

        String periodText;
        if (isFree) {
            periodText = "무료 · 즉시 적용";
        } else if (durationValue != null && durationUnit != null) {
            periodText = "DAY".equals(durationUnit)
                    ? durationValue + "일"
                    : durationValue + "개월";
        } else {
            periodText = "기간 정보 없음";
        }

        return ProductPlanDto.builder()
                .durationValue(durationValue)
                .durationUnit(durationUnit)
                .periodText(periodText)
                .finalPrice(finalPrice)
                .build();
    }

    private ProductPlanDto buildPlanDtoWithDefaults(Product p, ProductPlan plan, Integer defaultPrice) {
        boolean isFree = p.getPriceType() != null && p.getPriceType().name().equals("FREE");

        // 1️⃣ 가격 결정
        Integer finalPrice;
        if (isFree) {
            finalPrice = 0;
        } else if (plan != null && plan.getPriceOverride() != null) {
            finalPrice = plan.getPriceOverride();
        } else {
            finalPrice = (defaultPrice != null) ? defaultPrice : 0;
        }

        // 2️⃣ 기간 텍스트
        Integer durationValue = (plan != null) ? plan.getDurationValue() : null;
        String durationUnit = (plan != null) ? plan.getDurationUnit().name() : null;

        String periodText;
        if (isFree) {
            periodText = "무료 · 즉시 적용";
        } else if (durationValue != null && durationUnit != null) {
            periodText = "DAY".equals(durationUnit)
                    ? durationValue + "일"
                    : durationValue + "개월";
        } else {
            periodText = "기간 정보 없음";
        }

        return ProductPlanDto.builder()
                .durationValue(durationValue)
                .durationUnit(durationUnit)
                .periodText(periodText)
                .finalPrice(finalPrice)
                .build();
    }
}
