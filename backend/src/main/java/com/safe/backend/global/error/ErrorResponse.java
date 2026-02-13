package com.safe.backend.global.error;// com.safe.backend.global.error.ErrorResponse.java
import lombok.AllArgsConstructor;
import lombok.Getter;

public record ErrorResponse(String code, String message) {

    //  기존 코드 호환용: 메시지만 받는 생성자
    public ErrorResponse(String message) {
        this("ERROR", message);   // 기본 code 값은 서비스에 맞게 바꿔도 됨
    }
}