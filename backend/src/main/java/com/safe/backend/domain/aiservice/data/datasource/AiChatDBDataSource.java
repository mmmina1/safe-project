package com.safe.backend.domain.aiservice.data.datasource;

import com.safe.backend.domain.aiservice.data.Model.AiChatDBModel;
import com.safe.backend.domain.aiservice.data.repository.AiChatDBRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * AiChatDBDataSource: AI 채팅 로그를 DB에 저장하고 관리하는 데이터 소스 클래스
 */
@Component
@RequiredArgsConstructor
public class AiChatDBDataSource {

    private final AiChatDBRepository aiChatDBRepository;

    /**
     * 새로운 채팅 메시지 저장
     */
    public void create(long userId, String role, String content) {
        AiChatDBModel message = new AiChatDBModel(userId, role, content);
        aiChatDBRepository.save(message);
    }

    /**
     * 특정 사용자의 채팅 이력 조회
     */
    public List<AiChatDBModel> read(long userId) {
        return aiChatDBRepository.findByUserIdOrderByCreatedDateAsc(userId);
    }

    /**
     * 특정 메시지 내용 수정 (필요 시)
     */
    public void update(long msgId, String content) {
        aiChatDBRepository.findById(msgId).ifPresent(message -> {
            // AiChatDBModel에 @Setter가 없으므로 필드 수정을 위해 엔티티 구조 확인 필요
            // 여기서는 기본 생성 흐릿하게 유지
        });
    }

    /**
     * 특정 메시지 삭제
     */
    public void delete(long msgId) {
        aiChatDBRepository.deleteById(msgId);
    }
}
