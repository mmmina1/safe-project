package com.safe.backend.domain.auth.dto;

public class GoogleLoginRequest {
    private String code;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}
