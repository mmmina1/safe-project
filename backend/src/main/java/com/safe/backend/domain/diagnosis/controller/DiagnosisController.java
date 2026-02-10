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
    private final com.safe.backend.domain.aiservice.data.datasource.PythonAiDataSource pythonAiDataSource;

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
            // 1. 파이썬 AI 서비스를 호출하여 답변 분석 (총평, TOP3, 맞춤 권장사항 수신)
            com.safe.backend.domain.aiservice.data.Model.PythonDiagnosisResponse aiResult = pythonAiDataSource
                    .analyzeDiagnosis(request.answers());

            // 2. 분석 결과와 함께 DB 저장
            diagnosisService.saveDiagnosisResult(
                    user.getEmail(),
                    request.diagnosisName(),
                    request.score(),
                    request.answers(),
                    aiResult.aiComment(),
                    aiResult.top3Types(),
                    aiResult.recommendations());

            return ResponseEntity.ok().body(Map.of("message", "저장 완료"));
        } catch (Exception e) {
            e.printStackTrace(); // 서버 로그에 에러 출력
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    public record DiagnosisSubmitRequest(
            String diagnosisName,
            int score,
            List<Map<String, Object>> answers,
            List<String> recommendations) {
    }
}