package com.safe.backend.domain.diagnosis.service;

import com.safe.backend.domain.diagnosis.entity.AiDiagAnswer;
import com.safe.backend.domain.diagnosis.entity.AiDiagRecommendation;
import com.safe.backend.domain.diagnosis.entity.AiDiagSession;
import com.safe.backend.domain.diagnosis.repository.AiDiagAnswerRepository;
import com.safe.backend.domain.diagnosis.repository.AiDiagRecommendationRepository;
import com.safe.backend.domain.diagnosis.repository.AiDiagSessionRepository;
import com.safe.backend.domain.user.entity.User;
import com.safe.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class DiagnosisService {

    private final AiDiagSessionRepository sessionRepository;
    private final AiDiagRecommendationRepository recommendationRepository;
    private final AiDiagAnswerRepository answerRepository;
    private final UserRepository userRepository;

    // 점수는 이미 계산돼서 넘어옴 (int score), 분석은 파이썬에서 함
    public AiDiagSession saveDiagnosisResult(String email, String diagnosisName, int score,
            List<Map<String, Object>> answers,
            String aiComment, List<String> top3Types, List<String> aiRecommendations) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 1. 세션 저장 (점수 + AI 요약/TOP3 저장)
        AiDiagSession session = AiDiagSession.builder()
                .userId(user.getUserId())
                .diagnosisName(diagnosisName)
                .overallScore(score)
                .aiComment(aiComment)
                .top3Types(top3Types != null ? String.join(",", top3Types) : null)
                .createdDate(LocalDateTime.now())
                .updatedDate(LocalDateTime.now())
                .build();

        sessionRepository.save(session);

        // 2. AI가 생성한 맞춤형 권장사항 저장
        List<AiDiagRecommendation> recommendations = new ArrayList<>();
        int order = 1;

        if (aiRecommendations != null) {
            for (String recText : aiRecommendations) {
                AiDiagRecommendation rec = AiDiagRecommendation.builder()
                        .diagSession(session)
                        .recText(recText)
                        .isChecked(false) // 미이행 상태
                        .sortOrder(order++)
                        .build();
                recommendations.add(rec);
            }
        }
        recommendationRepository.saveAll(recommendations);

        // 3. 사용자 답변 내역 저장 (데이터 분석용)
        if (answers != null) {
            List<AiDiagAnswer> aiDiagAnswers = new ArrayList<>();
            for (Map<String, Object> ans : answers) {
                String qKey = (String) ans.get("question_key");
                String qText = (String) ans.get("question_text");
                String aVal = (String) ans.get("answer_value");
                String aText = (String) ans.get("answer_text");

                AiDiagAnswer diagAnswer = AiDiagAnswer.builder()
                        .diagSession(session)
                        .questionKey(qKey)
                        .questionText(qText)
                        .answerValue(aVal)
                        .answerText(aText)
                        .build();
                aiDiagAnswers.add(diagAnswer);
            }
            answerRepository.saveAll(aiDiagAnswers);
        }

        return session;
    }

}