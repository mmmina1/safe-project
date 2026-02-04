package com.safe.backend.domain.auth.dto;

public class LoginResponse {

    private String accessToken;
    private String email;
    private String name;
    private String role;
    public LoginResponse(String accessToken, String email, String name, String role) {
        this.accessToken = accessToken;
        this.email = email;
        this.name = name;
        this.role = role;
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

    public String getRole() { return role; }
}
