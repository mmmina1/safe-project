package com.safe.backend.domain.admin.product;

import com.safe.backend.domain.admin.product.ProductImageService;
import com.safe.backend.domain.admin.banner.dto.BannerImageUploadResponse;
import com.safe.backend.domain.admin.product.dto.ServiceProductRequest;
import com.safe.backend.domain.admin.product.dto.ServiceProductResponse;
import com.safe.backend.global.error.ErrorResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin/products")
public class ServiceProductController {

    private final ServiceProductService productService;
    private final ProductImageService productImageService;

    @GetMapping
    public ResponseEntity<List<ServiceProductResponse>> list() {
        return ResponseEntity.ok(productService.findAll());
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = productImageService.saveImage(file);
            return ResponseEntity.ok(new BannerImageUploadResponse(imageUrl));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(
                    e.getMessage() != null ? e.getMessage() : "이미지 저장 중 오류가 발생했습니다."));
        }
    }

    @PostMapping
    public ResponseEntity<ServiceProductResponse> create(@RequestBody ServiceProductRequest request) {
        return ResponseEntity.ok(productService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceProductResponse> update(
            @PathVariable Long id,
            @RequestBody ServiceProductRequest request
    ) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ServiceProductResponse> toggle(@PathVariable Long id) {
        return ResponseEntity.ok(productService.toggleActive(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok().build();
    }
}
