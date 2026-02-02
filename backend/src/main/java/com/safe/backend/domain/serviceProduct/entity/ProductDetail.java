package com.safe.backend.domain.serviceProduct.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detail_id")
    private Long detailId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "price")
    private Integer price;

    @Column(name = "stock_qty")
    private Integer stockQty;

    @Column(name = "service_level")
    private String serviceLevel;

    @Column(name = "detail_desc", columnDefinition = "TEXT")
    private String detailDesc;

    @Column(name="created_date")
    private LocalDate createdDate;

    @Column(name="updated_date")
    private LocalDate updatedDate;
    
}
