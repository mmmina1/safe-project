package com.safe.backend.domain.aiservice.data.datasource;

import com.safe.backend.domain.aiservice.data.Model.AiChatDBModel;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AiChatDBDataSource: AI 채팅 로그를 DB에 직접 저장하고 관리하는 데이터 소스 클래스
 * EntityManager를 직접 사용하여 복잡한 리포지토리 인터페이스 없이 동작합니다.
 */
@Component
@RequiredArgsConstructor
public class AiChatDBDataSource {

    @PersistenceContext
    private final EntityManager em;

    /**
     * 새로운 채팅 메시지 저장
     */
    @Transactional
    public void create(long userId, String role, String content) {
        AiChatDBModel message = new AiChatDBModel(userId, role, content);
        System.out.println("LOG [DataSource]: DB에 직접 저장 시도 -> " + content);
        em.persist(message);
    }

    /**
     * 특정 사용자의 채팅 이력 조회
     */
    public List<AiChatDBModel> read(long userId) {
        return em.createQuery(
                "SELECT m FROM AiChatDBModel m WHERE m.userId = :userId ORDER BY m.createdDate ASC",
                AiChatDBModel.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    /**
     * 특정 메시지 삭제
     */
    @Transactional
    public void delete(long msgId) {
        AiChatDBModel message = em.find(AiChatDBModel.class, msgId);
        if (message != null) {
            em.remove(message);
        }
    }
}
