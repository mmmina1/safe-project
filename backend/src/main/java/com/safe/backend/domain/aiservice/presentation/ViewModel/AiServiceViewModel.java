package com.safe.backend.domain.aiservice.presentation.viewmodel;

import com.safe.backend.domain.aiservice.entity.ChatMessageEntity;
import com.safe.backend.domain.aiservice.entity.ChatRequestEntity;
import com.safe.backend.domain.aiservice.entity.ChatResultEntity;
import com.safe.backend.domain.aiservice.usecase.ChatUseCase;
import com.safe.backend.domain.aiservice.usecase.DiagnosisUseCase;
import com.safe.backend.domain.aiservice.usecase.SimulationUseCase;
import com.safe.backend.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AiServiceViewModel {

    private final ChatUseCase chatUseCase;
    private final DiagnosisUseCase diagnosisUseCase;
    private final SimulationUseCase simulationUseCase;

    // 채팅으로 ai에게 질문을 하는 루트
    @PostMapping("/chat")
    public ChatResultEntity chat(@RequestBody ChatRequestEntity request,
            @AuthenticationPrincipal Object principal) {

        Long userId = null;
        if (principal instanceof User) {
            userId = ((User) principal).getUserId();
        }

        return chatUseCase.execute(request.getMessage(), userId);
    }

    // 시뮬레이션 시작 (AI 첫 대사 생성)
    @GetMapping("/simulator/start")
    public Object startSimulation(@RequestParam String scenarioType) {
        return simulationUseCase.start(scenarioType);
    }

    // 시뮬레이션 평가 (사용자 응답 채점)
    @PostMapping("/simulator/evaluate")
    public Object evaluateSimulation(@RequestBody Map<String, String> request) {
        String situation = request.get("situation");
        String playerAnswer = request.get("player_answer");
        return simulationUseCase.evaluate(situation, playerAnswer);
    }

    // 채팅기록을 알려주는 루트
    @GetMapping("/history")
    public List<ChatMessageEntity> getHistory(@AuthenticationPrincipal Object principal) {

        Long userId = null;
        if (principal instanceof User) {
            userId = ((User) principal).getUserId();
        }

        if (userId == null) {
            return Collections.emptyList();
        }

        return chatUseCase.execute(userId);
    }

    @GetMapping("/diagnosis")
    public String diagnose(@RequestParam String phoneNumber) {
        return diagnosisUseCase.execute(phoneNumber);
    }

    @GetMapping("/health")
    public String health() {
        return "AI Service is running";
    }
}
