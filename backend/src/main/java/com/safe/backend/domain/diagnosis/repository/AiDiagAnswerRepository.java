package com.safe.backend.domain.diagnosis.repository;

import com.safe.backend.domain.diagnosis.entity.AiDiagAnswer;
import com.safe.backend.domain.diagnosis.entity.AiDiagSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AiDiagAnswerRepository extends JpaRepository<AiDiagAnswer, Long> {

    // 특정 진단 세션에 달린 답안들 가져오기
    List<AiDiagAnswer> findByDiagSession(AiDiagSession diagSession);
}