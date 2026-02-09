package com.safe.backend.domain.diagnosis.controller;

import com.safe.backend.domain.diagnosis.service.DiagnosisService;
import com.safe.backend.domain.user.entity.User; // [FIX] 도메인 User로 변경
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai/diagnosis")
@RequiredArgsConstructor
public class DiagnosisController {

    private final DiagnosisService diagnosisService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitDiagnosis(
            @AuthenticationPrincipal User user, // 이제 도메인 User 객체가 들어옴
            @RequestBody DiagnosisSubmitRequest request) {
        System.out.println("=== [진단 결과 수신] ===");
        System.out.println("사용자: " + user.getEmail()); // [FIX] getUsername() -> getEmail()
        System.out.println("점수: " + request.score());
        System.out.println("처방전 개수: " + (request.recommendations() != null ? request.recommendations().size() : 0));
        System.out.println("======================");

        try {
            diagnosisService.saveDiagnosisResult(
                    user.getEmail(), // [FIX] getUsername() -> getEmail()
                    request.score(),
                    request.answers(),
                    request.recommendations());
            return ResponseEntity.ok().body(Map.of("message", "저장 완료"));
        } catch (Exception e) {
            e.printStackTrace(); // 서버 로그에 에러 출력
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    public record DiagnosisSubmitRequest(
            int score,
            List<Map<String, Object>> answers,
            List<String> recommendations) {
    }
}