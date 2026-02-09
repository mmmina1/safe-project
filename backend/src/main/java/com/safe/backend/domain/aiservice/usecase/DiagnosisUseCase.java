package com.safe.backend.domain.aiservice.usecase;

import com.safe.backend.domain.aiservice.repository.AiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
