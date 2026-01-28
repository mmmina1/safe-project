package com.safe.backend.domain.auth.dto;

public class SignupRequest {

    private String email;

    private String name;

    private String password;

    public String getEmail() {
        return email;
    }
    public String getName() {
        return name;
    }
    public String getPassword(){
        return password;
    }
}
