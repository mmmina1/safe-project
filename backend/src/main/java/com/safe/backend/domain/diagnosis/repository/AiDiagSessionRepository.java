package com.safe.backend.domain.diagnosis.repository;

import com.safe.backend.domain.diagnosis.entity.AiDiagSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AiDiagSessionRepository extends JpaRepository<AiDiagSession, Long> {

    // 특정 유저의 모든 진단 기록 (날짜 내림차순 = 최신순)
    List<AiDiagSession> findAllByUserIdOrderByCreatedDateDesc(Long userId);

    // 특정 유저의 가장 최신 진단 기록 딱 1개 (Top 1)
    Optional<AiDiagSession> findFirstByUserIdOrderByCreatedDateDesc(Long userId);
}