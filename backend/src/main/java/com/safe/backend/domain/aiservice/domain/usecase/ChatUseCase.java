package com.safe.backend.domain.aiservice.domain.usecase;

<<<<<<< HEAD
import com.safe.backend.domain.aiservice.domain.model.ChatResult;
=======
import com.safe.backend.domain.aiservice.domain.Entity.ChatMessageEntity;
import com.safe.backend.domain.aiservice.domain.Entity.ChatResultEntity;
>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534
import com.safe.backend.domain.aiservice.domain.repository.AiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
<<<<<<< HEAD
=======
import java.util.List;
>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534

@Service
@RequiredArgsConstructor
public class ChatUseCase {

    private final AiRepository aiRepository;

<<<<<<< HEAD
    public ChatResult execute(String message, String userId) {
        // 비즈니스 로직 & 검증
        if (message == null || message.trim().isEmpty()) {
            return new ChatResult(
=======
    public ChatResultEntity execute(String message, String userId) {
        // 비즈니스 로직 & 검증
        if (message == null || message.trim().isEmpty()) {
            return new ChatResultEntity(
>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534
                    "메시지를 입력해주세요.",
                    Collections.emptyList(),
                    "validation_error");
        }
        return aiRepository.chat(message, userId);
    }
<<<<<<< HEAD
=======

    public List<ChatMessageEntity> execute(String userId) {
        return aiRepository.getChatHistory(userId);
    }

>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534
}
