package com.safe.backend.domain.auth.controller;

import com.safe.backend.domain.auth.dto.LoginRequest;
import com.safe.backend.domain.auth.dto.LoginResponse;
import com.safe.backend.domain.auth.dto.SignupRequest;
import com.safe.backend.domain.auth.service.AuthService;
import com.safe.backend.domain.user.entity.User;
import com.safe.backend.domain.user.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService,
                          UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
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
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // 1. 서비스에서 로그인 + JWT 토큰 발급
            String accessToken = authService.login(
                    request.getEmail(),
                    request.getPassword()
            );

            // 2. 이메일로 유저 조회 (이름/이메일 같이 내려주기 위함)
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() ->
                            new IllegalArgumentException("존재하지 않는 사용자입니다.")
                    );

            // 3. 토큰 + 유저 정보 JSON 형식으로 반환
            LoginResponse response = new LoginResponse(
                    accessToken,
                    user.getEmail(),
                    user.getName()
            );

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            // 비밀번호/이메일 오류 등 -> 400 + 에러 메시지
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
