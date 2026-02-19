package com.safe.backend.domain.admin.dashboard;

import com.safe.backend.domain.monitoring.dto.response.MonitoringResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 운영자 대시보드 요약 통계
 */
public record DashboardStatsResponse(
        long userCount,
        long pendingCsCount,
        long pendingReportCount,
        long noticeCount,
        long bannerCount,
        long blacklistCount,
        long productCount,
        long blindReasonCount
) {}
