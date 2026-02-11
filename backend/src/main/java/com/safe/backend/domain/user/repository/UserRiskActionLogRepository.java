package com.safe.backend.domain.user.repository;

import com.safe.backend.domain.user.entity.UserRiskActionLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRiskActionLogRepository extends JpaRepository<UserRiskActionLog, Long> {
}