package com.safe.backend.global.security;

import com.safe.backend.domain.user.entity.User;
import com.safe.backend.domain.user.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider,
                                   UserRepository userRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String token = resolveToken(request);
        
        // 디버깅: 요청 경로와 토큰 존재 여부 로깅
        if (request.getRequestURI().startsWith("/api/admin")) {
            System.out.println("[JWT Filter] Request URI: " + request.getRequestURI());
            System.out.println("[JWT Filter] Token exists: " + (token != null));
            if (token != null) {
                System.out.println("[JWT Filter] Token valid: " + jwtTokenProvider.validateToken(token));
            }
        }

        if (token != null && jwtTokenProvider.validateToken(token)) {
            Long userId = jwtTokenProvider.getUserId(token);

            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                // 사용자 역할을 Spring Security 권한으로 변환 (ROLE_ prefix 추가)
                String roleName = "ROLE_" + user.getRole().name();
                List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                    new SimpleGrantedAuthority(roleName)
                );

                if (request.getRequestURI().startsWith("/api/admin")) {
                    System.out.println("[JWT Filter] User ID: " + userId);
                    System.out.println("[JWT Filter] User Role: " + user.getRole().name());
                    System.out.println("[JWT Filter] Authority: " + roleName);
                }

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                user, null, authorities
                        );
                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                if (request.getRequestURI().startsWith("/api/admin")) {
                    System.out.println("[JWT Filter] User not found for userId: " + userId);
                }
            }
        } else {
            if (request.getRequestURI().startsWith("/api/admin")) {
                System.out.println("[JWT Filter] Token is null or invalid");
            }
        }

        // 디버깅: 필터 실행 후 SecurityContext 확인
        if (request.getRequestURI().startsWith("/api/admin")) {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null) {
                System.out.println("[JWT Filter] After filter - Authenticated: " + auth.isAuthenticated());
                System.out.println("[JWT Filter] After filter - Authorities: " + auth.getAuthorities());
            } else {
                System.out.println("[JWT Filter] After filter - No authentication in SecurityContext");
            }
        }
        
        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }
}
