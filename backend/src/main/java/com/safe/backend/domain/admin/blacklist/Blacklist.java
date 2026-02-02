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

    @Column(name = "target_value", nullable = false, length = 255)
    private String targetValue; // 전화번호 또는 URL

    @Column(name = "type", nullable = false, length = 50)
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

    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
    }

    public static Blacklist ofPhoneNumber(String phoneNumber) {
        Blacklist b = new Blacklist();
        b.targetValue = phoneNumber;
        b.type = "PHONE";
        b.reportCount = 0;
        b.voiceReportCnt = 0;
        b.smsReportCnt = 0;
        b.isActive = 1;
        return b;
    }

    public static Blacklist ofUrl(String url) {
        Blacklist b = new Blacklist();
        b.targetValue = url;
        b.type = "URL";
        b.reportCount = 0;
        b.voiceReportCnt = 0;
        b.smsReportCnt = 0;
        b.isActive = 1;
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
