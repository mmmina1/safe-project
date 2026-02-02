package com.safe.backend.domain.admin.cs;

import com.safe.backend.domain.admin.cs.dto.CsConsultationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin/cs")
public class CsConsultationController {

    private final CsConsultationService csConsultationService;

    @GetMapping("/consultations")
    public ResponseEntity<List<CsConsultationResponse>> list() {
        return ResponseEntity.ok(csConsultationService.findAll());
    }

    @GetMapping("/consultations/{id}")
    public ResponseEntity<CsConsultationResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(csConsultationService.findById(id));
    }

    @PostMapping("/consultations")
    public ResponseEntity<CsConsultationResponse> create(@RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(csConsultationService.create(userId));
    }

    @PatchMapping("/consultations/{id}/assign")
    public ResponseEntity<CsConsultationResponse> assignAdmin(
            @PathVariable Long id,
            @RequestParam Long adminId
    ) {
        return ResponseEntity.ok(csConsultationService.assignAdmin(id, adminId));
    }

    @PatchMapping("/consultations/{id}/memo")
    public ResponseEntity<CsConsultationResponse> updateMemo(
            @PathVariable Long id,
            @RequestParam String memo
    ) {
        return ResponseEntity.ok(csConsultationService.updateMemo(id, memo));
    }

    @PatchMapping("/consultations/{id}/complete")
    public ResponseEntity<CsConsultationResponse> complete(@PathVariable Long id) {
        return ResponseEntity.ok(csConsultationService.complete(id));
    }
}
