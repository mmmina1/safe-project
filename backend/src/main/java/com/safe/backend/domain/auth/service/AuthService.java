package com.safe.backend.domain.auth.service;

import com.safe.backend.domain.auth.entity.AuthAccount;
import com.safe.backend.domain.auth.repository.AuthAccountRepository;
import com.safe.backend.domain.user.entity.User;
import com.safe.backend.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AuthAccountRepository authAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
            AuthAccountRepository authAccountRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.authAccountRepository = authAccountRepository;
        this.passwordEncoder = passwordEncoder;
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

    @Transactional
    public void login(String email, String rawPassword) {
        // 1. 이메일로 유저 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        // 2. 비밀번호 일치 여부 확인 (BCrypt)
        // user.getPassword() / user.getPasswordHash() 중 네 엔티티에 맞게 바꿔야 함
        boolean matches = passwordEncoder.matches(rawPassword, user.getPasswordHash());

        if (!matches) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        // 3. (선택) last_login_at 업데이트 같은 것 여기서 해도 됨
        // user.updateLastLoginAt(LocalDateTime.now());
        // userRepository.save(user); // dirty checking 적용되면 생략 가능
    }

}
