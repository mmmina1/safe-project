package com.safe.backend.domain.serviceProduct.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.safe.backend.domain.serviceProduct.service.ProductImageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductImageController {

    private final ProductImageService productImageService;

    // 대표 이미지 업로드/교체
    @PostMapping("/{productId}/main-image")
    public ResponseEntity<Map<String, String>> uploadMainImage(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile file
    ) throws Exception {

        String url = productImageService.uploadMainImage(productId, file);
        return ResponseEntity.ok(Map.of("url", url));
    }

    // 대표 이미지 조회
    @GetMapping("/{productId}/main-image")
    public ResponseEntity<Map<String, String>> getMainImage(
            @PathVariable Long productId
    ) {
        String url = productImageService.getMainImage(productId);
        return ResponseEntity.ok(Map.of("url", url == null ? "" : url));
    }

    // 대표 이미지 삭제
    @DeleteMapping("/{productId}/main-image")
    public ResponseEntity<Map<String, Object>> deleteMainImage(
            @PathVariable Long productId
    ) {
        productImageService.deleteMainImage(productId);
        return ResponseEntity.ok(Map.of("deleted", true));
    }
}
