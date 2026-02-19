package com.safe.backend.domain.user.repository;

import com.safe.backend.domain.user.entity.User;
import com.safe.backend.domain.user.entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);

    // 검색 메서드들 - DB 스키마에 맞게 name(닉네임/이름), email로 검색
    @Query("SELECT u FROM User u WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "u.email LIKE %:keyword% OR " +
           "u.name LIKE %:keyword%) " +
           "AND (:status IS NULL OR u.status = :status)")
    List<User> searchUsers(
            @Param("keyword") String keyword,
            @Param("status") UserStatus status
    );

    /** 대시보드용: 특정 상태 회원 수 (ACTIVE만 세면 "현재 이용 가능 회원 수") */
    long countByStatus(UserStatus status);
}
