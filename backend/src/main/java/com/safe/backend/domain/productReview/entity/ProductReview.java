package com.safe.backend.domain.productReview.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.safe.backend.domain.serviceProduct.entity.Product;
import com.safe.backend.domain.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name="product_review")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer_user_id", nullable = false)
    private User writer;

    @Column(nullable = false, precision = 2, scale = 1)
    private BigDecimal rating;

    @Column(length = 200)
    private String title;

    @Lob
    @Column(nullable = false)
    private String content;

    @Column(name = "like_count", nullable = false)
    private Long likeCount = 0L;

    @Column(name = "is_visible", nullable = false)
    private Boolean isVisible = true;

    @Column(name = "created_date", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date", nullable = false)
    private LocalDateTime updatedDate;

    public static ProductReview create(Product product, User writer, BigDecimal rating, String title, String content) {
        ProductReview r = new ProductReview();
        r.product = product;
        r.writer = writer;
        r.rating = rating;
        r.title = (title == null ? null : title.trim());
        r.content = content;
        r.likeCount = 0L;
        r.isVisible = true;
        r.createdDate = LocalDateTime.now();
        r.updatedDate = LocalDateTime.now();
        return r;
    }

    public void update(BigDecimal rating, String title, String content) {
        if (rating != null) this.rating = rating;
        if (title != null) this.title = title.trim();
        if (content != null) this.content = content;
        this.updatedDate = LocalDateTime.now();
    }

    /** “삭제”는 물리삭제 대신 노출 OFF 처리 추천 */
    public void hide() {
        this.isVisible = false;
        this.updatedDate = LocalDateTime.now();
    }

    public void addLike() {
        this.likeCount = (this.likeCount == null ? 1L : this.likeCount + 1);
    }


    
    
}
