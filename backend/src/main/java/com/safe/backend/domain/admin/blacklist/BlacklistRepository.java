package com.safe.backend.domain.admin.blacklist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BlacklistRepository extends JpaRepository<Blacklist, Long> {
    Optional<Blacklist> findByTargetValueAndType(String targetValue, String type);

    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE FROM blacklist WHERE blacklist_id = :id", nativeQuery = true)
    int deleteByBlacklistIdNative(@Param("id") Long id);

    @Query("SELECT b FROM Blacklist b WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "b.targetValue LIKE %:keyword%)")
    List<Blacklist> search(@Param("keyword") String keyword);
}
