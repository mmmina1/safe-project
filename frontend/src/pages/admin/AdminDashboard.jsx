import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import './AdminDashboard.css';

const RISK_COLORS = ['var(--chart-info)', 'var(--chart-warning)', 'var(--chart-danger)'];

function AdminDashboard() {
  // ✅ 관리자 대시보드 = 리스크/정책 관점만
  const [riskSummary, setRiskSummary] = useState(null); // /risk/summary
  const [riskTrend, setRiskTrend] = useState(null); // /risk/trend
  const [riskRatio, setRiskRatio] = useState([]); // /risk/ratio

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const [riskSummaryRes, riskTrendRes, riskRatioRes] = await Promise.all([
          axios.get('/api/admin/dashboard/risk/summary'),
          axios.get('/api/admin/dashboard/risk/trend?range=24h'),
          axios.get('/api/admin/dashboard/risk/ratio'),
        ]);

        setRiskSummary(riskSummaryRes.data);
        setRiskTrend(riskTrendRes.data);
        setRiskRatio(riskRatioRes.data);
      } catch (e) {
        console.error(e);
        setError('대시보드 데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="admin-dashboard">로딩 중...</div>;
  }

  if (error || !riskSummary) {
    return <div className="admin-dashboard error">{error || '데이터가 없습니다.'}</div>;
  }

  // ------ 백엔드 데이터 매핑 ------

  // 리스크 요약 (/risk/summary)
  const {
    todaySuspiciousDomainCount = 0,
    activeBlockedDomainCount = 0,
    activeUserCount = 0,
    todayUserSanctionCount = 0,
    serverStatus = 'NORMAL',
    lastUpdatedAt,
    changeCount = 0, // ✅ 추가
    changeRate, // number | null | undefined
  } = riskSummary || {};

  // ===== 전일 대비 표시(절대값 + 변화율) =====
  const parsedRate = Number(changeRate);
  const rateNum = Number.isFinite(parsedRate) ? parsedRate : null;
  const countNum = Number.isFinite(Number(changeCount)) ? Number(changeCount) : 0;

  let changeDisplay = '데이터 없음';

  if (rateNum !== null) {
    const sign = countNum > 0 ? '+' : '';
    changeDisplay = `${sign}${countNum}건 (${rateNum.toFixed(1)}%)`;
  } else {
    // rate가 null/undefined면 보통 전일 데이터 없거나 비교 불가
    const sign = countNum > 0 ? '+' : '';
    changeDisplay = `${sign}${countNum}건 (전일 데이터 없음)`;
  }

  const changeClass =
    rateNum === null
      ? 'trend-neutral'
      : countNum > 0
      ? 'trend-negative' // 위험 증가 → 빨강
      : countNum < 0
      ? 'trend-positive' // 감소 → 초록
      : 'trend-neutral';

  // 시간대별 차트 데이터 (/risk/trend)
  const lineData = (riskTrend?.points || []).map((p) => ({
    name: `${p.hour ?? p.hourLabel}시`,
    detect: p.count ?? 0,
  }));

  // 위협 유형 비율 (/risk/ratio)
  const pieData = (riskRatio || []).map((item) => ({
    name: item.label || item.type || 'UNKNOWN',
    value: item.count ?? 0,
  }));

  return (
    <div className="admin-dashboard">
      {/* 타이틀 섹션 */}
      <div className="dashboard-intro">
        <h1 className="admin-title">관리자 대시보드</h1>
        <p className="admin-subtitle">
          실시간 위협 탐지 현황과 리스크 상태를 한눈에 확인합니다. (운영 지표는 운영자 대시보드로 분리)
        </p>
      </div>

      {/* ✅ 상단 KPI 카드: 리스크만 */}
      <div className="top-kpi-grid">
        <div className="kpi-card kpi-security">
          <span className="label">일일 의심 사례</span>
          <span className="value">{todaySuspiciousDomainCount}</span>
        </div>

        <div className="kpi-card kpi-security">
          <span className="label">전일 대비</span>
          <span className={`value ${changeClass}`}>{changeDisplay}</span>
        </div>

        <div className="kpi-card kpi-security">
          <span className="label">활성 위험 번호</span>
          <span className="value">{activeBlockedDomainCount}</span>
        </div>

        <div className="kpi-card kpi-security">
          <span className="label">활성 사용자 수</span>
          <span className="value">{activeUserCount}</span>
        </div>

        <div className="kpi-card kpi-security">
          <span className="label">오늘 제재 건수</span>
          <span className="value">{todayUserSanctionCount}</span>
        </div>
      </div>

      {/* 1. 보안 통합 섹션 */}
      <section className="dashboard-section risk-section">
        <div className="section-header">
          <div className="header-title-group">
            <h2>🛡️ 보안 관제 및 위협 분석</h2>
            <span className="server-status-pill">
              서버 상태: {serverStatus === 'NORMAL' ? '정상' : serverStatus}
            </span>
          </div>
          <span className="status-live">
            실시간 모니터링 중
            {lastUpdatedAt && <span className="updated-at"> · 업데이트: {lastUpdatedAt}</span>}
          </span>
        </div>

        <div className="risk-content-grid">
          <div className="chart-main">
            <h3 className="mini-title">시간대별 위협 탐지 추이</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                <XAxis
                  dataKey="name"
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={11}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: 'transparent', border: 'none' }}
                  itemStyle={{ padding: '2px 0' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="detect"
                  stroke="var(--chart-danger)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'var(--chart-danger)', stroke: '#141833', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
            {lineData.length === 0 && (
              <p className="chart-placeholder">시간대별 데이터는 아직 수집되지 않았습니다.</p>
            )}
          </div>

          <div className="chart-side">
            <h3 className="mini-title">위협 유형 비율</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((e, i) => (
                    <Cell key={i} fill={RISK_COLORS[i % RISK_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
            {pieData.length === 0 && <p className="chart-placeholder">위협 유형 데이터가 아직 없습니다.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
