package com.safe.backend.domain.serviceProduct.dto;

import com.safe.backend.domain.serviceProduct.entity.Product;
import com.safe.backend.domain.serviceProduct.entity.ProductDetail;

public record ProductDetailResponse (

    Long id,
    String name,
    Integer price,
    Double rating,
    String summary,
    Integer stockQty,
    Integer reviewCount,
    String mainImage,
    String description,
    Long categoryId,
    String status,
    String priceType
) {

    public static ProductDetailResponse of (Product p, ProductDetail d,Double rating, Integer reviewCount) {

        Long categoryId = (p.getBaseCategory() != null)
            ? p.getBaseCategory().getCategoryId()
            : null;

        return new ProductDetailResponse(

            p.getProductId(),
            p.getName(),
            d.getPrice(),
            (rating != null ? rating : 0.0),
            (p.getSummary() != null ? p.getSummary() : ""),
            d.getStockQty(),
            (reviewCount != null ? reviewCount : 0),
            p.getMainImage(),
            d.getDetailDesc(),
            categoryId,
            p.getStatus().name(),
            p.getPriceType().name()

        );
    }
}
