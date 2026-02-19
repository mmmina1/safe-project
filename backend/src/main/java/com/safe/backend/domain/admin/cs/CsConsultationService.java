package com.safe.backend.domain.admin.cs;

import com.safe.backend.domain.admin.cs.dto.CsConsultationRequest;
import com.safe.backend.domain.admin.cs.dto.CsConsultationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CsConsultationService {

    private final CsConsultationRepository consultationRepository;

    @Transactional(readOnly = true)
    public List<CsConsultationResponse> findAll() {
        return consultationRepository.findAll().stream()
                .map(CsConsultationResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CsConsultationResponse findById(Long id) {
        CsConsultation consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상담입니다."));
        return new CsConsultationResponse(consultation);
    }

    @Transactional
    public CsConsultationResponse create(Long userId) {
        CsConsultation consultation = CsConsultation.of(userId);
        return new CsConsultationResponse(consultationRepository.save(consultation));
    }

    @Transactional
    public CsConsultationResponse assignAdmin(Long id, Long adminId) {
        CsConsultation consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상담입니다."));
        consultation.assignAdmin(adminId);
        return new CsConsultationResponse(consultation);
    }

    @Transactional
    public CsConsultationResponse updateMemo(Long id, String memo) {
        CsConsultation consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상담입니다."));
        consultation.updateMemo(memo);
        return new CsConsultationResponse(consultation);
    }

    @Transactional
    public CsConsultationResponse complete(Long id) {
        CsConsultation consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상담입니다."));
        consultation.complete();
        return new CsConsultationResponse(consultation);
    }

    @Transactional
    public void delete(Long id) {
        if (!consultationRepository.existsById(id)) {
            throw new IllegalArgumentException("존재하지 않는 상담입니다.");
        }
        consultationRepository.deleteById(id);
    }
}
