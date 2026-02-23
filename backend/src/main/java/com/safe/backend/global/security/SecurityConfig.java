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
import jakarta.servlet.http.HttpServletResponse;

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
                                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .formLogin(form -> form.disable())
                                .httpBasic(basic -> basic.disable())
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(
                                                                "/api/auth/**",
                                                                "/api/monitoring/**",
                                                                "/api/test",
                                                                "/oauth2/**",
                                                                "/oauth2/callback/**",
                                                                "/api/images/upload",
                                                                "/api/ai/**",
                                                                "/api/v1/payments/**",
                                                                "/api/comments/**")
                                                .permitAll()
                                                .requestMatchers("/api/admin/**").permitAll()
                                                .requestMatchers("/api/operator/**").hasAnyRole("ADMIN", "OPERATOR")

                                                // 게시글 및 상품 조회 API는 모두에게 허용
                                                .requestMatchers(HttpMethod.GET,
                                                                "/api/community/posts/**",
                                                                "/api/products/**",
                                                                "/api/product/**")
                                                .permitAll()

                                                .requestMatchers("/uploads/**").permitAll()
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                                                // 커뮤니티 게시글: 등록/수정/삭제 시 인증 필요
                                                .requestMatchers(HttpMethod.POST, "/api/community/posts/**")
                                                .authenticated()
                                                .requestMatchers(HttpMethod.PUT, "/api/community/posts/**")
                                                .authenticated()
                                                .requestMatchers(HttpMethod.DELETE, "/api/community/posts/**")
                                                .authenticated()

                                                // 상품: 등록/수정/삭제 시 인증 필요
                                                .requestMatchers(HttpMethod.POST, "/api/products/**", "/api/product/**")
                                                .authenticated()
                                                .requestMatchers(HttpMethod.PUT, "/api/products/**", "/api/product/**")
                                                .authenticated()
                                                .requestMatchers(HttpMethod.DELETE, "/api/products/**",
                                                                "/api/product/**")
                                                .authenticated()
                                                .requestMatchers(HttpMethod.PATCH, "/api/products/**",
                                                                "/api/product/**")
                                                .authenticated()

                                                .requestMatchers("/api/cart/**").authenticated()
                                                .anyRequest().authenticated());

                http.addFilterBefore(
                                new JwtAuthenticationFilter(jwtTokenProvider, userRepository),
                                UsernamePasswordAuthenticationFilter.class);

                http.exceptionHandling(exception -> exception
                                .authenticationEntryPoint((request, response, authException) -> {
                                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                        response.setContentType("application/json;charset=UTF-8");
                                        response.getWriter()
                                                        .write("{\"error\":\"Unauthorized\",\"message\":\""
                                                                        + authException.getMessage() + "\"}");
                                })
                                .accessDeniedHandler((request, response, accessDeniedException) -> {
                                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                                        response.setContentType("application/json;charset=UTF-8");
                                        response.getWriter().write(
                                                        "{\"error\":\"Access Denied\",\"message\":\""
                                                                        + accessDeniedException.getMessage() + "\"}");
                                }));

                return http.build();
        }

        @org.springframework.beans.factory.annotation.Value("${cors.allowed-origins}")
        private String allowedOrigins;

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration config = new CorsConfiguration();

                // 프론트 주소 허용 (환경 변수 또는 기본값 사용)
                if (allowedOrigins != null && !allowedOrigins.isEmpty()) {
                        config.setAllowedOrigins(java.util.Arrays.asList(allowedOrigins.split(",")));
                } else {
                        config.setAllowedOriginPatterns(List.of(
                                        "http://localhost:5173",
                                        "http://localhost",
                                        "http://127.0.0.1"));
                }

                config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of("*"));
                config.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", config);
                return source;
        }

}
