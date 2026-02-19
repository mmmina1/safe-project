package com.safe.backend.domain.admin.dashboard;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    // 1) 상단 카드용 리스크 스냅샷
    @GetMapping("/risk/summary")
    public ResponseEntity<RiskDashboardSnapshotResponse> getRiskSummary() {
        return ResponseEntity.ok(dashboardService.getRiskSnapshot());
    }

    // 2) 시간대별 탐지 추이 (라인차트)
    @GetMapping("/risk/trend")
    public ResponseEntity<RiskTrendResponse> getRiskTrend(
            @RequestParam(defaultValue = "24h") String range
    ) {
        return ResponseEntity.ok(dashboardService.getRiskTrend(range));
    }

    // 3) 유형별 비율 (도넛차트)
    @GetMapping("/risk/ratio")
    public ResponseEntity<List<RiskRatioItem>> getRiskRatio() {
        return ResponseEntity.ok(dashboardService.getRiskRatio());
    }
}
