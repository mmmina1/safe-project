package com.safe.backend.domain.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GoogleUserResponse {

    // OpenID Connect 표준 claims
    private String sub;      // 구글 고유 ID
    private String email;
    private String name;

    @JsonProperty("picture")
    private String picture;

    // getter / setter
    public String getSub() { return sub; }
    public void setSub(String sub) { this.sub = sub; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPicture() { return picture; }
    public void setPicture(String picture) { this.picture = picture; }
}
