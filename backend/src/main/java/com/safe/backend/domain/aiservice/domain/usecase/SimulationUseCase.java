package com.safe.backend.domain.aiservice.domain.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.safe.backend.domain.aiservice.domain.repository.AiRepository;

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
