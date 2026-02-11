package com.safe.backend.domain.user.entity;

public enum StateType {
    WARNING,    // 경고
    SUSPENDED,  // 정지
    BANNED,     // 영구정지 (과거 이력용)
    DELETED,    // 운영자 삭제
    UNBLOCK    // 제재 해제
}

