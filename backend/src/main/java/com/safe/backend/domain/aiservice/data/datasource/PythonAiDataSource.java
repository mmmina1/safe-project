package com.safe.backend.domain.aiservice.data.datasource;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.safe.backend.domain.aiservice.data.Model.ChatRequestModel;
import com.safe.backend.domain.aiservice.data.Model.ChatResponseModel;
import com.safe.backend.domain.aiservice.data.Model.SimEvaluateRequestModel;
import com.safe.backend.domain.aiservice.data.Model.SimGeneralResponseModel;
import com.safe.backend.domain.aiservice.data.Model.SimStartRequestModel;

/**
 * PythonAiDataSource: 파이썬 AI 서버와 통신을 담당하는 데이터 소스 클래스 (Infrastructure Layer)
 */
@Component
@RequiredArgsConstructor
public class PythonAiDataSource {

    // 외부 API 호출을 위한 스프링 제공 템플릿
    private final RestTemplate restTemplate = new RestTemplate();

    // application.properties에서 설정된 파이썬 백엔드 주소 (기본값: http://localhost:8000)
    @Value("${python.backend.url:http://localhost:8000}")
    private String pythonBackendUrl;

    /**
     * 챗봇 메시지를 파이썬 AI 서버로 전송하고 답변을 받아옴
     * 
     * @param message 사용자 질문 내용
     * @param userId  사용자 ID (세션 구분용)
     * @return AI 답변 및 근거 자료가 담긴 응답 객체
     */
    public ChatResponseModel sendChatMessage(String message, String userId) {
        String url = pythonBackendUrl + "/chat";
        ChatRequestModel request = new ChatRequestModel(message, userId);

        // HTTP 헤더 설정 (JSON 형식으로 통신)
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<ChatRequestModel> entity = new HttpEntity<>(request, headers);

        try {
            // 파이썬 서버에 POST 요청 전송 및 결과를 ChatResponse DTO로 변환
            ResponseEntity<ChatResponseModel> response = restTemplate.postForEntity(url, entity,
                    ChatResponseModel.class);
            return response.getBody();
        } catch (Exception e) {
            // 통신 실패 시 로그를 남기고 사용자에게 보여줄 안내 메시지 반환
            System.err.println("Python AI 서비스 호출 실패: " + e.getMessage());
            return new ChatResponseModel(
                    "죄송합니다. AI 서비스에 일시적인 문제가 발생했습니다.",
                    new java.util.ArrayList<>(),
                    "error");
        }
    }

    /**
     * 전화번호 기반 AI 취약점 진단 요청 (현재 시뮬레이션용)
     * 
     * @param phoneNumber 진단할 대상 번호
     * @return 진단 결과 문자열
     */
    public String requestDiagnosis(String phoneNumber) {
        String url = pythonBackendUrl + "/diagnosis";
        try {
            // 파이썬 서버에 GET 요청 전송
            ResponseEntity<String> response = restTemplate.getForEntity(url + "?number=" + phoneNumber, String.class);
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Python 진단 서비스 호출 실패: " + e.getMessage());
            return "진단 서비스 오류";
        }
    }

    /**
     * 시뮬레이션 시나리오 시작 요청
     */
    public SimGeneralResponseModel startSimulation(String scenarioType) {
        String url = pythonBackendUrl + "/simulator/start";
        SimStartRequestModel request = new SimStartRequestModel(scenarioType);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<SimStartRequestModel> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<SimGeneralResponseModel> response = restTemplate.postForEntity(url, entity,
                    SimGeneralResponseModel.class);
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Python AI 시뮬레이션 시작 실패: " + e.getMessage());
            return null;
        }
    }

    /**
     * 시뮬레이션 결과 평가 요청
     */
    public SimGeneralResponseModel evaluateSimulation(String situation, String playerAnswer) {
        String url = pythonBackendUrl + "/simulator/evaluate";
        SimEvaluateRequestModel request = new SimEvaluateRequestModel(situation, playerAnswer);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<SimEvaluateRequestModel> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<SimGeneralResponseModel> response = restTemplate.postForEntity(url, entity,
                    SimGeneralResponseModel.class);
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Python AI 시뮬레이션 평가 실패: " + e.getMessage());
            return null;
        }
    }
}
