// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import './AdminDashboard.css';

function AdminDashboard() {
  // ===== 더미 데이터 (전일 기준) =====
  const overview = {
    users: 1248,
    visitors: 5320,
    activeUsers: 876,
    churnRate: '3.2%',
  };

  const risk = {
    detections: 17,
    diffDay: '+3',
    diffWeek: '+12%',
    diffMonth: '-5%',
    anomaly: true,
  };

  return (
    <div className="admin-dashboard">
      {/* ================= PAGE HEADER ================= */}
      <header className="dashboard-header">
        <h1>서비스 종합 대시보드</h1>
        <span>전일 기준 · 서비스 지표 및 리스크 현황</span>
      </header>

      {/* ================= PRIMARY ZONE ================= */}
      <section className="dashboard-section primary">
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="label">가입자 수</div>
            <div className="value">{overview.users}</div>
          </div>

          <div className="kpi-card">
            <div className="label">방문자 수</div>
            <div className="value">{overview.visitors}</div>
          </div>

          <div className="kpi-card">
            <div className="label">활성 사용자</div>
            <div className="value">{overview.activeUsers}</div>
          </div>

          <div className="kpi-card">
            <div className="label">이탈률</div>
            <div className="value warning">{overview.churnRate}</div>
          </div>
        </div>

        <div className="wide-chart">
          위험 탐지 그래프 영역 (전일 대비 · 전주/전월 비교)
          {risk.anomaly && (
            <span className="alert-badge">이상치 발생</span>
          )}
        </div>
      </section>

      {/* ================= SECONDARY ZONE ================= */}
      <section className="dashboard-section secondary">
        <div className="risk-summary-grid">
          <div className="summary-card">
            <div className="label">전일 위험 탐지 건수</div>
            <div className="value highlight">{risk.detections}</div>
            <div className="diff">전일 대비 {risk.diffDay}</div>
          </div>

          <div className="summary-card">
            <div className="label">전주 대비</div>
            <div className="value warning">{risk.diffWeek}</div>
          </div>

          <div className="summary-card">
            <div className="label">전월 대비</div>
            <div className="value danger">{risk.diffMonth}</div>
          </div>
        </div>

        <div className="chart-placeholder">
          위험 도메인 목록 · 위험 점수 분포 · 탐지 추이 차트 영역
        </div>
      </section>

      {/* ================= ANALYSIS ZONE ================= */}
      <section className="dashboard-section analysis">
        <div className="analysis-grid">
          <div className="analysis-card">
            위험 탐지 통계<br />
            (기간별 비교 · 유형별 분포)
          </div>

          <div className="analysis-card">
            매출 및 구독 통계<br />
            (요금제별 가입자 분포)
          </div>

          <div className="analysis-card">
            월 매출 · 예상 매출
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;