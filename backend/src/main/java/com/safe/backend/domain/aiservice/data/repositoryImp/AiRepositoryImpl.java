package com.safe.backend.domain.aiservice.data.repositoryImp;

import com.safe.backend.domain.aiservice.data.Model.ChatResponseModel;
import com.safe.backend.domain.aiservice.data.datasource.AiChatDBDataSource;
import com.safe.backend.domain.aiservice.data.datasource.PythonAiDataSource;
import com.safe.backend.domain.aiservice.entity.ChatMessageEntity;
import com.safe.backend.domain.aiservice.entity.ChatResultEntity;
import com.safe.backend.domain.aiservice.entity.ChatSourceEntity;
import com.safe.backend.domain.aiservice.repository.AiRepository;
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
    public ChatResultEntity chat(String message, Long userId) {

        // 1. 파이썬 AI 서버와 통신
        // 1. [변환!] Long(숫자)을 String(문자)으로 바꿔서 파이썬에게 보냅니다.
        // (null이면 "-1"로 변환)
        String sessionId = (userId != null) ? String.valueOf(userId) : "-1";

        // 2. 이제 에러 없이 들어갑니다! (sendChatMessage가 String을 기다리고 있으니까요)
        ChatResponseModel response = pythonAiDataSource.sendChatMessage(message, sessionId);

        // 2. DB에 채팅 로그 저장 (회원일 때만!)
        if (userId != null) { // 👈 이 체크가 꼭 필요합니다!
            try {
                aiChatDBDataSource.create(userId, "user", message);
                aiChatDBDataSource.create(userId, "bot", response.getAnswer());
            } catch (Exception e) {
                log.error("Failed to save chat log to DB: {}", e.getMessage());
            }
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
    public List<ChatMessageEntity> getChatHistory(Long userId) {
        return aiChatDBDataSource.read(userId).stream()
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

    @Override
    public Object startSimulation(String scenarioType) {
        return pythonAiDataSource.startSimulation(scenarioType);
    }

    @Override
    public Object evaluateSimulation(String situation, String playerAnswer) {
        return pythonAiDataSource.evaluateSimulation(situation, playerAnswer);
    }

}
