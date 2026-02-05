package com.safe.backend.domain.auth.service;

import com.safe.backend.domain.auth.entity.PasswordResetToken;
import com.safe.backend.domain.auth.repository.PasswordResetTokenRepository;
import com.safe.backend.domain.user.entity.User;               // ← 실제 엔티티로 수정 (User or AuthAccount)
import com.safe.backend.domain.user.repository.UserRepository; // ← 실제 Repo로 수정
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;                     // ← 이름 맞게 수정
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    private static final long EXPIRE_MINUTES = 30L;

    /**
     * DEMO 버전:
     *  - 이메일로 유저 찾고
     *  - 토큰 생성해서 DB에 저장한 뒤
     *  - 토큰 문자열을 그대로 반환 (메일 대신 응답으로 사용)
     */
    @Transactional
    public String requestResetAndReturnTokenForDemo(String email) {

        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return null;  // 가입 안 된 이메일이면 토큰 없음
        }

        var user = userOpt.get();

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken =
                PasswordResetToken.create(user, token, EXPIRE_MINUTES);

        tokenRepository.save(resetToken);

        // 운영이면 여기서 MailService로 메일 보내는게 정석.
        // 지금은 DEMO라 토큰만 리턴.
        return token;
    }

    /**
     * 토큰을 이용해 실제 비밀번호 재설정
     */
    @Transactional
    public void resetPassword(String token, String newPassword) {

        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 토큰입니다."));

        if (resetToken.isExpired() || resetToken.isUsed()) {
            throw new IllegalStateException("만료되었거나 이미 사용된 토큰입니다.");
        }

        User user = resetToken.getUser(); // 실제 엔티티 타입에 맞게

        String encoded = passwordEncoder.encode(newPassword);
        user.changePassword(encoded);

        resetToken.markUsed();
    }
}