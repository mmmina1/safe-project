package com.safe.backend.domain.auth.service;

import com.safe.backend.domain.auth.dto.KakaoTokenResponse;
import com.safe.backend.domain.auth.dto.KakaoUserResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
@Service
public class KakaoAuthService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${kakao.client-id}")
    private String clientId;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    // Secret을 최종적으로 안 쓰는 설정이면 이 부분은 빼도 됩니다.
    // @Value("${kakao.client-secret}")
    // private String clientSecret;

    private static final String TOKEN_URI = "https://kauth.kakao.com/oauth/token";
    private static final String USER_INFO_URI = "https://kapi.kakao.com/v2/user/me";

    public KakaoTokenResponse getAccessToken(String code) {

        System.out.println("BACKEND RECEIVED CODE = " + code);
        System.out.println("CLIENT_ID = " + clientId);
        System.out.println("REDIRECT_URI = " + redirectUri);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);
        // client secret을 다시 쓸 거면 여기서 추가
        // params.add("client_secret", clientSecret);

        System.out.println("KAKAO TOKEN REQUEST PARAMS = " + params);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request =
                new HttpEntity<>(params, headers);

        try {
            // 🔹 최종: DTO로 바로 받기
            ResponseEntity<KakaoTokenResponse> response =
                    restTemplate.postForEntity(
                            TOKEN_URI,
                            request,
                            KakaoTokenResponse.class
                    );

            KakaoTokenResponse body = response.getBody();
            System.out.println("KAKAO TOKEN RESPONSE = " + body);

            return body;

        } catch (HttpClientErrorException e) {
            String body = e.getResponseBodyAsString();
            System.out.println("KAKAO TOKEN ERROR STATUS = " + e.getStatusCode());
            System.out.println("KAKAO TOKEN ERROR BODY   = " + body);
            throw new IllegalArgumentException("카카오 토큰 발급 실패: " + body, e);
        }
    }

    public KakaoUserResponse getUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<KakaoUserResponse> response = restTemplate.exchange(
                USER_INFO_URI,
                HttpMethod.GET,
                request,
                KakaoUserResponse.class
        );

        return response.getBody();
    }
}
