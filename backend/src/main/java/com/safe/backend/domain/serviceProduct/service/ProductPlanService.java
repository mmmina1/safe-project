package com.safe.backend.domain.serviceProduct.service;

import com.safe.backend.domain.serviceProduct.dto.ProductPlanDto;
import com.safe.backend.domain.serviceProduct.entity.ProductPlan;
import com.safe.backend.domain.serviceProduct.repository.ProductPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductPlanService {

    private final ProductPlanRepository productPlanRepository;

    public ProductPlanDto getPlanDto(Long productId, Integer detailPrice, String priceType) {
        // FREE면 가격 0으로 고정
        if ("FREE".equals(priceType)) {
            var opt = productPlanRepository.findByProduct_ProductId(productId);
            String periodText = opt
                    .map(p -> formatPeriod(p.getDurationValue(), p.getDurationUnit().name()))
                    .orElse("무료(즉시 적용)");
            return ProductPlanDto.builder()
                    .durationValue(opt.map(ProductPlan::getDurationValue).orElse(null))
                    .durationUnit(opt.map(p -> p.getDurationUnit().name()).orElse(null))
                    .periodText(periodText)
                    .finalPrice(0)
                    .build();
        }

        ProductPlan plan = productPlanRepository.findByProduct_ProductId(productId)
                .orElse(null);

        Integer planPrice = (plan != null ? plan.getPriceOverride() : null);
        Integer finalPrice = (planPrice != null) ? planPrice : detailPrice; // 디테일 가격 fallback

        String periodText = (plan == null)
                ? "기간 정보 없음"
                : formatPeriod(plan.getDurationValue(), plan.getDurationUnit().name());

        return ProductPlanDto.builder()
                .durationValue(plan == null ? null : plan.getDurationValue())
                .durationUnit(plan == null ? null : plan.getDurationUnit().name())
                .periodText(periodText)
                .finalPrice(finalPrice)   // null이면 프론트에서 “가격 미정”
                .build();
    }

    private String formatPeriod(Integer v, String unit) {
        if (v == null || unit == null) return "기간 정보 없음";
        if ("DAY".equals(unit)) return v + "일";
        if ("MONTH".equals(unit)) return v + "개월";
        return "기간 정보 없음";
    }
}
