package com.safe.backend.domain.serviceProduct.dto;

import com.safe.backend.domain.serviceProduct.entity.PriceType;
import com.safe.backend.domain.serviceProduct.entity.Product;

public record ProductListItem (
    //getter, 생성자 등 자동 생성 -> 데이터 담는 용도
    //상품 목록에 필요한 데이터 구조 정의

    Long id,
    String name,
    Integer price,
    Double rating,
    Integer reviewCount,
    String mainImage,
    Long categoryId,
    PriceType priceType
    
){

    //정적 팩토리 메서드
    public static ProductListItem of(Product p, Integer price, Double rating, Integer reviewCount) {

        Long categoryId = (p.getBaseCategory() != null)
            ? p.getBaseCategory().getCategoryId()
            : null;

        return new ProductListItem(

            p.getProductId(),
            p.getName(),
            price,
            rating,
            reviewCount,
            p.getMainImage(),
            categoryId,
            p.getPriceType()
        );
    }
}