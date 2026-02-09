package com.safe.backend.domain.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RiskAnalysisResponse {
    private String label; // 예: "비밀번호 관리"
    private String status; // 예: "주의"
    private String desc; // 예: "3개월간 변경 없음"
    private String iconType; // 프론트에서 아이콘 고를 때 쓸 키워드 (예: "LOCK")
}