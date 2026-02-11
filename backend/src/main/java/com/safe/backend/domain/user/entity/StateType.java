package com.safe.backend.domain.user.entity;

public enum StateType {
    WARNING,    // 경고
    SUSPENDED,  // 정지
    BANNED,     // 영구정지
    DELETED,    // 삭제
    UNBLOCK     // 해제(기존 DB 데이터 호환용)
}
