package com.safe.backend.domain.admin.blacklist;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "blacklist")
public class Blacklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "blacklist_id")
    private Long blacklistId;

    @Column(name = "target_value", nullable = false, length = 255, insertable = true, updatable = true)
    private String targetValue; // 전화번호 또는 URL

    @Column(name = "type", nullable = false, length = 50, insertable = true, updatable = true)
    private String type; // PHONE 또는 URL

    @Column(name = "report_count", nullable = false)
    private Integer reportCount = 0;

    @Column(name = "voice_report_cnt", nullable = false)
    private Integer voiceReportCnt = 0; // 음성(보이스피싱)신고 횟수

    @Column(name = "sms_report_cnt", nullable = false)
    private Integer smsReportCnt = 0; // 문자(스미싱)신고 횟수

    @Column(name = "last_reported_at")
    private LocalDateTime lastReportedAt; // 최근 신고 일시

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason; // 차단사유

    @Column(name = "is_active", nullable = false)
    private Integer isActive = 1; // 현재 차단 여부

    @Column(name = "created_date", nullable = true, updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (this.createdDate == null) {
            this.createdDate = now;
        }
        if (this.createdAt == null) {
            this.createdAt = now;
        }
    }

    public static Blacklist ofPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("전화번호는 필수입니다.");
        }
        Blacklist b = new Blacklist();
        b.targetValue = phoneNumber.trim();
        b.type = "PHONE";
        b.reportCount = 0;
        b.voiceReportCnt = 0;
        b.smsReportCnt = 0;
        b.isActive = 1;
        b.lastReportedAt = null;
        b.reason = null;
        return b;
    }

    public static Blacklist ofUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            throw new IllegalArgumentException("URL은 필수입니다.");
        }
        Blacklist b = new Blacklist();
        b.targetValue = url.trim();
        b.type = "URL";
        b.reportCount = 0;
        b.voiceReportCnt = 0;
        b.smsReportCnt = 0;
        b.isActive = 1;
        b.lastReportedAt = null;
        b.reason = null;
        return b;
    }

    public void incrementReportCount() {
        this.reportCount = (this.reportCount == null) ? 1 : this.reportCount + 1;
        this.lastReportedAt = LocalDateTime.now();
    }

    public void incrementVoiceReport() {
        this.voiceReportCnt = (this.voiceReportCnt == null) ? 1 : this.voiceReportCnt + 1;
        incrementReportCount();
    }

    public void incrementSmsReport() {
        this.smsReportCnt = (this.smsReportCnt == null) ? 1 : this.smsReportCnt + 1;
        incrementReportCount();
    }

    public void toggleActive() {
        this.isActive = (this.isActive != null && this.isActive == 1) ? 0 : 1;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public void setTargetValue(String targetValue) {
        this.targetValue = targetValue;
    }
}
