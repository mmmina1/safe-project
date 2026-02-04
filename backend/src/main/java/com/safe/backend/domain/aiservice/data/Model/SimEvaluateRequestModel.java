package com.safe.backend.domain.aiservice.data.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SimEvaluateRequestModel {
    private String situation;
    private String player_answer;
}
