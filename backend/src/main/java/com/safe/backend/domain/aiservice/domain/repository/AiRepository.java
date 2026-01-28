package com.safe.backend.domain.aiservice.domain.repository;

import com.safe.backend.domain.aiservice.domain.model.ChatResult;

public interface AiRepository {
    ChatResult chat(String message, String userId);

    String diagnosePhishing(String phoneNumber);
}
