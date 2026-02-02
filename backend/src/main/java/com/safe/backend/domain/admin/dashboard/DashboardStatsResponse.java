package com.safe.backend.domain.admin.dashboard;

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
