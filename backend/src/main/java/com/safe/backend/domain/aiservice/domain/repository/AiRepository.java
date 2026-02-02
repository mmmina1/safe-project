package com.safe.backend.domain.aiservice.domain.repository;

<<<<<<< HEAD
import com.safe.backend.domain.aiservice.domain.model.ChatResult;

public interface AiRepository {
    ChatResult chat(String message, String userId);

    String diagnosePhishing(String phoneNumber);
=======
import com.safe.backend.domain.aiservice.domain.Entity.ChatMessageEntity;
import com.safe.backend.domain.aiservice.domain.Entity.ChatResultEntity;

import java.util.List;

public interface AiRepository {
    // ChatResult chat(String message, String userId);
    ChatResultEntity chat(String message, String userId);

    String diagnosePhishing(String phoneNumber);

    List<ChatMessageEntity> getChatHistory(String userId);
>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534
}
