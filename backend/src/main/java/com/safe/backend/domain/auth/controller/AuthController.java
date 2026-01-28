package com.safe.backend.domain.auth.controller;

import com.safe.backend.domain.auth.dto.LoginRequest;
import com.safe.backend.domain.auth.dto.SignupRequest;
import com.safe.backend.domain.auth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
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

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        try {
            authService.login(
                    request.getEmail(),
                    request.getPassword()
            );
            // 나중에는 여기서 JWT 토큰 리턴하거나, 유저 정보 리턴하는 걸로 확장 가능
            return ResponseEntity.ok("로그인에 성공했습니다");
        } catch (IllegalArgumentException e) {
            // 프론트에서 err.response.data 로 바로 사용 가능
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
