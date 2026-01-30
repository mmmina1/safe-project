package com.safe.backend.domain.aiservice.domain.usecase;

import com.safe.backend.domain.aiservice.domain.Entity.ChatMessageEntity;
import com.safe.backend.domain.aiservice.domain.Entity.ChatResultEntity;
import com.safe.backend.domain.aiservice.domain.repository.AiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatUseCase {

    private final AiRepository aiRepository;

    public ChatResultEntity execute(String message, String userId) {
        // 비즈니스 로직 & 검증
        if (message == null || message.trim().isEmpty()) {
            return new ChatResultEntity(
                    "메시지를 입력해주세요.",
                    Collections.emptyList(),
                    "validation_error");
        }
        return aiRepository.chat(message, userId);
    }

    public List<ChatMessageEntity> execute(String userId) {
        return aiRepository.getChatHistory(userId);
    }

}
