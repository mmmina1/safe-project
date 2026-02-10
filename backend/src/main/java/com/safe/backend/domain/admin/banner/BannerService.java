package com.safe.backend.domain.admin.banner;

import com.safe.backend.domain.admin.banner.dto.BannerRequest;
import com.safe.backend.domain.admin.banner.dto.BannerResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BannerService {

    private final BannerRepository bannerRepository;

    @Transactional(readOnly = true)
    public List<BannerResponse> findAll() {
        try {
            List<Banner> banners = bannerRepository.findAll();
            return banners.stream()
                    .map(banner -> {
                        try {
                            return new BannerResponse(banner);
                        } catch (Exception e) {
                            System.err.println("BannerResponse 생성 실패 - bannerId: " + (banner != null ? banner.getBannerId() : "null"));
                            e.printStackTrace();
                            throw new RuntimeException("배너 응답 생성 중 오류: " + e.getMessage(), e);
                        }
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("배너 목록 조회 실패:");
            e.printStackTrace();
            throw new RuntimeException("배너 목록을 불러오는 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public List<BannerResponse> findActiveBanners() {
        return bannerRepository.findByIsActiveOrderByDisplayOrderAsc(1).stream()
                .map(BannerResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public BannerResponse create(BannerRequest request) {
        Integer displayOrder = request.getDisplayOrder();
        if (displayOrder == null) {
            Integer maxOrder = bannerRepository.findMaxDisplayOrder();
            displayOrder = (maxOrder == null) ? 1 : maxOrder + 1;
        }

        Banner banner = Banner.of(
                request.getTitle(),
                request.getImageUrl(),
                request.getLinkUrl(),
                displayOrder
        );
        return new BannerResponse(bannerRepository.save(banner));
    }

    @Transactional
    public BannerResponse update(Long id, BannerRequest request) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 배너입니다."));
        
        banner.update(
                request.getTitle(), 
                request.getImageUrl(), 
                request.getLinkUrl(),
                request.getStartAt(),
                request.getEndAt()
        );
        
        if (request.getDisplayOrder() != null) {
            banner.setDisplayOrder(request.getDisplayOrder());
        }
        
        return new BannerResponse(banner);
    }

    @Transactional
    public BannerResponse toggleActive(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 배너입니다."));
        banner.toggleActive();
        return new BannerResponse(banner);
    }

    @Transactional
    public void delete(Long id) {
        if (!bannerRepository.existsById(id)) {
            throw new IllegalArgumentException("존재하지 않는 배너입니다.");
        }
        bannerRepository.deleteById(id);
    }

    @Transactional
    public List<BannerResponse> updateDisplayOrder(List<Long> bannerIds) {
        List<Banner> banners = bannerRepository.findAllById(bannerIds);
        
        for (int i = 0; i < bannerIds.size(); i++) {
            Long bannerId = bannerIds.get(i);
            Banner banner = banners.stream()
                    .filter(b -> b.getBannerId().equals(bannerId))
                    .findFirst()
                    .orElse(null);
            if (banner != null) {
                banner.setDisplayOrder(i + 1);
            }
        }
        
        return bannerRepository.findAll().stream()
                .map(BannerResponse::new)
                .collect(Collectors.toList());
    }
}
