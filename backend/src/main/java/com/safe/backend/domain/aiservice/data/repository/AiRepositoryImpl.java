package com.safe.backend.domain.aiservice.data.repository;

import com.safe.backend.domain.aiservice.data.datasource.PythonAiDataSource;
import com.safe.backend.domain.aiservice.data.dto.ChatResponse;
import com.safe.backend.domain.aiservice.domain.model.ChatResult;
import com.safe.backend.domain.aiservice.domain.model.ChatSource;
import com.safe.backend.domain.aiservice.domain.repository.AiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class AiRepositoryImpl implements AiRepository {

    private final PythonAiDataSource pythonAiDataSource;

    @Override
    public ChatResult chat(String message, String userId) {
        ChatResponse response = pythonAiDataSource.sendChatMessage(message, userId);

        // DTO -> Domain Entity 변환
        return new ChatResult(
                response.getAnswer(),
                response.getSources() != null ? response.getSources().stream()
                        .map(s -> new ChatSource(s.getContent(), s.getSource()))
                        .collect(Collectors.toList()) : java.util.Collections.emptyList(),
                response.getMode());
    }

    @Override
    public String diagnosePhishing(String phoneNumber) {
        // 단순 문자열 반환이라 변환 불필요 (필요시 도메인 객체로 감쌀 수 있음)
        return pythonAiDataSource.requestDiagnosis(phoneNumber);
    }
}
