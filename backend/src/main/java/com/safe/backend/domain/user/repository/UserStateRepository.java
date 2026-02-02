package com.safe.backend.domain.user.repository;

import com.safe.backend.domain.user.entity.UserState;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserStateRepository extends JpaRepository<UserState, Long> {
    List<UserState> findByUserIdOrderByStateDateDesc(Long userId);
    List<UserState> findByUserIdAndEndDateIsNull(Long userId); // 현재 적용중인 제재
}
