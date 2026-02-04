package com.safe.backend.domain.admin.community;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostReportRepository extends JpaRepository<PostReport, Long> {
    List<PostReport> findByPostId(Long postId);
    List<PostReport> findByStatus(String status);
    List<PostReport> findByStatusOrderByCreatedAtDesc(String status);
    long countByStatus(String status);
}
