package com.safe.backend.domain.aiservice.data.repository;

import com.safe.backend.domain.aiservice.data.Model.AiChatDBModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * AiChatDBRepository: AI 채팅 로그 DB 접근을 위한 JPA 리포지토리 인터페이스
 */
@Repository
public interface AiChatDBRepository extends JpaRepository<AiChatDBModel, Long> {

    /**
     * 특정 사용자의 채팅 이력을 최신순으로 조회
     */
    List<AiChatDBModel> findByUserIdOrderByCreatedDateAsc(Long userId);
}
