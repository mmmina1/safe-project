package com.safe.backend.domain.serviceProduct.dto;

import com.safe.backend.domain.serviceProduct.entity.Product;

public record ProductDetail(

    Long id,
    String name,
    Integer price,
    Double rating,
    String summary,
    Integer reviewCount,
    String mainImage,
    String description,
    Long categoryId,
    String status,
    String priceType
) {

    public static ProductDetail of (Product p, Integer price, String desc, Double rating, Integer reviewCount) {

        Long categoryId = (p.getBaseCategory() != null)
            ? p.getBaseCategory().getCategoryId()
            : null;

        return new ProductDetail(

            p.getProductId(),
            p.getName(),
            price,
            (rating != null ? rating : 0.0),
            (p.getSummary() != null ? p.getSummary() : ""),
            (reviewCount != null ? reviewCount : 0),
            p.getMainImage(),
            desc,
            categoryId,
            p.getStatus().name(),
            p.getPriceType().name()

        );
    }
}
