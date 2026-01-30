package com.safe.backend.domain.monitoring.service;

import com.safe.backend.domain.monitoring.dto.response.*;
import com.safe.backend.domain.monitoring.repository.FraudLogRepository;
import com.safe.backend.domain.monitoring.repository.RiskNumberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.time.LocalDate;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
public class MonitoringService {

        private final FraudLogRepository fraudLogRepository;
        private final RiskNumberRepository riskNumberRepository;

        public MonitoringResponse getMonitoringData() {
                // 오늘/어제 날짜 범위
                LocalDate today = LocalDate.now(ZoneId.of("Asia/Seoul")); // 서버 시간대를 KST로 명시
                LocalDateTime todayStart = today.atStartOfDay();
                LocalDateTime tomorrowStart = today.plusDays(1).atStartOfDay();
                LocalDateTime yesterdayStart = today.minusDays(1).atStartOfDay();

                long todayCount = fraudLogRepository.countByDateRange(todayStart, tomorrowStart);
                long yesterdayCount = fraudLogRepository.countByDateRange(yesterdayStart, todayStart);

                double changeRate = yesterdayCount == 0 ? 100.0
                                : ((double) (todayCount - yesterdayCount) / yesterdayCount) * 100;                
                StatsResponse stats = new StatsResponse(
                                todayCount,
                                changeRate,
                                riskNumberRepository.countByActiveTrue());

                List<FraudTypeResponse> fraudTypes = fraudLogRepository.countByFraudType().stream()
                                .map(row -> new FraudTypeResponse((String) row[0], (Long) row[1]))
                                .toList();

                List<RegionResponse> regions = fraudLogRepository.countByRegion().stream()
                                .map(row -> new RegionResponse((String) row[0], (Long) row[1]))
                                .toList();

                return MonitoringResponse.of(stats, fraudTypes, regions);
        }
}