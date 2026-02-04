package com.safe.backend.domain.serviceProduct.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProductPlanDto {
    private Integer durationValue;
    private String durationUnit;      // "DAY" / "MONTH"
    private String periodText;        // "30일" / "12개월"
    private Integer finalPrice;       // 최종 가격(오버라이드 > 디테일 > 0/FREE)
}
