package com.safe.backend.domain.admin.notice;

import com.safe.backend.domain.admin.notice.NoticeService;
import com.safe.backend.domain.admin.notice.NoticeType;
import com.safe.backend.domain.admin.notice.dto.NoticeResponse;
import com.safe.backend.global.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/notices")
public class PublicNoticeController {

    private final NoticeService noticeService;

    // 사용자용: 공개(published_yn=1) + 활성(is_active=1)만
    @GetMapping
    public PageResponse<NoticeResponse> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) NoticeType noticeType
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return noticeService.findPublicPage(noticeType, pageable);
    }
}
