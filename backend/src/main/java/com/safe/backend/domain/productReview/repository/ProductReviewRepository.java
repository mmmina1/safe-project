package com.safe.backend.domain.productReview.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;

import com.safe.backend.domain.productReview.entity.ProductReview;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long>{

    Page<ProductReview> findByProduct_ProductIdAndIsVisibleTrue(Long productId, Pageable pageable);

    long countByProduct_ProductIdAndIsVisibleTrue(Long productId);

    @Query("select coalesce(avg(r.rating), 0) from ProductReview r where r.product.productId = :productId and r.isVisible = true")
    BigDecimal avgRating(@Param("productId") Long productId);

    Optional<ProductReview> findByReviewIdAndProduct_ProductId(Long reviewId, Long productId);
    
        //좋아요 +1
        @Modifying
        @Query("update ProductReview r set r.likeCount = r.likeCount + 1 where r.reviewId = :reviewId")
        int increaseLikeCount(@Param("reviewId") Long reviewId);

        //좋아요 -1
        @Modifying
        @Query("""
            update ProductReview r
            set r.likeCount = case when r.likeCount > 0 then r.likeCount - 1 else 0 end
            where r.reviewId = :reviewId
            """)
        int decreaseLikeCount(@Param("reviewId") Long reviewId);
    }
