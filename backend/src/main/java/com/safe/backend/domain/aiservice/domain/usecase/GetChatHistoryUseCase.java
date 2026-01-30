package com.safe.backend.domain.aiservice.domain.usecase;

import com.safe.backend.domain.aiservice.domain.Entity.ChatMessageEntity;
import com.safe.backend.domain.aiservice.domain.repository.AiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * GetChatHistoryUseCase: 특정 사용자의 대화 기록을 가져오는 유즈케이스
 */
@Service
@RequiredArgsConstructor
public class GetChatHistoryUseCase {

    private final AiRepository aiRepository;

    public List<ChatMessageEntity> execute(String userId) {
        return aiRepository.getChatHistory(userId);
    }
}
