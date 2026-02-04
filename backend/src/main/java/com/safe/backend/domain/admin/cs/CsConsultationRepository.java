package com.safe.backend.domain.admin.cs;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CsConsultationRepository extends JpaRepository<CsConsultation, Long> {
    List<CsConsultation> findByUserId(Long userId);
    List<CsConsultation> findByAdminId(Long adminId);
    List<CsConsultation> findByStatus(ConsultationStatus status);
    long countByStatus(ConsultationStatus status);
}
