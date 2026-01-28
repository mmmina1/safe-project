package com.safe.backend.global.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiResponse<T> {
    
    private boolean success;  // 성공/실패
    private T data;           // 실제 데이터
    private String message;   // 에러 메시지 or 안내 메시지

    // 성공 응답용
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null);
    }

    // 실패 응답용
    public static <T> ApiResponse<T> fail(String message) {
        return new ApiResponse<>(false, null, message);
    }

}
