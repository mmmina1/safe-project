package com.safe.backend.domain.aiservice.presentation.viewmodel;

// import com.safe.backend.domain.aiservice.domain.Entity.ChatEntity;
// import com.safe.backend.domain.aiservice.data.Model.ChatRequest;
import com.safe.backend.domain.aiservice.domain.entity.ChatMessageEntity;
import com.safe.backend.domain.aiservice.domain.entity.ChatRequestEntity;
import com.safe.backend.domain.aiservice.domain.entity.ChatResultEntity;
import com.safe.backend.domain.aiservice.domain.usecase.ChatUseCase;
import com.safe.backend.domain.aiservice.domain.usecase.DiagnosisUseCase;
import com.safe.backend.domain.aiservice.domain.usecase.SimulationUseCase;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.safe.backend.domain.user.entity.User;

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
    //
    public ChatResultEntity chat(@RequestBody ChatRequestEntity request,
            @AuthenticationPrincipal Object principal) {
        // Domain Entity를 바로 반환 (Clean Architecture 원칙상 Presentation용 DTO로 변환하는게 좋지만,
        // 편의상 사용)
        // return chatUseCase.execute(request.getMessage(), request.getSession_id());

        Long userId = null;
        if (principal instanceof User) {
            userId = ((User) principal).getUserId();
        }

        ChatResultEntity chatResultEntity = chatUseCase.execute(request.getMessage(), userId);
        return chatResultEntity;
    }

    // 시뮬레이션 시작 (AI 첫 대사 생성)
    @GetMapping("/simulator/start")
    public Object startSimulation(@RequestParam String scenarioType) {
        return simulationUseCase.start(scenarioType);
    }

    // 시뮬레이션 평가 (사용자 응답 채점)
    @PostMapping("/simulator/evaluate")
    public Object evaluateSimulation(@RequestBody java.util.Map<String, String> request) {
        String situation = request.get("situation");
        String playerAnswer = request.get("player_answer");
        return simulationUseCase.evaluate(situation, playerAnswer);
    }

    // 채팅기록을 알려주는 루트
    // 파라미터 대신 '신분증'(@AuthenticationPrincipal)을 검사함
    @GetMapping("/history")
    public List<ChatMessageEntity> getHistory(@AuthenticationPrincipal Object principal) {

        // 1. 신분증에서 ID 꺼내기 (chat 메소드랑 똑같습니다!)
        Long userId = null;
        if (principal instanceof User) {
            userId = ((User) principal).getUserId();
        }

        // 2. 만약 로그인을 안 해서 ID가 없으면? -> 빈 리스트 반환 (채팅 기록 없음)
        if (userId == null) {
            return java.util.Collections.emptyList();
        }

        // 3. ID가 있으면 -> 기록 찾아주기
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
