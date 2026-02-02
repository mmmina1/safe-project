package com.safe.backend.domain.admin.dashboard;

import com.safe.backend.domain.admin.blindreason.BlindReasonRepository;
import com.safe.backend.domain.admin.banner.BannerRepository;
import com.safe.backend.domain.admin.blacklist.BlacklistRepository;
import com.safe.backend.domain.admin.community.PostReportRepository;
import com.safe.backend.domain.admin.cs.ConsultationStatus;
import com.safe.backend.domain.admin.cs.CsConsultationRepository;
import com.safe.backend.domain.admin.notice.NoticeRepository;
import com.safe.backend.domain.admin.product.ServiceProductRepository;
import com.safe.backend.domain.user.entity.UserStatus;
import com.safe.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final CsConsultationRepository csConsultationRepository;
    private final PostReportRepository postReportRepository;
    private final NoticeRepository noticeRepository;
    private final BannerRepository bannerRepository;
    private final BlacklistRepository blacklistRepository;
    private final ServiceProductRepository productRepository;
    private final BlindReasonRepository blindReasonRepository;

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
}
