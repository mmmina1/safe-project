package com.safe.backend.domain.auth.controller;

import com.safe.backend.domain.auth.dto.*;
import com.safe.backend.domain.auth.service.AuthService;
import com.safe.backend.domain.auth.service.PasswordResetService;
import com.safe.backend.domain.user.entity.User;
import com.safe.backend.domain.user.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173","http://192.168.0.28:5173"})
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordResetService passwordResetService;

    public AuthController(AuthService authService,
                          UserRepository userRepository,
                          PasswordResetService passwordResetService) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.passwordResetService = passwordResetService;
    }

    /**
     * 회원가입
     */
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

    /**
     * 일반 이메일/비밀번호 로그인
     */
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
                    user.getName(),
                    user.getRole().name()
            );

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            // 비밀번호/이메일 오류 등 -> 400 + 에러 메시지
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * 카카오 로그인
     * - 프론트에서 code를 JSON body로 넘겨줌: { "code": "..." }
     * - AuthService.kakaoLogin(code) 에서 카카오 토큰/유저 조회 + 우리 JWT 발급까지 처리
     */
    @PostMapping("/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestBody KakaoLoginRequest request) {
        try {
            String code = request.getCode();
            if (code == null || code.isBlank()) {
                throw new IllegalArgumentException("카카오 인가 코드가 없습니다.");
            }

            // 1. 인가코드로 카카오 로그인 처리 + JWT 발급 (서비스로 위임)
            LoginResponse response = authService.kakaoLogin(code);

            // 2. accessToken / email / name 이 들어있는 LoginResponse 그대로 반환
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            // 잘못된 코드, 회원 정보 문제 등
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    /**
     * 구글 로그인
     * - 프론트에서 code를 JSON body로 넘겨줌: { "code": "..." }
     * - AuthService.googleLogin(code) 에서 토큰/유저 조회 + JWT 발급까지 처리
     */
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        try {
            String code = request.getCode();
            if (code == null || code.isBlank()) {
                throw new IllegalArgumentException("구글 인가 코드가 없습니다.");
            }

            // 1. 인가코드로 구글 로그인 처리 + JWT 발급 (서비스로 위임)
            LoginResponse response = authService.googleLogin(code);

            // 2. accessToken / email / name 이 들어있는 LoginResponse 그대로 반환
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            // 잘못된 코드, 회원 정보 문제 등
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<ForgotPasswordResponse> forgotPassword(
            @RequestBody ForgotPasswordRequest request
    ) {
        String token = passwordResetService.requestResetAndReturnTokenForDemo(request.email());

        // 가입 안 된 이메일이면 token = null 로 내려가도록
        return ResponseEntity.ok(
                new ForgotPasswordResponse("비밀번호 재설정 토큰을 발급했습니다.", token)
        );
    }

    // 2) 실제 비밀번호 재설정
    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(
            @RequestBody ResetPasswordRequest request
    ) {
        passwordResetService.resetPassword(request.token(), request.newPassword());
        return ResponseEntity.ok(new MessageResponse("비밀번호가 변경되었습니다."));
    }

    // DTO들
    public record ForgotPasswordRequest(String email) {}
    public record ForgotPasswordResponse(String message, String token) {}
    public record ResetPasswordRequest(String token, String newPassword) {}
    public record MessageResponse(String message) {}
}
