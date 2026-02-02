package com.safe.backend.domain.monitoring.dto.response;

public record StatsResponse(
        long todayCount,
        double changeRate,
        long activeRiskCount
) {}
