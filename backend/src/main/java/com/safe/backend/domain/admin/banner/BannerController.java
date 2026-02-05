package com.safe.backend.domain.admin.banner;

import com.safe.backend.domain.admin.banner.dto.BannerImageUploadResponse;
import com.safe.backend.domain.admin.banner.dto.BannerRequest;
import com.safe.backend.domain.admin.banner.dto.BannerResponse;
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
@RequestMapping("/api/admin/banners")
public class BannerController {

    private final BannerService bannerService;
    private final BannerImageService bannerImageService;

    @GetMapping
    public ResponseEntity<List<BannerResponse>> list() {
        return ResponseEntity.ok(bannerService.findAll());
    }

    @GetMapping("/active")
    public ResponseEntity<List<BannerResponse>> activeBanners() {
        return ResponseEntity.ok(bannerService.findActiveBanners());
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = bannerImageService.saveImage(file);
            return ResponseEntity.ok(new BannerImageUploadResponse(imageUrl));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(
                    e.getMessage() != null ? e.getMessage() : "이미지 저장 중 오류가 발생했습니다."));
        }
    }

    @PostMapping
    public ResponseEntity<BannerResponse> create(@RequestBody BannerRequest request) {
        return ResponseEntity.ok(bannerService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BannerResponse> update(
            @PathVariable Long id,
            @RequestBody BannerRequest request
    ) {
        return ResponseEntity.ok(bannerService.update(id, request));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<BannerResponse> toggle(@PathVariable Long id) {
        return ResponseEntity.ok(bannerService.toggleActive(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bannerService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/display-order")
    public ResponseEntity<List<BannerResponse>> updateDisplayOrder(@RequestBody List<Long> bannerIds) {
        return ResponseEntity.ok(bannerService.updateDisplayOrder(bannerIds));
    }
}
