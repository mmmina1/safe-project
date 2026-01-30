package com.safe.backend.domain.monitoring.repository;

import com.safe.backend.domain.monitoring.entity.RiskNumber;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RiskNumberRepository extends JpaRepository<RiskNumber, Long> {
    long countByActiveTrue();
}
