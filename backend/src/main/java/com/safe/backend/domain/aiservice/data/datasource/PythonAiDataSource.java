package com.safe.backend.domain.aiservice.data.datasource;

import com.safe.backend.domain.aiservice.data.dto.ChatRequest;
import com.safe.backend.domain.aiservice.data.dto.ChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class PythonAiDataSource {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${python.backend.url:http://localhost:8000}")
    private String pythonBackendUrl;

    public ChatResponse sendChatMessage(String message, String userId) {
        String url = pythonBackendUrl + "/chat";
        ChatRequest request = new ChatRequest(message, userId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<ChatRequest> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<ChatResponse> response = restTemplate.postForEntity(url, entity, ChatResponse.class);
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Python AI 서비스 호출 실패: " + e.getMessage());
            return new ChatResponse(
                    "죄송합니다. AI 서비스에 일시적인 문제가 발생했습니다.",
                    new java.util.ArrayList<>(),
                    "error");
        }
    }

    public String requestDiagnosis(String phoneNumber) {
        String url = pythonBackendUrl + "/diagnosis";
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url + "?number=" + phoneNumber, String.class);
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Python 진단 서비스 호출 실패: " + e.getMessage());
            return "진단 서비스 오류";
        }
    }
}
