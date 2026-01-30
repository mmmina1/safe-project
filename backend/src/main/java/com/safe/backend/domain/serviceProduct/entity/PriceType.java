package com.safe.backend.domain.serviceProduct.entity;

import lombok.Getter;

@Getter
public enum PriceType {//타입의 안전성 (아무 문자열이 들어오는 것 막음)

    FREE("무료"),
    PAID("유료");

    private final String description;

    PriceType(String description){
        this.description = description;
    }
}
