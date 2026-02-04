package com.safe.backend.domain.auth.service;

import com.safe.backend.domain.auth.dto.*;
import com.safe.backend.domain.auth.entity.AuthAccount;
import com.safe.backend.domain.auth.entity.AuthProvider;
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
    private final KakaoAuthService kakaoAuthService;
    private final GoogleAuthService googleAuthService;
    public AuthService(UserRepository userRepository,
                       AuthAccountRepository authAccountRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       KakaoAuthService kakaoAuthService,
                       GoogleAuthService googleAuthService) {
        this.userRepository = userRepository;
        this.authAccountRepository = authAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.kakaoAuthService = kakaoAuthService;
        this.googleAuthService = googleAuthService;
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

        if (user.getPasswordHash() == null) {
            throw new IllegalArgumentException("소셜 로그인으로 가입된 계정입니다. 카카오 로그인을 사용해 주세요.");
        }

        // 2. 비밀번호 일치 여부 확인
        boolean matches = passwordEncoder.matches(rawPassword, user.getPasswordHash());
        if (!matches) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        // 3. JWT 토큰 발급
        return jwtTokenProvider.createToken(user);
    }
    @Transactional
    public User socialLogin(AuthProvider provider,
                            String providerUserId,
                            String email,
                            String name) {

        // 1️⃣ 이미 이 카카오 계정이 auth_accounts에 연결돼 있는지 먼저 확인
        AuthAccount authAccount = authAccountRepository
                .findByProviderAndProviderUserId(provider, providerUserId)
                .orElse(null);

        if (authAccount != null) {
            // 이미 연결돼 있으면 바로 그 유저 리턴
            return authAccount.getUser();
        }

        // 2️⃣ 이메일로 기존 유저 있는지 확인 (nullable 방어)
        User user = null;
        if (email != null && !email.isBlank()) {
            user = userRepository.findByEmail(email).orElse(null);
        }

        // 3️⃣ 없으면 새 유저 생성 (소셜 전용: 패스워드 null)
        if (user == null) {
            user = new User(email, name, null);
            user = userRepository.save(user);
        }

        // 4️⃣ 같은 유저 + 같은 provider로 이미 연결된 게 있는지 한 번 더 방어
        boolean alreadyLinked = authAccountRepository.existsByProviderAndUser(provider, user);
        if (!alreadyLinked) {
            AuthAccount socialAccount = AuthAccount.createSocial(user, provider, providerUserId);
            authAccountRepository.save(socialAccount);
        }

        // 5️⃣ 최종 유저 반환
        return user;
    }

    /**
     * 카카오 로그인 전용: code → access token → user info → socialLogin 재사용
     */
    @Transactional
    public LoginResponse kakaoLogin(String code) {

        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("카카오 인가 코드가 비어 있습니다.");
        }

        // 1) 인가코드로 access token 요청
        KakaoTokenResponse tokenResponse;
        try {
            tokenResponse = kakaoAuthService.getAccessToken(code);
            System.out.println("[KAKAO LOGIN] tokenResponse = " + tokenResponse);
        } catch (Exception e) {
            e.printStackTrace();
            throw new IllegalArgumentException("카카오 토큰 발급에 실패했습니다. (code 단계)");
        }

        if (tokenResponse == null || tokenResponse.getAccessToken() == null) {
            throw new IllegalArgumentException("카카오 토큰 응답이 비정상입니다.");
        }

        String accessToken = tokenResponse.getAccessToken();
        System.out.println("[KAKAO LOGIN] accessToken = " + accessToken);

        // 2) access token으로 카카오 유저 정보 조회
        KakaoUserResponse kakaoUser;
        try {
            kakaoUser = kakaoAuthService.getUserInfo(accessToken);
            System.out.println("[KAKAO LOGIN] kakaoUser = " + kakaoUser);
        } catch (Exception e) {
            e.printStackTrace();
            throw new IllegalArgumentException("카카오 사용자 정보 조회에 실패했습니다. (user 단계)");
        }

        if (kakaoUser == null || kakaoUser.getId() == null) {
            throw new IllegalArgumentException("카카오 사용자 정보 응답이 비정상입니다. (id 없음)");
        }

        // 3) 카카오에서 내려주는 정보 파싱
        String kakaoId = String.valueOf(kakaoUser.getId());

        String email = null;
        String nickname = null;

        // 3-1. kakao_account 에서 email / profile.nickname 먼저 시도
        if (kakaoUser.getKakaoAccount() != null) {
            email = kakaoUser.getKakaoAccount().getEmail();

            if (kakaoUser.getKakaoAccount().getProfile() != null) {
                nickname = kakaoUser.getKakaoAccount().getProfile().getNickname();
            }
        }

        // 3-2. profile 쪽이 비어 있으면 properties.nickname 사용
        if ((nickname == null || nickname.isBlank())
                && kakaoUser.getProperties() != null) {
            nickname = kakaoUser.getProperties().getNickname();
        }

        System.out.println("[KAKAO LOGIN] parsed email = " + email + ", nickname = " + nickname);

        // 4) 이메일/닉네임 null-safe 처리 (DB 제약 깨지지 않게)
        if (email == null || email.isBlank()) {
            email = "kakao_" + kakaoId + "@kakao.local";
            System.out.println("[KAKAO LOGIN] fallback email = " + email);
        }

        if (nickname == null || nickname.isBlank()) {
            nickname = "카카오유저-" + kakaoId;
        }

        // 5) 공통 소셜 로그인 로직 재사용
        User user = socialLogin(AuthProvider.KAKAO, kakaoId, email, nickname);
        System.out.println("[KAKAO LOGIN] user = " + user);

        if (user == null) {
            throw new IllegalArgumentException("카카오 계정과 연결된 유저를 생성/조회하지 못했습니다.");
        }

        // 6) JWT 발급
        String jwt = jwtTokenProvider.createToken(user);
        System.out.println("[KAKAO LOGIN] jwt = " + jwt);
        // 6-1) User에서 role 추출 (필드명에 맞게 수정)
        String role = user.getRole().name();  // 예: Role이 enum이면 .name()

        // 7) 최종 응답
        return new LoginResponse(jwt, user.getEmail(), user.getName(), role);
    }

    @Transactional
    public LoginResponse googleLogin(String code) {

        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("구글 인가 코드가 비어 있습니다.");
        }

        // 1) code → access token
        GoogleTokenResponse tokenResponse;
        try {
            tokenResponse = googleAuthService.getAccessToken(code);
            System.out.println("[GOOGLE LOGIN] tokenResponse = " + tokenResponse);
        } catch (Exception e) {
            e.printStackTrace();
            throw new IllegalArgumentException("구글 토큰 발급에 실패했습니다. (code 단계)");
        }

        if (tokenResponse == null || tokenResponse.getAccessToken() == null) {
            throw new IllegalArgumentException("구글 토큰 응답이 비정상입니다.");
        }

        String accessToken = tokenResponse.getAccessToken();
        System.out.println("[GOOGLE LOGIN] accessToken = " + accessToken);

        // 2) access token → user info
        GoogleUserResponse googleUser;
        try {
            googleUser = googleAuthService.getUserInfo(accessToken);
            System.out.println("[GOOGLE LOGIN] googleUser = " + googleUser);
        } catch (Exception e) {
            e.printStackTrace();
            throw new IllegalArgumentException("구글 사용자 정보 조회에 실패했습니다. (user 단계)");
        }

        if (googleUser == null || googleUser.getSub() == null) {
            throw new IllegalArgumentException("구글 사용자 정보 응답이 비정상입니다. (sub 없음)");
        }

        String googleId = googleUser.getSub();
        String email    = googleUser.getEmail();
        String name     = googleUser.getName();

        if (email == null || email.isBlank()) {
            email = "google_" + googleId + "@google.local";
        }
        if (name == null || name.isBlank()) {
            name = "구글유저-" + googleId;
        }

        User user = socialLogin(AuthProvider.GOOGLE, googleId, email, name);
        System.out.println("[GOOGLE LOGIN] user = " + user);

        String jwt = jwtTokenProvider.createToken(user);

        //  여기서도 role 추출
        String role = user.getRole().name();  // 필드명 다르면 맞춰서 변경
        return new LoginResponse(jwt, user.getEmail(), user.getName(), role);
    }


}
