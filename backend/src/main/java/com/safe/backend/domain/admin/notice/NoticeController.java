package com.safe.backend.domain.admin.notice;

import com.safe.backend.domain.admin.notice.dto.NoticeRequest;
import com.safe.backend.domain.admin.notice.dto.NoticeResponse;
import com.safe.backend.global.dto.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin/notices")
public class NoticeController {

    private final NoticeService noticeService;

    // 목록(기존)
    @GetMapping
    public List<NoticeResponse> list() {
        return noticeService.findAll();
    }

    // 관리자 페이징(신규)
    @GetMapping("/page")
    public PageResponse<NoticeResponse> page(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return noticeService.findPage(pageable);
    }

    // 생성 (JSON body)
    @PostMapping
    public ResponseEntity<NoticeResponse> create(@RequestBody @Valid NoticeRequest request) {
        return ResponseEntity.ok(noticeService.create(request.type(), request.title(), request.content()));
    }

    // 수정 (JSON body)
    @PutMapping("/{id}")
    public ResponseEntity<NoticeResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid NoticeRequest request
    ) {
        return ResponseEntity.ok(noticeService.update(id, request.type(), request.title(), request.content()));
    }

    // 활성 토글(기존 경로 유지)
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<NoticeResponse> toggle(@PathVariable Long id) {
        return ResponseEntity.ok(noticeService.toggleActive(id));
    }

    // 공개 토글(신규)
    @PatchMapping("/{id}/publish-toggle")
    public ResponseEntity<NoticeResponse> publishToggle(@PathVariable Long id) {
        return ResponseEntity.ok(noticeService.togglePublished(id));
    }

    // 삭제(기존)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        noticeService.delete(id);
        return ResponseEntity.ok().build();
    }
}
