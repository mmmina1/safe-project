package com.safe.backend.domain.admin.blacklist;

import com.safe.backend.domain.admin.blacklist.dto.*;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BlacklistService {

    private final BlacklistRepository blacklistRepository;
    private final BlacklistHistoryRepository historyRepository;
    private final EntityManager entityManager;

    @Transactional(readOnly = true)
    public List<BlacklistResponse> findAll() {
        return blacklistRepository.findAll().stream()
                .map(BlacklistResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BlacklistResponse> search(String keyword) {
        String searchKeyword = (keyword != null && !keyword.trim().isEmpty()) 
                ? keyword.trim() : null;
        List<Blacklist> results = blacklistRepository.search(searchKeyword);
        return results.stream()
                .map(BlacklistResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BlacklistHistoryResponse> getHistory(Long blacklistId) {
        Blacklist blacklist = blacklistRepository.findById(blacklistId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 블랙리스트입니다."));
        
        List<BlacklistHistory> histories = historyRepository.findByBlacklistOrderByCreatedAtDesc(blacklist);
        return histories.stream()
                .map(BlacklistHistoryResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public BlacklistResponse create(BlacklistRequest request, Long adminId) {
        try {
            if (request.getTargetValue() == null || request.getTargetValue().trim().isEmpty()) {
                throw new IllegalArgumentException("대상 값(전화번호 또는 URL)을 입력하세요.");
            }
            
            String type = request.getType();
            System.out.println("DEBUG - Request type: '" + type + "'");
            
            if (type == null || type.isEmpty() || "자동 판단".equals(type)) {
                // 자동 판단
                String value = request.getTargetValue().trim();
                if (value.startsWith("http://") || value.startsWith("https://") || value.contains(".")) {
                    type = "URL";
                } else {
                    type = "PHONE";
                }
                System.out.println("DEBUG - Auto-detected type: " + type);
            } else {
                System.out.println("DEBUG - Using provided type: " + type);
            }
            
            // 중복 체크
            if (blacklistRepository.findByTargetValueAndType(request.getTargetValue().trim(), type).isPresent()) {
                throw new IllegalArgumentException("이미 등록된 항목입니다.");
            }
            
            Blacklist blacklist;
            if ("PHONE".equals(type)) {
                System.out.println("DEBUG - Creating PHONE blacklist");
                blacklist = Blacklist.ofPhoneNumber(request.getTargetValue().trim());
            } else if ("URL".equals(type)) {
                System.out.println("DEBUG - Creating URL blacklist");
                blacklist = Blacklist.ofUrl(request.getTargetValue().trim());
            } else {
                throw new IllegalArgumentException("유효하지 않은 유형입니다: " + type);
            }
            
            if (request.getReason() != null && !request.getReason().trim().isEmpty()) {
                blacklist.setReason(request.getReason().trim());
            }
            
            // 필수 필드 검증 및 디버깅
            if (blacklist.getTargetValue() == null || blacklist.getTargetValue().trim().isEmpty()) {
                throw new IllegalArgumentException("대상 값(전화번호 또는 URL)은 필수입니다.");
            }
            if (blacklist.getType() == null || blacklist.getType().trim().isEmpty()) {
                throw new IllegalArgumentException("유형은 필수입니다.");
            }
            
            // 디버깅: 저장 전 필드 값 확인
            System.out.println("DEBUG - Before save:");
            System.out.println("  targetValue: " + blacklist.getTargetValue());
            System.out.println("  type: " + blacklist.getType());
            System.out.println("  reportCount: " + blacklist.getReportCount());
            System.out.println("  voiceReportCnt: " + blacklist.getVoiceReportCnt());
            System.out.println("  smsReportCnt: " + blacklist.getSmsReportCnt());
            System.out.println("  isActive: " + blacklist.getIsActive());
            System.out.println("  reason: " + blacklist.getReason());
            
            Blacklist saved = blacklistRepository.save(blacklist);
            historyRepository.save(BlacklistHistory.of(saved, "CREATE", adminId));
            return new BlacklistResponse(saved);
        } catch (IllegalArgumentException e) {
            throw e; // 이미 적절한 메시지가 있으므로 그대로 전달
        } catch (Exception e) {
            throw new IllegalArgumentException("블랙리스트 생성 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @Transactional
    public BlacklistResponse update(Long id, BlacklistRequest request, Long adminId) {
        Blacklist blacklist = blacklistRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 블랙리스트입니다."));
        
        if (request.getTargetValue() != null && !request.getTargetValue().trim().isEmpty()) {
            blacklist.setTargetValue(request.getTargetValue().trim());
        }
        if (request.getReason() != null) {
            blacklist.setReason(request.getReason());
        }
        
        historyRepository.save(BlacklistHistory.of(blacklist, "UPDATE", adminId));
        return new BlacklistResponse(blacklistRepository.save(blacklist));
    }

    @Transactional
    public void delete(Long id, Long adminId) {
        if (!blacklistRepository.existsById(id)) {
            throw new IllegalArgumentException("존재하지 않는 블랙리스트입니다.");
        }
        // FK 제약: 네이티브 DELETE로 히스토리 먼저 삭제 후 블랙리스트 삭제 (엔티티 로딩 없음)
        historyRepository.deleteAllByBlacklistId(id);
        entityManager.flush();
        int deleted = blacklistRepository.deleteByBlacklistIdNative(id);
        if (deleted == 0) {
            throw new IllegalArgumentException("존재하지 않는 블랙리스트입니다.");
        }
    }

    @Transactional
    public List<BlacklistResponse> bulkCreateFromCsv(MultipartFile file, Long adminId) {
        List<BlacklistResponse> created = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            
            String line;
            int lineNumber = 0;
            
            while ((line = reader.readLine()) != null) {
                lineNumber++;
                line = line.trim();
                if (line.isEmpty() || line.startsWith("#")) continue; // 빈 줄이나 주석 건너뛰기
                
                String[] parts = line.split(",");
                if (parts.length < 1) continue;
                
                    String value = parts[0].trim();
                    if (value.isEmpty()) continue;
                    
                    try {
                        BlacklistRequest request = new BlacklistRequest();
                        request.setTargetValue(value);
                        // 전화번호 형식인지 URL 형식인지 판단
                        if (value.startsWith("http://") || value.startsWith("https://") || value.contains(".")) {
                            request.setType("URL");
                            if (blacklistRepository.findByTargetValueAndType(value, "URL").isEmpty()) {
                                created.add(create(request, adminId));
                            }
                        } else {
                            request.setType("PHONE");
                            if (blacklistRepository.findByTargetValueAndType(value, "PHONE").isEmpty()) {
                                created.add(create(request, adminId));
                            }
                        }
                } catch (Exception e) {
                    // 개별 항목 실패는 로그만 남기고 계속 진행
                    System.err.println("Line " + lineNumber + " failed: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("CSV 파일 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
        
        return created;
    }
}
