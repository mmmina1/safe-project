package com.safe.backend.domain.productReview.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.safe.backend.domain.productReview.entity.ProductReviewLike;
import com.safe.backend.domain.productReview.entity.ProductReviewLikeId;

public interface ProductReviewLikeRepository extends JpaRepository<ProductReviewLike, ProductReviewLikeId> {

    long countById_ReviewId(Long reviewId);

    void deleteById_ReviewId(Long reviewId);


    @Query("""
    select l.id.reviewId
    from ProductReviewLike l
    where l.id.userId = :userId
    and l.id.reviewId in :reviewIds
    """)
    List<Long> findLikedReviewIds(@Param("userId") Long userId, @Param("reviewIds") List<Long> reviewIds);

}

