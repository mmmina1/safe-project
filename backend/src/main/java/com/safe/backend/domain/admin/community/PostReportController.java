package com.safe.backend.domain.admin.community;

import com.safe.backend.domain.admin.community.dto.PostBlindRequest;
import com.safe.backend.domain.admin.community.dto.PostReportResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin/community/reports")
public class PostReportController {

    private final PostReportService reportService;

    @GetMapping
    public ResponseEntity<List<PostReportResponse>> list(
            @RequestParam(required = false) String status
    ) {
        if (status != null && !status.isEmpty()) {
            return ResponseEntity.ok(reportService.findByStatus(status));
        }
        return ResponseEntity.ok(reportService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostReportResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.findById(id));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<PostReportResponse> approve(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long adminId
    ) {
        return ResponseEntity.ok(reportService.approve(id, adminId));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<PostReportResponse> reject(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long adminId
    ) {
        return ResponseEntity.ok(reportService.reject(id, adminId));
    }

    @PostMapping("/blind")
    public ResponseEntity<Void> blindPost(@RequestBody PostBlindRequest request) {
        reportService.blindPost(request);
        return ResponseEntity.ok().build();
    }
}
