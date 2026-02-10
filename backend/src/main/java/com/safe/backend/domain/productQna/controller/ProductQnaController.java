package com.safe.backend.domain.productQna.controller;

import com.safe.backend.domain.productQna.dto.ProductQnaCreateRequest;
import com.safe.backend.domain.productQna.dto.ProductQnaResponse;
import com.safe.backend.domain.productQna.service.ProductQnaService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products/{productId}/qna")
public class ProductQnaController {

    private final ProductQnaService productQnaService;

    @GetMapping
    public ResponseEntity<Page<ProductQnaResponse>> list(
            @PathVariable Long productId,
            @PageableDefault(size = 10, sort = "qnaId", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Long viewerUserId = null;
        boolean isAdmin = false;  

        return ResponseEntity.ok(
                productQnaService.getProductQna(productId, pageable, viewerUserId, isAdmin)
        );
    }

    @PostMapping
    public ResponseEntity<ProductQnaResponse> create(
            @PathVariable Long productId,
            @RequestBody ProductQnaCreateRequest req
    ) {
        Long userId = 1L;
        return ResponseEntity.ok(productQnaService.create(productId, userId, req));
    }
}
