package com.safe.backend.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class SchedulerConfig {
    // Spring Scheduler 활성화
    // @Scheduled 어노테이션 사용 가능
}
