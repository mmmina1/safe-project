package com.safe.backend.domain.admin.notice;

import com.safe.backend.domain.admin.notice.dto.NoticeResponse;
import com.safe.backend.global.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;

    // ===== 관리자: 전체 조회(기존) =====
    @Transactional(readOnly = true)
    public List<NoticeResponse> findAll() {
        try {
            return noticeRepository.findAllByOrderByNoticeIdDesc()
                    .stream()
                    .map(NoticeResponse::new)
                    .toList();
        } catch (Exception e) {
            log.warn("공지 목록 조회 중 오류(DB 데이터 호환성 등). 빈 목록 반환. cause={}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    // ===== 관리자: 페이징 조회(신규) =====
    @Transactional(readOnly = true)
    public PageResponse<NoticeResponse> findPage(Pageable pageable) {
        Page<NoticeResponse> page = noticeRepository.findAllByOrderByNoticeIdDesc(pageable)
                .map(NoticeResponse::new);
        return new PageResponse<>(page);
    }

    // ===== 사용자: 공개+활성 페이징(신규) =====
    @Transactional(readOnly = true)
    public PageResponse<NoticeResponse> findPublicPage(NoticeType noticeType, Pageable pageable) {
        Page<Notice> page;
        if (noticeType == null) {
            page = noticeRepository.findByPublishedYnAndIsActiveOrderByNoticeIdDesc(1, 1, pageable);
        } else {
            page = noticeRepository.findByPublishedYnAndIsActiveAndNoticeTypeOrderByNoticeIdDesc(1, 1, noticeType, pageable);
        }
        return new PageResponse<>(page.map(NoticeResponse::new));
    }

    // ===== 관리자: 생성(기존) =====
    @Transactional
    public NoticeResponse create(NoticeType type, String title, String content) {
        Notice notice = Notice.of(type, title, content);
        return new NoticeResponse(noticeRepository.save(notice));
    }

    // ===== 관리자: 수정(기존) =====
    @Transactional
    public NoticeResponse update(Long id, NoticeType type, String title, String content) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("공지 없음"));

        notice.update(title, content, type);
        return new NoticeResponse(notice);
    }

    // ===== 관리자: 활성 토글(기존) =====
    @Transactional
    public NoticeResponse toggleActive(Long id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("공지 없음"));

        notice.toggleActive();
        return new NoticeResponse(noticeRepository.save(notice));
    }

    // ===== 관리자: 공개 토글(신규) =====
    @Transactional
    public NoticeResponse togglePublished(Long id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("공지 없음"));

        notice.togglePublished();
        return new NoticeResponse(noticeRepository.save(notice));
    }

    // ===== 삭제(기존) =====
    @Transactional
    public void delete(Long id) {
        noticeRepository.deleteById(id);
    }
}
