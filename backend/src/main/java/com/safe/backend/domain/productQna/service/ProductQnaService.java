package com.safe.backend.domain.productQna.service;

import com.safe.backend.domain.admin.product.ServiceProduct;
import com.safe.backend.domain.admin.product.ServiceProductRepository;
import com.safe.backend.domain.productQna.dto.ProductQnaAnswerRequest;
import com.safe.backend.domain.productQna.dto.ProductQnaCreateRequest;
import com.safe.backend.domain.productQna.dto.ProductQnaResponse;
import com.safe.backend.domain.productQna.dto.ProductQnaUpdateRequest;
import com.safe.backend.domain.productQna.entity.ProductQna;
import com.safe.backend.domain.productQna.repository.ProductQnaRepository;
import com.safe.backend.domain.user.entity.User;
import com.safe.backend.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductQnaService {

    private final ProductQnaRepository productQnaRepository;
    private final ServiceProductRepository productRepository;
    private final UserRepository userRepository;

    public Page<ProductQnaResponse> getProductQna(Long productId, Pageable pageable, Long viewerUserId, boolean isAdmin) {
    Page<ProductQna> page =
        productQnaRepository.findByProduct_ProductId(productId, pageable);
    return page.map(qna -> toResponseWithMask(qna, viewerUserId, isAdmin));
}
    public ProductQnaResponse create(Long productId, Long userId, ProductQnaCreateRequest req) {
        ServiceProduct product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품 없음"));
        User writer = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));

        ProductQna qna = ProductQna.builder()
                .product(product)
                .writer(writer)
                .title(req.getTitle())
                .content(req.getContent())
                .isPrivate(req.getIsPrivate() != null && req.getIsPrivate())
                .status("WAITING")
                .build();

        ProductQna saved = productQnaRepository.save(qna);
        return ProductQnaResponse.builder()
                .qnaId(saved.getQnaId())
                .productId(productId)
                .writerUserId(writer.getUserId())
                .writerName(writer.getName())
                .title(saved.getTitle())
                .content(saved.getContent())
                .isPrivate(saved.getIsPrivate())
                .status(saved.getStatus())
                .answerContent(saved.getAnswerContent())
                .answeredAt(saved.getAnsweredAt())
                .createdDate(saved.getCreatedDate())
                .updatedDate(saved.getUpdatedDate())
                .build();
    }

    // 비밀글 마스킹: 작성자/관리자 아니면 내용/답변 내용 숨김
    private ProductQnaResponse toResponseWithMask(ProductQna qna, Long viewerUserId, boolean isAdmin) {
        boolean canView = isAdmin || (viewerUserId != null && qna.getWriter().getUserId().equals(viewerUserId));

        String content = qna.getIsPrivate() && !canView ? "비밀글입니다." : qna.getContent();
        String answer = qna.getIsPrivate() && !canView ? null : qna.getAnswerContent();

        return ProductQnaResponse.builder()
                .qnaId(qna.getQnaId())
                .productId(qna.getProduct().getProductId())
                .writerUserId(qna.getWriter().getUserId())
                .writerName(qna.getWriter().getName())
                .title(qna.getTitle())
                .content(content)
                .isPrivate(qna.getIsPrivate())
                .status(qna.getStatus())
                .answerContent(answer)
                .answeredAt(qna.getAnsweredAt())
                .createdDate(qna.getCreatedDate())
                .updatedDate(qna.getUpdatedDate())
                .build();
    }

    //update는 작성자만 가능
    public ProductQnaResponse update(Long productId, Long qnaId, Long userId, ProductQnaUpdateRequest req) {
    ProductQna qna = productQnaRepository.findById(qnaId)
            .orElseThrow(() -> new IllegalArgumentException("문의 없음"));

    if (!qna.getProduct().getProductId().equals(productId)) {
        throw new IllegalArgumentException("상품 불일치");
    }
    if (!qna.getWriter().getUserId().equals(userId)) {
        throw new IllegalStateException("수정 권한 없음");
    }

    if (req.getTitle() != null) qna.setTitle(req.getTitle());
    if (req.getContent() != null) qna.setContent(req.getContent());
    if (req.getIsPrivate() != null) qna.setIsPrivate(req.getIsPrivate());

    // JPA dirty checking
    return toResponseWithMask(qna, userId, false);
}

    //답변은 관리자만 가능
    public ProductQnaResponse answer(Long productId, Long qnaId, Long adminUserId, ProductQnaAnswerRequest req) {
    ProductQna qna = productQnaRepository.findById(qnaId)
            .orElseThrow(() -> new IllegalArgumentException("문의 없음"));

    if (!qna.getProduct().getProductId().equals(productId)) {
        throw new IllegalArgumentException("상품 불일치");
    }

    User admin = userRepository.findById(adminUserId)
            .orElseThrow(() -> new IllegalArgumentException("유저 없음"));

    qna.setAnswerUser(admin);
    qna.setAnswerContent(req.getAnswerContent());
    qna.setAnsweredAt(LocalDateTime.now());
    qna.setStatus("ANSWERED");

    return toResponseWithMask(qna, adminUserId, true);
}


}
