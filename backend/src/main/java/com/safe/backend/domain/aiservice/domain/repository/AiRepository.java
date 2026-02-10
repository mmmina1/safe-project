package com.safe.backend.domain.aiservice.domain.repository;

import java.util.List;

import com.safe.backend.domain.aiservice.domain.entity.ChatMessageEntity;
import com.safe.backend.domain.aiservice.domain.entity.ChatResultEntity;

public interface AiRepository {
    // ChatResult chat(String message, String userId);
    ChatResultEntity chat(String message, Long userId);

    String diagnosePhishing(String phoneNumber);

    List<ChatMessageEntity> getChatHistory(Long userId);

    Object startSimulation(String scenarioType);

    Object evaluateSimulation(String situation, String playerAnswer);
}
