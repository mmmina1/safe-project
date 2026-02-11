package com.safe.backend.domain.aiservice.domain.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.safe.backend.domain.aiservice.domain.repository.AiRepository;

@Service
@RequiredArgsConstructor
public class DiagnosisUseCase {

    private final AiRepository aiRepository;

    public String execute(String phoneNumber) {
        // 비즈니스 로직 & 검증
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return "전화번호를 입력해주세요.";
        }
        return aiRepository.diagnosePhishing(phoneNumber);
    }
}
