package com.safe.backend.domain.auth.controller;

import com.safe.backend.domain.auth.dto.SignupRequest;
import com.safe.backend.domain.auth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {

        // 1. DTO에서 값 꺼내기
        String email = request.getEmail();
        String name = request.getName();
        String password = request.getPassword();

        // 2. 서비스에 회원가입 요청
        authService.signup(email, name, password);

        // 3. 클라이언트에게 응답
        return ResponseEntity.ok("회원가입이 완료되었습니다");

    }
}
