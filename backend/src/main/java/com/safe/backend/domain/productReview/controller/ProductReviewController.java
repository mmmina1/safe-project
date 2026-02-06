package com.safe.backend.domain.productReview.controller;

import com.safe.backend.domain.productReview.dto.*;
import com.safe.backend.domain.productReview.service.ProductReviewService;
import com.safe.backend.global.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products/{productId}/reviews")
public class ProductReviewController {

    private final ProductReviewService reviewService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping
    public Page<ReviewResponse> list(
            @PathVariable Long productId,
            @PageableDefault(size = 10, sort = "reviewId", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return reviewService.getReviews(productId, pageable);
    }

    @GetMapping("/summary")
    public ReviewSummaryResponse summary(@PathVariable Long productId) {
        return reviewService.getSummary(productId);
    }

    @PostMapping
    public Long create(
            @PathVariable Long productId,
            @RequestBody ReviewCreateRequest req,
            HttpServletRequest request
    ) {
        Long writerUserId = extractUserId(request);
        return reviewService.create(productId, writerUserId, req);
    }

    @PatchMapping("/{reviewId}")
    public void update(
            @PathVariable Long productId,
            @PathVariable Long reviewId,
            @RequestBody ReviewUpdateRequest req,
            HttpServletRequest request
    ) {
        Long writerUserId = extractUserId(request);
        reviewService.update(reviewId, writerUserId, req);
    }

    @DeleteMapping("/{reviewId}")
    public void delete(
            @PathVariable Long productId,
            @PathVariable Long reviewId,
            HttpServletRequest request
    ) {
        Long writerUserId = extractUserId(request);
        reviewService.delete(reviewId, writerUserId);
    }

    private Long extractUserId(HttpServletRequest request) {
        String auth = request.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            throw new IllegalStateException("Authorization 헤더가 없습니다.");
        }
        String token = auth.substring(7);
        return jwtTokenProvider.getUserId(token); // ✅ sub에서 userId 추출
    }
}
