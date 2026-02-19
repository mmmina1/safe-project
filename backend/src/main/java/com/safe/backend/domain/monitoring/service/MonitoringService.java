package com.safe.backend.domain.monitoring.service;

import com.safe.backend.domain.monitoring.dto.response.*;
import com.safe.backend.domain.monitoring.repository.RiskDetectionLogRepository;
import com.safe.backend.domain.monitoring.repository.RiskNumberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MonitoringService {

        private final RiskNumberRepository riskNumberRepository;
        private final RiskDetectionLogRepository riskDetectionLogRepository;

        public MonitoringResponse getMonitoringData() {

                LocalDate today = LocalDate.now(ZoneId.of("Asia/Seoul"));
                LocalDateTime todayStart = today.atStartOfDay();
                LocalDateTime tomorrowStart = today.plusDays(1).atStartOfDay();

                long todayCount = riskDetectionLogRepository.countByCreatedDate(today);
                long yesterdayCount = riskDetectionLogRepository.countByCreatedDate(today.minusDays(1));

                long changeCount = todayCount - yesterdayCount;

                Double changeRate = (yesterdayCount == 0)
                        ? null
                        : ((double) todayCount / yesterdayCount) * 100;


                StatsResponse stats = new StatsResponse(
                        todayCount,
                        yesterdayCount,
                        changeCount,
                        changeRate,
                        riskNumberRepository.countByActiveTrue()
                );


                // 2) fraud type ratio (today)
                List<FraudTypeResponse> fraudTypes = riskDetectionLogRepository.countByFraudType(today)
                        .stream()
                        .map(row -> new FraudTypeResponse(
                                (String) row[0],
                                ((Number) row[1]).longValue()
                        ))
                        .toList();

                // 3) region ratio (today)   fraud_log 말고 risk_detection_log
                List<RegionResponse> regions = riskDetectionLogRepository.countByRegion(today)
                        .stream()
                        .map(row -> new RegionResponse(
                                (String) row[0],
                                ((Number) row[1]).longValue()
                        ))
                        .toList();

                // 4) hourly trend (today)  created_at 기반
                List<Object[]> hourRows = riskDetectionLogRepository.countByHour(todayStart, tomorrowStart);

                Map<Integer, Long> hourToCount = hourRows.stream()
                        .collect(Collectors.toMap(
                                row -> ((Number) row[0]).intValue(),
                                row -> ((Number) row[1]).longValue()
                        ));

                List<HourlyDetectResponse> hourlyDetects = new ArrayList<>();
                for (int h = 0; h < 24; h++) {
                        hourlyDetects.add(new HourlyDetectResponse(h, hourToCount.getOrDefault(h, 0L)));
                }

                return MonitoringResponse.of(stats, fraudTypes, regions, hourlyDetects);
        }
}
