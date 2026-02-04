package com.safe.backend.domain.aiservice.domain.repository;

import com.safe.backend.domain.aiservice.domain.Entity.ChatMessageEntity;
import com.safe.backend.domain.aiservice.domain.Entity.ChatResultEntity;

import java.util.List;

public interface AiRepository {
    // ChatResult chat(String message, String userId);
    ChatResultEntity chat(String message, String userId);

    String diagnosePhishing(String phoneNumber);

    List<ChatMessageEntity> getChatHistory(String userId);

    Object startSimulation(String scenarioType);

    Object evaluateSimulation(String situation, String playerAnswer);
}
