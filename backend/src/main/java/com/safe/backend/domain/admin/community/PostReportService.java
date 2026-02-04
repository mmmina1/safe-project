package com.safe.backend.domain.admin.community;

import com.safe.backend.domain.admin.community.dto.PostBlindRequest;
import com.safe.backend.domain.admin.community.dto.PostReportResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class PostReportService {

    private final PostReportRepository reportRepository;

    @Transactional(readOnly = true)
    public List<PostReportResponse> findAll() {
        return reportRepository.findAll().stream()
                .map(PostReportResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostReportResponse> findByStatus(String status) {
        if (status != null && !status.isEmpty()) {
            // 접수, 반려, 처리완료 중 하나인지 확인
            if (status.equals("접수") || status.equals("반려") || status.equals("처리완료")) {
                return reportRepository.findByStatusOrderByCreatedAtDesc(status).stream()
                        .map(PostReportResponse::new)
                        .collect(Collectors.toList());
            }
        }
        return findAll();
    }

    @Transactional(readOnly = true)
    public PostReportResponse findById(Long id) {
        PostReport report = reportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 신고입니다."));
        return new PostReportResponse(report);
    }

    @Transactional
    public PostReportResponse approve(Long reportId, Long adminId) {
        PostReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 신고입니다."));
        report.approve(adminId);
        return new PostReportResponse(report);
    }

    @Transactional
    public PostReportResponse reject(Long reportId, Long adminId) {
        PostReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 신고입니다."));
        report.reject(adminId);
        return new PostReportResponse(report);
    }

    @Transactional
    public void blindPost(PostBlindRequest request) {
        // 게시글 블라인드 처리 로직
        // 실제 게시글 엔티티가 있다면 여기서 블라인드 처리
        // 예: postService.blindPost(request.getPostId(), request.getBlindReasonId());
        
        // 신고 승인 처리
        List<PostReport> reports = reportRepository.findByPostId(request.getPostId());
        for (PostReport report : reports) {
            if ("접수".equals(report.getStatus())) {
                report.approve(request.getAdminId());
            }
        }
    }
}
