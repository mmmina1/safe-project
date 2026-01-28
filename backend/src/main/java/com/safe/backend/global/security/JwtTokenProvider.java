package com.safe.backend.global.security;

import com.safe.backend.domain.user.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final Key key;
    private final long accessTokenValidityInMillis;

    public JwtTokenProvider(
            @Value("${jwt.secret}") String secretKey,
            @Value("${jwt.access-token-validity-in-seconds}") long accessTokenValidityInSeconds
    ) {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        this.accessTokenValidityInMillis = accessTokenValidityInSeconds * 1000L;
    }

    // 액세스 토큰 생성
    public String createToken(User user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + accessTokenValidityInMillis);

        return Jwts.builder()
                .setSubject(String.valueOf(user.getUserId()))       // sub = user_id
                .claim("email", user.getEmail())
                .claim("role", user.getRole().name())               // enum이면 .name()
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 토큰에서 userId 추출
    public Long getUserId(String token) {
        Claims claims = parseClaims(token);
        return Long.valueOf(claims.getSubject());
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
