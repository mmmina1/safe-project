package com.safe.backend.domain.aiservice.usecase;

import com.safe.backend.domain.aiservice.repository.AiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SimulationUseCase {

    private final AiRepository aiRepository;

    public Object start(String scenarioType) {
        return aiRepository.startSimulation(scenarioType);
    }

    public Object evaluate(String situation, String playerAnswer) {
        return aiRepository.evaluateSimulation(situation, playerAnswer);
    }
}
