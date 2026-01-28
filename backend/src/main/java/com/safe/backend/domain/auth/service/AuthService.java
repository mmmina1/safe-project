package com.safe.backend.domain.auth.service;

import com.safe.backend.domain.auth.entity.AuthAccount;
import com.safe.backend.domain.auth.repository.AuthAccountRepository;
import com.safe.backend.domain.user.entity.User;
import com.safe.backend.domain.user.repository.UserRepository;
import com.safe.backend.global.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AuthAccountRepository authAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository,
                       AuthAccountRepository authAccountRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.authAccountRepository = authAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public void signup(String email, String name, String rawPassword) {
        // 1. 이메일 중복 체크
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // 2. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // 3. User 생성 & 저장
        User user = new User(email, name, encodedPassword);
        User savedUser = userRepository.save(user);

        // 4. LOCAL 로그인 계정(auth_accounts)도 함께 생성
        AuthAccount localAccount = AuthAccount.createLocal(savedUser);
        authAccountRepository.save(localAccount);
    }

    @Transactional(readOnly = true)
    public String login(String email, String rawPassword) {
        // 1. 이메일로 유저 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        // 2. 비밀번호 일치 여부 확인
        boolean matches = passwordEncoder.matches(rawPassword, user.getPasswordHash());
        if (!matches) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        // 3. JWT 토큰 발급
        return jwtTokenProvider.createToken(user);
    }
}
