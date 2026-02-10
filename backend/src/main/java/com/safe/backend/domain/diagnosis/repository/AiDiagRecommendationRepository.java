package com.safe.backend.domain.diagnosis.repository;

import com.safe.backend.domain.diagnosis.entity.AiDiagRecommendation;
import com.safe.backend.domain.diagnosis.entity.AiDiagSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AiDiagRecommendationRepository extends JpaRepository<AiDiagRecommendation, Long> {

    // 특정 진단 세션에 달린 추천 과제들 (순서대로)
    List<AiDiagRecommendation> findByDiagSessionOrderBySortOrderAsc(AiDiagSession diagSession);
}