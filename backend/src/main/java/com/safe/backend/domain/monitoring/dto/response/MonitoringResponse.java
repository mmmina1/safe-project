package com.safe.backend.domain.monitoring.dto.response;

import java.util.List;

public record MonitoringResponse(
        StatsResponse stats,
        List<FraudTypeResponse> fraudTypes,
        List<RegionResponse> regions
) {
    public static MonitoringResponse of(
            StatsResponse stats,
            List<FraudTypeResponse> fraudTypes,
            List<RegionResponse> regions
    ) {
        return new MonitoringResponse(stats, fraudTypes, regions);
    }
}
