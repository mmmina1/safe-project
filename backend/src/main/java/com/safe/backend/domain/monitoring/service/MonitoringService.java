package com.safe.backend.domain.monitoring.service;

import com.safe.backend.domain.monitoring.dto.response.*;
import com.safe.backend.domain.monitoring.repository.FraudLogRepository;
import com.safe.backend.domain.monitoring.repository.RiskNumberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MonitoringService {

    private final FraudLogRepository fraudLogRepository;
    private final RiskNumberRepository riskNumberRepository;
    public MonitoringResponse getMonitoringData() {

    ZoneId kst = ZoneId.of("Asia/Seoul");

    LocalDate today = LocalDate.now(kst);

    LocalDateTime todayStart = today.atStartOfDay();
    LocalDateTime tomorrowStart = today.plusDays(1).atStartOfDay();
    LocalDateTime yesterdayStart = today.minusDays(1).atStartOfDay();

    long todayCount =
            fraudLogRepository.countByDateRange(todayStart, tomorrowStart);
            
    long yesterdayCount =
            fraudLogRepository.countByDateRange(yesterdayStart, todayStart);
        
    double changeRate;

        if (yesterdayCount == 0) {
        changeRate = 100.0; // 혹은 0.0, 정책에 따라
        } else {
        changeRate =
                ((double) (todayCount - yesterdayCount) / yesterdayCount) * 100;
        }
    StatsResponse stats = new StatsResponse(
            todayCount,
            changeRate,
            riskNumberRepository.countByActiveTrue()
    );
List<FraudTypeResponse> fraudTypes =
        fraudLogRepository.countByFraudType().stream()
                .map(row -> new FraudTypeResponse(
                        (String) row[0],
                        ((Number) row[1]).longValue()
                ))
                .toList();

List<RegionResponse> regions =
        fraudLogRepository.countByRegion().stream()
                .map(row -> new RegionResponse(
                        (String) row[0],
                        ((Number) row[1]).longValue()
                ))
                .toList();

return MonitoringResponse.of(stats, fraudTypes, regions);
}

}