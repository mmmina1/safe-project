package com.safe.backend.domain.productReview.controller;

import com.safe.backend.domain.productReview.dto.*;
import com.safe.backend.domain.productReview.service.ProductReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;

import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products/{productId}/reviews")
public class ProductReviewController {

    private final ProductReviewService reviewService;

    @GetMapping
    public Page<ReviewResponse> list(@PathVariable Long productId, @PageableDefault(size = 10,sort = "reviewId", direction = Sort.Direction.DESC) Pageable pageable){
        return reviewService.getReviews(productId, pageable);
    }

    @GetMapping("/summary")
    public ReviewSummaryResponse summary(@PathVariable Long productId){
        return reviewService.getSummary(productId);
    }

    @PostMapping
    public Long create(@PathVariable Long productId, @RequestBody ReviewCreateRequest req){
        Long writerUserId = 1L; 
        return reviewService.create(productId, writerUserId, req);
    }
    
    @PatchMapping("/{reviewId}")
    public void update(
            @PathVariable Long productId,
            @PathVariable Long reviewId,
            @RequestBody ReviewUpdateRequest req
    ) {
        Long writerUserId = 1L; 
        reviewService.update(reviewId, writerUserId, req);
    }

    @DeleteMapping("/{reviewId}")
    public void delete(@PathVariable Long productId, @PathVariable Long reviewId) {
        Long writerUserId = 1L;
        reviewService.delete(reviewId, writerUserId);
    }
}