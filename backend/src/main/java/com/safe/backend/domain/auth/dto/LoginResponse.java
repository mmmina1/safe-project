package com.safe.backend.domain.auth.dto;

public class LoginResponse {

    private String accessToken;
    private String email;
    private String name;

    public LoginResponse(String accessToken, String email, String name) {
        this.accessToken = accessToken;
        this.email = email;
        this.name = name;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }
}
