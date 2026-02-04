import "./StatsCards.css";

export default function StatsCards({ data }) {
  if (!data) return null;

  // 이미 data가 stats이므로 data.stats가 아니라 그냥 data 사용
  const stats = data ?? {};

  return (
    <div className="stats-card-container">
      <div className="stats-card">
        <h4>일일 의심 사례</h4>
        <p className="stats-value">{stats.todayCount ?? 0}</p>
      </div>

      <div className="stats-card">
        <h4>전일 대비</h4>
        <p className={`stats-value ${stats.changeRate >= 0 ? "up" : "down"}`}>
          {stats.changeRate ?? 0}%
        </p>
      </div>

      <div className="stats-card">
        <h4>활성 위험 번호</h4>
        <p className="stats-value">{stats.activeRiskCount ?? 0}</p>
      </div>
    </div>
  );
}
