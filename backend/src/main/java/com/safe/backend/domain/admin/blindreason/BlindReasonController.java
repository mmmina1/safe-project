package com.safe.backend.domain.admin.blindreason;

import com.safe.backend.domain.admin.blindreason.dto.BlindReasonCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin/blind-reasons")
public class BlindReasonController {

    private final BlindReasonService blindReasonService;

    @GetMapping
    public List<BlindReason> list() {
        return blindReasonService.findAll();
    }

    @PostMapping
    public ResponseEntity<BlindReason> create(
            @RequestBody BlindReasonCreateRequest req
    ) {
        return ResponseEntity.ok(
                blindReasonService.create(req.getReasonName())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlindReason> update(
            @PathVariable Long id,
            @RequestBody BlindReasonCreateRequest req
    ) {
        return ResponseEntity.ok(
                blindReasonService.update(id, req.getReasonName())
        );
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<BlindReason> toggle(@PathVariable Long id) {
        return ResponseEntity.ok(blindReasonService.toggle(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        blindReasonService.delete(id);
        return ResponseEntity.ok().build();
    }
}
