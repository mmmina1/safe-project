package com.safe.backend.domain.admin.dashboard;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RiskDashboardSnapshotResponse {

    // 오늘 새로 탐지된 위험 도메인 수
    private final long todaySuspiciousDomainCount;

    // 현재 활성(차단 유지) 중인 위험 도메인 수
    private final long activeBlockedDomainCount;

    // 정상 상태의 활성 회원 수
    private final long activeUserCount;

    // 오늘 생성된 제재 이력 수 (WARNING/SUSPENDED/BANNED)
    private final long todayUserSanctionCount;

    // 서버 상태 (임시로 NORMAL 하드코딩 가능)
    private final String serverStatus;

    // 대시보드 기준 시각
    private final LocalDateTime lastUpdatedAt;

    long changeCount;

    double changeRate;
}
