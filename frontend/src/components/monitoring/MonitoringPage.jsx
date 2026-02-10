import StatsCards from "./dashboard/StatsCards";
import FraudTypeChart from "./charts/FraudTypeChart";
import RiskMap from "./map/RiskMap";
import useMonitoringApi from "./hooks/useMonitoringApi";
import "./MonitoringPage.css";

export default function MonitoringPage() {
  const { data, loading, error } = useMonitoringApi();

  return (
    <div className="monitoring-page">
      <h1 className="monitoring-title">📊 실시간 관제 대시보드</h1>

      {loading && <div className="monitoring-status">데이터 불러오는 중...</div>}
      {error && <div className="monitoring-status error">서버 연결 실패</div>}

      {data && (
        <>
          <StatsCards data={data.stats} />

          <div className="monitoring-grid">
            <FraudTypeChart data={data.fraudTypes} />
            <RiskMap data={data.regions} />
          </div>
        </>
      )}
    </div>
  );
}