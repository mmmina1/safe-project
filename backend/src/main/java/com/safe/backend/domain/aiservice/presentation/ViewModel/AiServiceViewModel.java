package com.safe.backend.domain.aiservice.presentation.ViewModel;

// import com.safe.backend.domain.aiservice.domain.Entity.ChatEntity;
// import com.safe.backend.domain.aiservice.data.Model.ChatRequest;
import com.safe.backend.domain.aiservice.domain.Entity.ChatMessageEntity;
import com.safe.backend.domain.aiservice.domain.Entity.ChatResultEntity;
import com.safe.backend.domain.aiservice.presentation.DTO.ChatRequestDTO;
import com.safe.backend.domain.aiservice.presentation.DTO.ChatResultDTO;
import com.safe.backend.domain.aiservice.domain.usecase.ChatUseCase;
import com.safe.backend.domain.aiservice.domain.usecase.DiagnosisUseCase;
import com.safe.backend.domain.aiservice.domain.usecase.GetChatHistoryUseCase;
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
    private final GetChatHistoryUseCase getChatHistoryUseCase;

    // @PostMapping("/chat")
    // public ChatResult chat(@RequestBody ChatRequest request) {
    // // Domain Entity를 바로 반환 (Clean Architecture 원칙상 Presentation용 DTO로 변환하는게 좋지만,
    // // 편의상 사용)
    // return chatUseCase.execute(request.getMessage(), request.getSession_id());
    // }

    @PostMapping("/chat")
    public ChatResultDTO chat(@RequestBody ChatRequestDTO request) {
        // Domain Entity를 바로 반환 (Clean Architecture 원칙상 Presentation용 DTO로 변환하는게 좋지만,
        // 편의상 사용)
        // return chatUseCase.execute(request.getMessage(), request.getSession_id());

        ChatResultEntity chatResultEntity = chatUseCase.execute(request.getMessage(), request.getSession_id());
        return ChatResultDTO.fromEntity(chatResultEntity);
    }

    @GetMapping("/diagnosis")
    public String diagnose(@RequestParam String phoneNumber) {
        return diagnosisUseCase.execute(phoneNumber);
    }

    @GetMapping("/history")
    public List<ChatMessageEntity> getHistory(@RequestParam String userId) {
        return getChatHistoryUseCase.execute(userId);
    }

    @GetMapping("/health")
    public String health() {
        return "AI Service is running";
    }
}
