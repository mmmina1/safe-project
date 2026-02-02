package com.safe.backend.domain.aiservice.data.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "ai_chat_message")
public class AiChatDBModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long msgId;

    private Long userId; // 또는 User 엔티티와의 @ManyToOne 관계
    private String role;

    @Column(columnDefinition = "LONGTEXT")
    private String content;

    private LocalDateTime createdDate = LocalDateTime.now();

    // 저장용 생성자
    public AiChatDBModel(Long userId, String role, String content) {
        this.userId = userId;
        this.role = role;
        this.content = content;
    }
}
