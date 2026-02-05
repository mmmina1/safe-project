package com.safe.backend.global.security;

import com.safe.backend.domain.user.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public SecurityConfig(JwtTokenProvider jwtTokenProvider,
                          UserRepository userRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 회원가입 / 로그인 / 테스트 API 등은 모두 허용
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/monitoring/**",
                                "/api/test",
                                "/oauth2/**",
                                "/oauth2/callback/**",
                                "/api/images/upload",
                                "/api/ai/**",
                                "/api/v1/payments/**",
                                "/api/comments/**"
                        ).permitAll()

                        //  관리자 전용 API
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        .requestMatchers("/api/operator/**").hasAnyRole("ADMIN", "OPERATOR")

                        //✅ 해당 내용 추가!! - 최민아
                        .requestMatchers(HttpMethod.GET,
                                "/api/community/posts/**",
                                "/api/products/**",      // 실제 백엔드 경로에 맞게!
                                "/api/product/**"        // 혹시 이 경로면 이것도!
                        ).permitAll()

                        // ✅ 커뮤니티: 작성/수정/삭제는 로그인 필요
                        .requestMatchers(HttpMethod.POST,   "/api/community/posts/**").authenticated()
                        .requestMatchers(HttpMethod.PUT,    "/api/community/posts/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/community/posts/**").authenticated()

                        // ✅ 상품: 등록/수정/삭제는 일단 로그인 필요(또는 ADMIN으로 변경 가능)
                        .requestMatchers(HttpMethod.POST,   "/api/products/**", "/api/product/**").authenticated()
                        .requestMatchers(HttpMethod.PUT,    "/api/products/**", "/api/product/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**", "/api/product/**").authenticated()


                        // 그 외는 토큰 필요
                        .anyRequest().authenticated()
                );

        // JWT 필터 추가
        http.addFilterBefore(
                new JwtAuthenticationFilter(jwtTokenProvider, userRepository),
                UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 프론트 주소 허용 (React dev 서버)
        config.setAllowedOrigins(List.of("http://localhost:5173"));

        // 허용할 HTTP 메서드
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 허용할 헤더
        config.setAllowedHeaders(List.of("*"));

        // JWT를 헤더로 쓰는 경우라도, 나중에 쿠키 쓸 수도 있으니 true로 켜둬도 무방
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}

