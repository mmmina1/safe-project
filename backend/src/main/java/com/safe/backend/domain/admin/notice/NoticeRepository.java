package com.safe.backend.domain.admin.notice;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    List<Notice> findAllByOrderByNoticeIdDesc();

    Page<Notice> findAllByOrderByNoticeIdDesc(Pageable pageable);

    Page<Notice> findByPublishedYnAndIsActiveOrderByNoticeIdDesc(Integer publishedYn, Integer isActive, Pageable pageable);

    Page<Notice> findByPublishedYnAndIsActiveAndNoticeTypeOrderByNoticeIdDesc(Integer publishedYn, Integer isActive, NoticeType noticeType, Pageable pageable);
}
