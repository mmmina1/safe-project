package com.safe.backend.domain.productReview.service;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;  
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.safe.backend.domain.productReview.dto.*;
import com.safe.backend.domain.productReview.entity.ProductReview;
import com.safe.backend.domain.productReview.repository.ProductReviewLikeRepository;
import com.safe.backend.domain.productReview.repository.ProductReviewRepository;
import com.safe.backend.domain.serviceProduct.entity.Product;
import com.safe.backend.domain.serviceProduct.repository.ProductRepository;
import com.safe.backend.domain.user.entity.User;
import com.safe.backend.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductReviewService {

    private final ProductReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductReviewLikeRepository reviewLikeRepository;


    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviews(Long productId, Pageable pageable, Long me) {

        Page<ProductReview> page =
                reviewRepository.findByProduct_ProductIdAndIsVisibleTrue(productId, pageable);

        List<Long> ids = page.getContent().stream()
                .map(ProductReview::getReviewId)
                .collect(Collectors.toList());

        Set<Long> likedSet = Collections.emptySet();
        if (me != null && !ids.isEmpty()) {
            likedSet = new HashSet<Long>(reviewLikeRepository.findLikedReviewIds(me, ids));
        }

        final Set<Long> finalLikedSet = likedSet; // 람다에서 쓰려고 final로

        return page.map(r -> ReviewResponse.from(
                r,
                me != null && finalLikedSet.contains(r.getReviewId())
        ));
    }

    @Transactional(readOnly = true)
    public ReviewSummaryResponse getSummary(Long productId){
        BigDecimal avg = reviewRepository.avgRating(productId);
        long count = reviewRepository.countByProduct_ProductIdAndIsVisibleTrue(productId);
        return new ReviewSummaryResponse(productId, avg, count);
    }

    @Transactional
    public Long create(Long productId, Long writerUserId, ReviewCreateRequest req){
        validateRating(req.rating());

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품이 없습니다. productId=" + productId));

        User writer = userRepository.findById(writerUserId)
                .orElseThrow(() -> new IllegalArgumentException("유저가 없습니다. userId=" + writerUserId));

        ProductReview saved = reviewRepository.save(
                ProductReview.create(product, writer, req.rating(), req.title(), req.content())
        );
        return saved.getReviewId();
    }

    @Transactional
    public void update(Long reviewId, Long writerUserId, ReviewUpdateRequest req){
        if(req.rating() != null) validateRating(req.rating());

        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰가 없습니다. reviewId=" + reviewId));

        if(!review.getWriter().getUserId().equals(writerUserId)){
            throw new IllegalStateException("수정 권한이 없습니다.");
        }
        review.update(req.rating(), req.title(), req.content());
    }

    @Transactional
    public void delete(Long reviewId, Long writerUserId) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰가 없습니다. reviewId=" + reviewId));

        if (!review.getWriter().getUserId().equals(writerUserId)) {
            throw new IllegalStateException("삭제 권한이 없습니다.");
        }

        reviewLikeRepository.deleteById_ReviewId(reviewId);
        reviewRepository.delete(review);
    }

    private void validateRating(BigDecimal rating) {
        if (rating == null) throw new IllegalArgumentException("rating은 필수입니다.");
        if (rating.compareTo(new BigDecimal("1.0")) < 0 || rating.compareTo(new BigDecimal("5.0")) > 0) {
            throw new IllegalArgumentException("rating은 1.0~5.0 범위여야 합니다.");
        }
    }

    @Transactional
    public ReviewLikeResponse toggleLike(Long productId, Long reviewId, Long userId) {

        // 1) (중요) 리뷰가 해당 상품에 속하는지 검증
        ProductReview review = reviewRepository
                .findByReviewIdAndProduct_ProductId(reviewId, productId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰가 없습니다. reviewId=" + reviewId));

        var id = new com.safe.backend.domain.productReview.entity.ProductReviewLikeId(reviewId, userId);

        boolean exists = reviewLikeRepository.existsById(id);

        boolean likeByMe;
        if (exists) {
            reviewLikeRepository.deleteById(id);
            reviewRepository.decreaseLikeCount(reviewId);
            likeByMe = false;
        } else {
            reviewLikeRepository.save(com.safe.backend.domain.productReview.entity.ProductReviewLike.of(reviewId, userId));
            reviewRepository.increaseLikeCount(reviewId);
            likeByMe = true;
        }

        // 2) 최신 likeCount 구하기 (DB count를 써도 되고, like_count 컬럼을 다시 읽어도 됨)
        // 여기서는 count로 정확히 가져가자
        long likeCount = reviewLikeRepository.countById_ReviewId(reviewId);

        return new ReviewLikeResponse(reviewId, likeCount, likeByMe);
    }



}
