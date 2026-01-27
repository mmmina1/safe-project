package com.safe.backend.domain.auth.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {
    @GetMapping("/api/test") // 클래스에 @RequestMapping이 없다면 이대로 유지
    public String test() {
        return "스프링이랑 연결 성공했다!";
    }
}