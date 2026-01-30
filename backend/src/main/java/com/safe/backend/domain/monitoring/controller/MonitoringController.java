package com.safe.backend.domain.monitoring.controller;

import com.safe.backend.domain.monitoring.dto.response.MonitoringResponse;
import com.safe.backend.domain.monitoring.service.MonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/monitoring")
public class MonitoringController {

    private final MonitoringService monitoringService;

    @GetMapping
    public MonitoringResponse getMonitoring() {
        return monitoringService.getMonitoringData();
    }
}