package com.safe.backend.domain.admin.blindreason;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BlindReasonRepository extends JpaRepository<BlindReason, Long> {
    boolean existsByReasonName(String reasonName);
}
