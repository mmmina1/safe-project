import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import './AdminDashboard.css';

const lineData = [
  { name: '00시', detect: 4 }, { name: '04시', detect: 2 },
  { name: '08시', detect: 8 }, { name: '12시', detect: 15 },
  { name: '16시', detect: 10 }, { name: '20시', detect: 18 },
  { name: '24시', detect: 12 },
];

const pieData = [
  { name: '이상 로그인', value: 400 },
  { name: '대량 요청', value: 300 },
  { name: '데이터 유출', value: 200 },
];

const membershipData = [
  { name: 'VIP', value: 120 },
  { name: 'Pro', value: 280 },
  { name: 'Basic', value: 540 },
];

const RISK_COLORS = ['var(--chart-info)', 'var(--chart-warning)', 'var(--chart-danger)'];
const MEMBER_COLORS = ['var(--chart-danger)', 'var(--chart-info)', 'var(--chart-success)'];

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      {/* 타이틀 섹션 */}
      <div className="dashboard-intro">
        <h1 className="admin-title">관리자 대시보드</h1>
        <p className="admin-subtitle">
          RiskWatch 서비스의 실시간 보안 관제 현황 및 비즈니스 성장 지표를 분석합니다.
        </p>
      </div>

      {/* 1. 보안 통합 섹션 */}
      <section className="dashboard-section risk-section">
        <div className="section-header">
          <div className="header-title-group">
            <h2>🛡️ 보안 관제 및 위협 분석</h2>
            <span className="server-status-pill">서버 상태: 정상</span>
          </div>
          <span className="status-live">실시간 모니터링 중</span>
        </div>

        <div className="risk-content-grid">
          <div className="chart-main">
            <h3 className="mini-title">시간대별 위협 탐지 추이</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'transparent', border: 'none' }} // 기본 스타일 간섭 제거
                  itemStyle={{ padding: '2px 0' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} // 라인차트 커서 가이드선
                />
                <Line
                  type="monotone"
                  dataKey="detect"
                  stroke="var(--chart-danger)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "var(--chart-danger)", stroke: "#141833", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-side">
            <h3 className="mini-title">위협 유형 비율</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} innerRadius="60%" outerRadius="80%" paddingAngle={5} dataKey="value">
                  {pieData.map((e, i) => <Cell key={i} fill={RISK_COLORS[i % 3]} stroke="none" />)}
                </Pie>
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 2. 하단 지표 섹션 */}
      <div className="bottom-row-grid">
        <section className="dashboard-section growth-compact">
          <div className="section-header"><h2>📈 성장 및 사용자 지표</h2></div>
          <div className="kpi-row">
            <div className="kpi-item">
              <span className="label">신규 가입</span>
              <div className="val-group">
                <span className="value">42</span>
                <div className="trend-box">
                  <span className="trend positive">주간 +12.4% ↑</span>
                  <span className="trend positive">월간 +5.1% ↑</span>
                </div>
              </div>
            </div>
            <div className="kpi-item">
              <span className="label">누적 가입</span>
              <div className="val-group">
                <span className="value">1,248</span>
                <div className="trend-box">
                  <span className="trend positive">주간 +2.4% ↑</span>
                  <span className="trend positive">월간 +7.8% ↑</span>
                </div>
              </div>
            </div>
            <div className="kpi-item">
              <span className="label">이탈률</span>
              <div className="val-group">
                <span className="value warning">3.2%</span>
                <div className="trend-box">
                  <span className="trend negative">주간 -0.2% ↓</span>
                  <span className="trend negative">월간 -0.5% ↓</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-section revenue-compact">
          <div className="section-header"><h2>💰 비즈니스 현황</h2></div>
          <div className="revenue-business-content">
            <div className="rev-main-info">
              <span className="label">이번 달 예상 매출</span>
              <div className="val-group">
                <span className="value">₩ 42.8M</span>
                <div className="trend-box">
                  <span className="trend positive">전월비 +12% ↑</span>
                  <span className="trend positive">목표대비 94%</span>
                </div>
              </div>
              <p className="rev-desc">안정적 성장세 유지 중</p>
            </div>

            <div className="v-divider"></div>

            <div className="membership-box">
              <div className="membership-mini-chart">
                <ResponsiveContainer width="100%" height={80}>
                  <PieChart>
                    <Pie data={membershipData} innerRadius="55%" outerRadius="80%" dataKey="value">
                      {membershipData.map((e, i) => <Cell key={i} fill={MEMBER_COLORS[i % 3]} stroke="none" />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="membership-legend">
                {membershipData.map((item, i) => (
                  <div key={i} className="legend-item">
                    <span className="dot" style={{ backgroundColor: MEMBER_COLORS[i] }}></span>
                    <span className="tier-name">{item.name}</span>
                    <span className="tier-val">{item.value}명</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;