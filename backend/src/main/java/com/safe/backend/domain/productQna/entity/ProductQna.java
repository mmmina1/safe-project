package com.safe.backend.domain.productQna.entity;

import java.time.LocalDateTime;

import com.safe.backend.domain.admin.product.ServiceProduct;
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
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product_qna")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductQna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="qna_id")
    private Long qnaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private ServiceProduct product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer_user_id", nullable = false)
    private User writer;

    @Column(length = 200, nullable = false)
    private String title;

    @Lob
    @Column(nullable = false)
    private String content;

    @Column(name = "is_private", nullable = false)
    private Boolean isPrivate;

    @Column(length = 20, nullable = false)
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_user_id")
    private User answerUser;

    @Lob
    @Column(name = "answer_content")
    private String answerContent;

    @Column(name = "answered_at")
    private LocalDateTime answeredAt;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @PrePersist
    void onCreate() {
        this.createdDate = LocalDateTime.now();
        this.updatedDate = this.createdDate;
        if (this.status == null) this.status = "WAITING";
        if (this.isPrivate == null) this.isPrivate = false;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }

}
