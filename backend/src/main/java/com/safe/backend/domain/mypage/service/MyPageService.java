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
import org.springframework.security.crypto.password.PasswordEncoder;
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
        private final PasswordEncoder passwordEncoder;

        public MypageDashboardResponse getDashboardData(String email) {
                // 1. 유저 찾기
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

                // 2. 가장 최근 진단 기록 찾기
                Optional<AiDiagSession> latestSessionOpt = sessionRepository
                                .findFirstByUserIdOrderByCreatedDateDesc(user.getUserId());

                if (latestSessionOpt.isEmpty()) {
                        return MypageDashboardResponse.builder()
                                        .userName(user.getName())
                                        .safetyScore(0)
                                        .safetyStatus("미진단")
                                        .scoreHistory(Collections.emptyList())
                                        .riskAnalysis(Collections.emptyList())
                                        .build();
                }

                AiDiagSession session = latestSessionOpt.get();

                // 3. 최근 6개 점수 히스토리
                List<AiDiagSession> history = sessionRepository.findAllByUserIdOrderByCreatedDateDesc(user.getUserId());
                List<Integer> scoreHistory = history.stream()
                                .limit(6)
                                .map(AiDiagSession::getOverallScore)
                                .toList();
                List<Integer> chartScores = new ArrayList<>(scoreHistory);
                Collections.reverse(chartScores);

                // 4. 취약점 분석
                List<AiDiagRecommendation> recommendations = recommendationRepository
                                .findByDiagSessionOrderBySortOrderAsc(session);
                List<RiskAnalysisResponse> analysisList = recommendations.stream()
                                .map(rec -> new RiskAnalysisResponse(
                                                rec.getRecText(),
                                                rec.isChecked() ? "안전" : "주의",
                                                rec.isChecked() ? "조치 완료됨" : "조치 필요",
                                                rec.isChecked() ? "CheckCircle2" : "ShieldAlert"))
                                .toList();

                // 5. 응답 조립
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

        @Transactional
        public void updateNickname(String email, String newNickname) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
                user.updateName(newNickname);
        }

        @Transactional
        public void updatePassword(String email, String currentPassword, String newPassword) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

                if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
                        throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
                }

                user.changePassword(passwordEncoder.encode(newPassword));
        }

        @Transactional
        public void withdraw(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
                // 유저 상태를 ACTIVE -> DELETED로 변경
                user.setStatus(com.safe.backend.domain.user.entity.UserStatus.DELETED);
        }
}