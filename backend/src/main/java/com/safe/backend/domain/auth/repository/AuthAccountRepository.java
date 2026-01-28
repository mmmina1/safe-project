package com.safe.backend.domain.auth.repository;


import com.safe.backend.domain.auth.entity.AuthAccount;
import com.safe.backend.domain.auth.entity.AuthProvider;
import com.safe.backend.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthAccountRepository extends JpaRepository<AuthAccount, Long> {

    // 소셜 로그인에서 씀: provider + provider_user_id로 계정 찾기
    Optional<AuthAccount> findByProviderAndProviderUserId(AuthProvider provider, String providerUserId);

    // 이 유저가 특정 provider 계정 가지고 있는지
    boolean existsByUserAndProvider(User user, AuthProvider provider);
}