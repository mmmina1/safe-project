package com.safe.backend.domain.monitoring.repository;

import com.safe.backend.domain.monitoring.entity.RiskDetectionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface RiskDetectionLogRepository extends JpaRepository<RiskDetectionLog, Long> {

    @Query(value = """
        SELECT COUNT(*)
        FROM risk_detection_log
        WHERE created_date = :date
    """, nativeQuery = true)
    long countByCreatedDate(@Param("date") LocalDate date);

    @Query(value = """
    SELECT HOUR(created_at) AS h, COUNT(*) AS cnt
    FROM risk_detection_log
    WHERE created_at >= :start AND created_at < :end
    GROUP BY HOUR(created_at)
    ORDER BY h
""", nativeQuery = true)
    List<Object[]> countByHour(@Param("start") LocalDateTime start,
                               @Param("end") LocalDateTime end);

    @Query(value = """
        SELECT dft.fraud_type_code, COUNT(*)
        FROM risk_detection_log rdl
        JOIN dim_fraud_type dft ON rdl.fraud_type_id = dft.fraud_type_id
        WHERE rdl.created_date = :date
        GROUP BY dft.fraud_type_code
    """, nativeQuery = true)
    List<Object[]> countByFraudType(@Param("date") LocalDate date);

    @Query(value = """
    SELECT COALESCE(region, 'UNKNOWN') AS region, COUNT(*) AS cnt
    FROM risk_detection_log
    WHERE created_date = :date
    GROUP BY COALESCE(region, 'UNKNOWN')
    ORDER BY cnt DESC
""", nativeQuery = true)
    List<Object[]> countByRegion(@Param("date") LocalDate date);

}
