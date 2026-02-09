package com.safe.backend.domain.aiservice.repository;

import com.safe.backend.domain.aiservice.entity.ChatMessageEntity;
import com.safe.backend.domain.aiservice.entity.ChatResultEntity;

import java.util.List;

public interface AiRepository {
    // ChatResult chat(String message, String userId);
    ChatResultEntity chat(String message, Long userId);

    String diagnosePhishing(String phoneNumber);

    List<ChatMessageEntity> getChatHistory(Long userId);

    Object startSimulation(String scenarioType);

    Object evaluateSimulation(String situation, String playerAnswer);
}
