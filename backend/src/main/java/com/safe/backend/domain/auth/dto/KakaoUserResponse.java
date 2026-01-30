package com.safe.backend.domain.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class KakaoUserResponse {

    private Long id;

    @JsonProperty("kakao_account")
    private KakaoAccount kakaoAccount;

    // 🔹 추가: properties 전체를 받기 위한 필드
    @JsonProperty("properties")
    private Properties properties;

    public static class KakaoAccount {
        private String email;
        private Profile profile;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public Profile getProfile() { return profile; }
        public void setProfile(Profile profile) { this.profile = profile; }
    }

    public static class Profile {
        private String nickname;

        public String getNickname() { return nickname; }
        public void setNickname(String nickname) { this.nickname = nickname; }
    }

    // 🔹 추가: properties 안에 있는 nickname
    public static class Properties {
        private String nickname;

        public String getNickname() { return nickname; }
        public void setNickname(String nickname) { this.nickname = nickname; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public KakaoAccount getKakaoAccount() { return kakaoAccount; }
    public void setKakaoAccount(KakaoAccount kakaoAccount) { this.kakaoAccount = kakaoAccount; }

    public Properties getProperties() { return properties; }
    public void setProperties(Properties properties) { this.properties = properties; }

    @Override
    public String toString() {
        return "KakaoUserResponse{" +
                "id=" + id +
                ", kakaoAccount=" + kakaoAccount +
                ", properties=" + properties +
                '}';
    }
}