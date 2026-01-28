package com.safe.backend.global.error;// com.safe.backend.global.error.GlobalExceptionHandler.java

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 이메일 중복 / 잘못된 요청
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity
                .badRequest() // 400
                .body(new ErrorResponse(e.getMessage()));
    }

    // (선택) 예상 못 한 서버 에러
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        return ResponseEntity
                .internalServerError()
                .body(new ErrorResponse("서버 오류가 발생했습니다."));
    }
}
