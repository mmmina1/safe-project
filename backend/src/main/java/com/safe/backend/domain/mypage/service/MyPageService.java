package com.safe.backend.domain.mypage.service;

import com.safe.backend.domain.diagnosis.entity.AiDiagRecommendation;
import com.safe.backend.domain.diagnosis.entity.AiDiagSession;
import com.safe.backend.domain.diagnosis.repository.AiDiagRecommendationRepository;
import com.safe.backend.domain.diagnosis.repository.AiDiagSessionRepository;
import com.safe.backend.domain.mypage.dto.MypageDashboardResponse;
import com.safe.backend.domain.mypage.dto.RiskAnalysisResponse;
import com.safe.backend.domain.user.entity.User;
import com.safe.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyPageService {

    private final AiDiagSessionRepository sessionRepository;
    private final AiDiagRecommendationRepository recommendationRepository;
    private final UserRepository userRepository;

    public MypageDashboardResponse getDashboardData(String email) {
        // 1. 유저 찾기
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 2. 가장 최근 진단 기록 찾기
        Optional<AiDiagSession> latestSessionOpt = sessionRepository
                .findFirstByUserIdOrderByCreatedDateDesc(user.getUserId());

        if (latestSessionOpt.isEmpty()) {
            // 진단 기록이 없으면 기본값(0점) 리턴
            return MypageDashboardResponse.builder()
                    .userName(user.getName())
                    .safetyScore(0)
                    .safetyStatus("미진단")
                    .scoreHistory(Collections.emptyList())
                    .riskAnalysis(Collections.emptyList())
                    .build();
        }

        AiDiagSession session = latestSessionOpt.get();

        // 3. 최근 6개 점수 히스토리 (그래프용)
        List<AiDiagSession> history = sessionRepository.findAllByUserIdOrderByCreatedDateDesc(user.getUserId());
        List<Integer> scoreHistory = history.stream()
                .limit(6)
                .map(AiDiagSession::getOverallScore)
                .toList();
        // 최신순이라 그래프 그릴 땐 뒤집어줘야 할 수도 있음 (프론트에서 처리 or 여기서 reverse)
        List<Integer> chartScores = new ArrayList<>(scoreHistory);
        Collections.reverse(chartScores);

        // 4. 취약점 분석 (추천 과제)
        List<AiDiagRecommendation> recommendations = recommendationRepository
                .findByDiagSessionOrderBySortOrderAsc(session);
        List<RiskAnalysisResponse> analysisList = recommendations.stream()
                .map(rec -> new RiskAnalysisResponse(
                        rec.getRecText(), // label
                        rec.isChecked() ? "안전" : "주의", // status
                        rec.isChecked() ? "조치 완료됨" : "조치 필요", // desc
                        rec.isChecked() ? "CheckCircle2" : "ShieldAlert" // iconType
                ))
                .toList();

        // 5. 종합 응답 조립
        return MypageDashboardResponse.builder()
                .userName(user.getName())
                .safetyScore(session.getOverallScore())
                .safetyStatus(getSafetyStatusString(session.getOverallScore()))
                .scoreHistory(chartScores)
                .riskAnalysis(analysisList)
                .build();
    }

    private String getSafetyStatusString(int score) {
        if (score >= 80)
            return "안전";
        if (score >= 50)
            return "주의";
        return "위험";
    }
}