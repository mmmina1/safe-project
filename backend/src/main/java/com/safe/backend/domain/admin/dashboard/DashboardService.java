package com.safe.backend.domain.admin.dashboard;

import com.safe.backend.domain.admin.blindreason.BlindReasonRepository;
import com.safe.backend.domain.admin.banner.BannerRepository;
import com.safe.backend.domain.admin.blacklist.BlacklistRepository;
import com.safe.backend.domain.admin.community.PostReportRepository;
import com.safe.backend.domain.admin.cs.ConsultationStatus;
import com.safe.backend.domain.admin.cs.CsConsultationRepository;
import com.safe.backend.domain.admin.notice.NoticeRepository;
import com.safe.backend.domain.admin.product.ServiceProductRepository;
import com.safe.backend.domain.monitoring.dto.response.FraudTypeResponse;
import com.safe.backend.domain.monitoring.dto.response.HourlyDetectResponse;
import com.safe.backend.domain.monitoring.dto.response.MonitoringResponse;
import com.safe.backend.domain.monitoring.dto.response.StatsResponse;
import com.safe.backend.domain.monitoring.service.MonitoringService;
import com.safe.backend.domain.user.entity.UserStatus;
import com.safe.backend.domain.user.repository.UserRepository;
import com.safe.backend.domain.user.repository.UserStateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    // ===== 기존 운영자 대시보드 =====
    private final UserRepository userRepository;
    private final CsConsultationRepository csConsultationRepository;
    private final PostReportRepository postReportRepository;
    private final NoticeRepository noticeRepository;
    private final BannerRepository bannerRepository;
    private final BlacklistRepository blacklistRepository;
    private final ServiceProductRepository productRepository;
    private final BlindReasonRepository blindReasonRepository;

    // ===== 보안/리스크 대시보드 =====
    private final MonitoringService monitoringService;
    private final UserStateRepository userStateRepository;

    // ---------------- 기존 운영자 통계 ----------------

    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats() {
        long userCount = userRepository.countByStatus(UserStatus.ACTIVE);
        long pendingCsCount = csConsultationRepository.countByStatus(ConsultationStatus.PENDING);
        long pendingReportCount = postReportRepository.countByStatus("접수");
        long noticeCount = noticeRepository.count();
        long bannerCount = bannerRepository.count();
        long blacklistCount = blacklistRepository.count();
        long productCount = productRepository.count();
        long blindReasonCount = blindReasonRepository.count();

        return new DashboardStatsResponse(
                userCount,
                pendingCsCount,
                pendingReportCount,
                noticeCount,
                bannerCount,
                blacklistCount,
                productCount,
                blindReasonCount
        );
    }

    // ---------------- 리스크 스냅샷 (상단 카드) ----------------

    @Transactional(readOnly = true)
    public RiskDashboardSnapshotResponse getRiskSnapshot() {
        // 모니터링 집계 데이터 조회
        MonitoringResponse monitoring = monitoringService.getMonitoringData();
        StatsResponse stats = monitoring.stats(); // todayCount, changeRate, activeRiskCount

        // 1) 오늘 탐지된 의심 사례 수
        long todaySuspiciousDomainCount = stats.todayCount();

        // 2) 현재 활성 리스크 개수 (activeRiskCount)
        long activeBlockedDomainCount = stats.activeRiskCount();

        // 3) 현재 활성 회원 수
        long activeUserCount = userRepository.countByStatus(UserStatus.ACTIVE);

        // 4) 오늘 발생한 제재 이력 수
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay().minusNanos(1);

        long todayUserSanctionCount =
                userStateRepository.countByStateDateBetween(start, end);

        return RiskDashboardSnapshotResponse.builder()
                .todaySuspiciousDomainCount(todaySuspiciousDomainCount)
                .changeCount(stats.changeCount())
                .changeRate(stats.changeRate())
                .activeBlockedDomainCount(activeBlockedDomainCount)
                .activeUserCount(activeUserCount)
                .todayUserSanctionCount(todayUserSanctionCount)
                .serverStatus("NORMAL")           // 나중에 헬스체크 연동 가능
                .lastUpdatedAt(LocalDateTime.now())
                .build();
    }

    // ---------------- 시간대별 탐지 추이 ----------------

    @Transactional(readOnly = true)
    public RiskTrendResponse getRiskTrend(String range) {
        // range는 일단 "24h" 고정으로 사용
        MonitoringResponse monitoring = monitoringService.getMonitoringData();
        List<HourlyDetectResponse> hourlyDetects = monitoring.hourlyDetects();

        List<RiskTrendPoint> points = hourlyDetects.stream()
                .map(h -> new RiskTrendPoint(
                        String.format("%02d", h.hour()), // 0~23 → "00"~"23"
                        h.count()
                ))
                .toList();

        return new RiskTrendResponse("24h", points);
    }

    // ---------------- 유형별 탐지 비율 ----------------

    @Transactional(readOnly = true)
    public List<RiskRatioItem> getRiskRatio() {
        MonitoringResponse monitoring = monitoringService.getMonitoringData();
        List<FraudTypeResponse> fraudTypes = monitoring.fraudTypes();

        return fraudTypes.stream()
                .map(f -> new RiskRatioItem(
                        f.type(),
                        f.count()
                ))
                .toList();
    }

}
