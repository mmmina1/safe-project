package com.safe.backend.domain.user.entity;

public enum UserRiskActionType {
    // 실제 비즈니스 로직에 맞게 값 채우면 됨
    // 일단 임시로 몇 개만 예시로 둠
    WARNING,        // 경고
    SUSPEND,        // 일시 정지
    BAN,            // 영구 정지
    LIMIT_FEATURE   // 기능 제한
}
