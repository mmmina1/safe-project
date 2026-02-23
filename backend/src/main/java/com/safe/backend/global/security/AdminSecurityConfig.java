package com.safe.backend.global.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

// @Configuration
// @Profile("dev")   
// @Order(1)
public class AdminSecurityConfig {

    @Bean
    public SecurityFilterChain adminFilterChain(HttpSecurity http) throws Exception {

        http
                .securityMatcher("/api/admin/**")
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );

        return http.build();
    }
}
