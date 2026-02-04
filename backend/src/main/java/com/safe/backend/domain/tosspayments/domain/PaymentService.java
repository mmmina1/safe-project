package com.safe.backend.domain.tosspayments.domain;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class PaymentService {

    @Value("${toss.payments.secret-key}")
    private String secretKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public ResponseEntity<String> confirmPayment(String paymentKey, String orderId, String amount) {
        String url = "https://api.tosspayments.com/v1/payments/confirm";

        // Secret Key를 Base64 인코딩하여 Authorization 헤더 작성
        String authorizations = secretKey + ":";
        String encodedAuthorizations = Base64.getEncoder()
                .encodeToString(authorizations.getBytes(StandardCharsets.UTF_8));

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + encodedAuthorizations);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> params = new HashMap<>();
        params.put("paymentKey", paymentKey);
        params.put("orderId", orderId);
        params.put("amount", amount);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(params, headers);

        log.info("토스 API 승인 요청 시도: paymentKey={}", paymentKey);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
        log.info("토스 API 승인 응답 수신: status={}", response.getStatusCode());

        return response;
    }
}
