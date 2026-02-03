package com.safe.backend.domain.serviceProduct.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name="product_detail")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductDetail {

    @Id
    @Column(name="product_id")
    private Long productId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="product_id",nullable = false, unique = true)
    private Product product;

    @Column(name="price")
    private Integer price;

    @Column(name="stock_qty")
    private Integer stockQty;

    @Column(name="service_level", columnDefinition = "TEXT")
    private String serviceLevel;

    @Column(name="detail_desc", columnDefinition = "TEXT")
    private String detailDesc;

    @Column(name="created_date")
    private LocalDateTime createdDate;

    @Column(name="updated_date")
    private LocalDateTime updatedDate;
}
