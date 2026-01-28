package com.safe.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.safe.backend")
public class BackendApplication {//절대 지우면 안되는 파일 -> 프로젝트의 시작점

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
