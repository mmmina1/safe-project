package com.safe.backend.domain.aiservice.presentation;

import com.safe.backend.domain.aiservice.domain.model.ChatResult;
import com.safe.backend.domain.aiservice.domain.usecase.ChatUseCase;
import com.safe.backend.domain.aiservice.domain.usecase.DiagnosisUseCase;
import com.safe.backend.domain.aiservice.data.dto.ChatRequest; // 요청용 DTO는 Presentation에서도 사용
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AiServiceController {

    private final ChatUseCase chatUseCase;
    private final DiagnosisUseCase diagnosisUseCase;

    @PostMapping("/chat")
    public ChatResult chat(@RequestBody ChatRequest request) {
        // Domain Entity를 바로 반환 (Clean Architecture 원칙상 Presentation용 DTO로 변환하는게 좋지만,
        // 편의상 사용)
        return chatUseCase.execute(request.getMessage(), request.getSession_id());
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
