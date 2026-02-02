package com.safe.backend.domain.admin.blacklist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BlacklistHistoryRepository extends JpaRepository<BlacklistHistory, Long> {
    List<BlacklistHistory> findByBlacklistOrderByCreatedAtDesc(Blacklist blacklist);

    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE FROM blacklist_history WHERE blacklist_id = :blacklistId", nativeQuery = true)
    int deleteAllByBlacklistId(@Param("blacklistId") Long blacklistId);
}
