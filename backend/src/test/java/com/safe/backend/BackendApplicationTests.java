package com.safe.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import javax.sql.DataSource;
import java.sql.Connection;

@SpringBootTest
class BackendApplicationTests {

    @Autowired
    private DataSource dataSource;

    @Test
    void testConnection() {
        try (Connection conn = dataSource.getConnection()) {
            System.out.println("----------------------------------------------");
            System.out.println("✅ DB 연결 성공! 주소: " + conn.getMetaData().getURL());
            System.out.println("----------------------------------------------");
        } catch (Exception e) {
            System.out.println("----------------------------------------------");
            System.out.println("❌ DB 연결 실패 원인: " + e.getMessage());
            System.out.println("----------------------------------------------");
        }
    }
}