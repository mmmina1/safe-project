package com.safe.backend.domain.admin.blacklist;

import com.safe.backend.domain.admin.blacklist.dto.BlacklistRequest;
import com.safe.backend.domain.admin.blacklist.dto.BlacklistResponse;
import com.safe.backend.domain.admin.blacklist.dto.BlacklistHistoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin/blacklist")
public class BlacklistController {

    private final BlacklistService blacklistService;

    @GetMapping
    public ResponseEntity<List<BlacklistResponse>> list(
            @RequestParam(required = false) String keyword
    ) {
        if (keyword != null && !keyword.isEmpty()) {
            return ResponseEntity.ok(blacklistService.search(keyword));
        }
        return ResponseEntity.ok(blacklistService.findAll());
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<BlacklistHistoryResponse>> getHistory(@PathVariable Long id) {
        return ResponseEntity.ok(blacklistService.getHistory(id));
    }

    @PostMapping
    public ResponseEntity<BlacklistResponse> create(
            @RequestBody BlacklistRequest request,
            @RequestParam(defaultValue = "1") Long adminId
    ) {
        return ResponseEntity.ok(blacklistService.create(request, adminId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlacklistResponse> update(
            @PathVariable Long id,
            @RequestBody BlacklistRequest request,
            @RequestParam(defaultValue = "1") Long adminId
    ) {
        return ResponseEntity.ok(blacklistService.update(id, request, adminId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long adminId
    ) {
        blacklistService.delete(id, adminId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/bulk-upload")
    public ResponseEntity<List<BlacklistResponse>> bulkUpload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "1") Long adminId
    ) {
        return ResponseEntity.ok(blacklistService.bulkCreateFromCsv(file, adminId));
    }
}
