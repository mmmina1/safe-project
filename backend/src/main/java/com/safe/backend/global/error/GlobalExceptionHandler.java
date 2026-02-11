package com.safe.backend.global.error;// com.safe.backend.global.error.GlobalExceptionHandler.java
import com.safe.backend.global.error.ErrorResponse;
import jakarta.persistence.PersistenceException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.logging.Level;
import java.util.logging.Logger;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = Logger.getLogger(GlobalExceptionHandler.class.getName());

    // 이메일 중복 / 잘못된 요청
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity
                .badRequest() // 400
                .body(new ErrorResponse(e.getMessage()));
    }

    // PathVariable/RequestParam 타입 변환 실패 (예: userId에 "undefined", "1:1" 등)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException e) {
        String param = e.getName();
        String value = e.getValue() != null ? String.valueOf(e.getValue()) : "null";
        String message = "잘못된 요청 값입니다. (" + param + ": " + value + ")";
        return ResponseEntity.badRequest().body(new ErrorResponse(message));
    }

    // DTO 검증 실패 (@Valid) - 공지 등 폼 검증
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(err -> err.getField() + " " + (err.getDefaultMessage() != null ? err.getDefaultMessage() : "값이 올바르지 않습니다."))
                .orElse("입력값을 확인해주세요.");
        return ResponseEntity.badRequest().body(new ErrorResponse(message));
    }

    // DB 제약 위반 (FK 등) - 400으로 반환해 원인 노출
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrity(DataIntegrityViolationException e) {
        log.log(Level.WARNING, "DataIntegrityViolation", e);
        String msg = e.getCause() != null ? e.getCause().getMessage() : e.getMessage();
        if (msg != null && msg.length() > 200) msg = msg.substring(0, 200);
        return ResponseEntity.badRequest().body(new ErrorResponse("데이터 제약으로 처리할 수 없습니다. " + (msg != null ? msg : "")));
    }

    // JPA/Persistence 예외
    @ExceptionHandler(PersistenceException.class)
    public ResponseEntity<ErrorResponse> handlePersistence(PersistenceException e) {
        log.log(Level.WARNING, "PersistenceException", e);
        return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage() != null ? e.getMessage() : "DB 처리 중 오류가 발생했습니다."));
    }

    // RuntimeException 처리
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException e) {
        log.log(Level.SEVERE, "RuntimeException", e);
        String message = e.getMessage() != null ? e.getMessage() : "처리 중 오류가 발생했습니다.";
        return ResponseEntity
                .internalServerError()
                .body(new ErrorResponse(message));
    }

    // (선택) 예상 못 한 서버 에러
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        log.log(Level.SEVERE, "Unhandled exception", e);
        e.printStackTrace(); // 스택 트레이스 출력
        return ResponseEntity
                .internalServerError()
                .body(new ErrorResponse("서버 오류가 발생했습니다: " + (e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName())));
    }
}
