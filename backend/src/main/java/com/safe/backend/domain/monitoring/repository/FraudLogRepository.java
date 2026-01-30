package com.safe.backend.domain.monitoring.repository;

import com.safe.backend.domain.monitoring.entity.FraudLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface FraudLogRepository extends JpaRepository<FraudLog, Long> {

    // 사기 유형별 집계
    @Query("SELECT f.fraudType, COUNT(f) FROM FraudLog f GROUP BY f.fraudType")
    List<Object[]> countByFraudType();

    // 지역별 집계
    @Query("SELECT f.region, COUNT(f) FROM FraudLog f GROUP BY f.region")
    List<Object[]> countByRegion();

    // 기간별 건수 (이것만 쓴다)
    @Query("""
        SELECT COUNT(f)
        FROM FraudLog f
        WHERE f.createdAt >= :start
          AND f.createdAt < :end
    """)
    long countByDateRange(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}