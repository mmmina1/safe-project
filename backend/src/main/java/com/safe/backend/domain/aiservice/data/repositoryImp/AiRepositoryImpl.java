package com.safe.backend.domain.aiservice.data.repositoryImp;

import com.safe.backend.domain.aiservice.data.Model.ChatResponseModel;
import com.safe.backend.domain.aiservice.data.datasource.AiChatDBDataSource;
import com.safe.backend.domain.aiservice.data.datasource.PythonAiDataSource;
import com.safe.backend.domain.aiservice.domain.Entity.ChatMessageEntity;
import com.safe.backend.domain.aiservice.domain.Entity.ChatResultEntity;
import com.safe.backend.domain.aiservice.domain.Entity.ChatSourceEntity;
import com.safe.backend.domain.aiservice.domain.repository.AiRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Repository
@RequiredArgsConstructor
public class AiRepositoryImpl implements AiRepository {

    private final PythonAiDataSource pythonAiDataSource;
    private final AiChatDBDataSource aiChatDBDataSource;

    @Override
    public ChatResultEntity chat(String message, String userId) {
        // 1. 파이썬 AI 서버와 통신
        ChatResponseModel response = pythonAiDataSource.sendChatMessage(message, userId);

        // 2. DB에 채팅 로그 저장 (비동기로 처리하는 것이 좋으나 우선 동기로 구현)
        try {
            long numericUserId = parseUserId(userId);
            aiChatDBDataSource.create(numericUserId, "user", message);
            aiChatDBDataSource.create(numericUserId, "bot", response.getAnswer());
        } catch (Exception e) {
            log.error("Failed to save chat log to DB: {}", e.getMessage());
        }

        // 3. DTO -> Domain Entity 변환
        return new ChatResultEntity(
                response.getAnswer(),
                response.getSources() != null ? response.getSources().stream()
                        .map(s -> new ChatSourceEntity(s.getContent(), s.getSource()))
                        .collect(Collectors.toList()) : java.util.Collections.emptyList(),
                response.getMode());
    }

    @Override
    public List<ChatMessageEntity> getChatHistory(String userId) {
        long numericUserId = parseUserId(userId);
        return aiChatDBDataSource.read(numericUserId).stream()
                .map(model -> new ChatMessageEntity(
                        model.getRole(),
                        model.getContent(),
                        model.getCreatedDate()))
                .collect(Collectors.toList());
    }

    @Override
    public String diagnosePhishing(String phoneNumber) {
        return pythonAiDataSource.requestDiagnosis(phoneNumber);
    }

    /**
     * userId 문자열을 Long으로 변환 (실제 서비스에서는 보안 세션 등에서 가져와야 함)
     */
    private long parseUserId(String userId) {
        try {
            return Long.parseLong(userId);
        } catch (NumberFormatException e) {
            // "react_user" 등 숫자가 아닌 경우 임시 ID 1L 반환
            return 1L;
        }
    }

}
