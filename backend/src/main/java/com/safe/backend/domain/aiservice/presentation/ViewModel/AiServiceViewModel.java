package com.safe.backend.domain.aiservice.presentation.ViewModel;

// import com.safe.backend.domain.aiservice.domain.Entity.ChatEntity;
// import com.safe.backend.domain.aiservice.data.Model.ChatRequest;
import com.safe.backend.domain.aiservice.domain.Entity.ChatMessageEntity;
import com.safe.backend.domain.aiservice.domain.Entity.ChatRequestEntity;
import com.safe.backend.domain.aiservice.domain.Entity.ChatResultEntity;
import com.safe.backend.domain.aiservice.domain.usecase.ChatUseCase;
import com.safe.backend.domain.aiservice.domain.usecase.DiagnosisUseCase;
import com.safe.backend.domain.aiservice.domain.usecase.SimulationUseCase;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
    public ChatResultEntity chat(@RequestBody ChatRequestEntity request) {
        // Domain Entity를 바로 반환 (Clean Architecture 원칙상 Presentation용 DTO로 변환하는게 좋지만,
        // 편의상 사용)
        // return chatUseCase.execute(request.getMessage(), request.getSession_id());

        ChatResultEntity chatResultEntity = chatUseCase.execute(request.getMessage(), request.getSession_id());
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
    @GetMapping("/history")
    public List<ChatMessageEntity> getHistory(@RequestParam String userId) {
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
