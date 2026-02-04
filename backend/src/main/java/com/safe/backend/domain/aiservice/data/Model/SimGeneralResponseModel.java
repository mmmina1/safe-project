package com.safe.backend.domain.aiservice.data.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SimGeneralResponseModel {
    private String status;
    private Map<String, Object> data;
}
