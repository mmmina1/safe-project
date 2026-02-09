package com.safe.backend.domain.mypage.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class MypageDashboardResponse {
    private String userName;
    private int safetyScore; // 종합 점수 (0~100)
    private String safetyStatus; // "안전", "주의", "위험"
    private List<Integer> scoreHistory; // 최근 6개월 점수 그래프용
    private List<RiskAnalysisResponse> riskAnalysis; // 취약 요인 분석 카드 리스트
}