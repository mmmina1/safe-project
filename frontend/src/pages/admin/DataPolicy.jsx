import React from 'react';
import './DataPolicy.css';

function DataPolicy() {
  return (
    <div className="data-policy">
      <h1 className="admin-title">데이터 기준 안내</h1>
      <p className="admin-subtitle">
        RiskWatch 서비스의 보안 관제 및 비즈니스 지표 산정 원칙입니다.
      </p>

      {/* 1. 보안 지표 */}
      <section className="policy-card security">
        <h2>🛡️ 위험 점수 및 보안 탐지</h2>
        <ul>
          <li><strong>리스크 점수:</strong> 접근 빈도, IP 평판, 위협 패턴을 종합하여 <strong>0~100점</strong>으로 환산합니다.</li>
          <li><strong>실시간 반영:</strong> 대시보드의 위협 탐지 그래프는 <strong>5분 단위</strong>로 집계되어 즉시 업데이트됩니다.</li>
          <li><strong>탐지 유형:</strong> 이상 로그인(Credential Stuffing), 대량 요청(DDoS 시도) 등을 우선 순위로 분류합니다.</li>
        </ul>
      </section>

      {/* 2. 성장 지표 */}
      <section className="policy-card">
        <h2>📈 성장 및 통계 지표</h2>
        <ul>
          <li><strong>증감률 계산:</strong> 모든 % 지표는 전일 또는 전월 동기 대비 수치를 기준으로 합니다.
            <br />
            <span className="formula">((현재값 - 이전값) / 이전값) × 100</span>
          </li>
          <li><strong>주간 지표:</strong> 최근 7일간의 합산 데이터를 직전 7일과 비교하여 산출합니다.</li>
          <li><strong>이탈률(Churn):</strong> 마지막 접속 후 30일 이상 경과한 사용자를 기준으로 계산합니다.</li>
        </ul>
      </section>

      {/* 3. 시스템 및 매출 기준 */}
      <section className="policy-card system">
        <h2>⚙️ 데이터 보존 및 비즈니스 관리</h2>
        <ul>
          <li><strong>예상 매출:</strong> 당월 <strong>결제 완료된 확정 금액</strong>과 멤버십 갱신 예정액을 합산하여 산출하며, 미납금은 포함하지 않습니다.</li>
          <li><strong>조치 로그:</strong> 관리자가 수행한 모든 차단/해제 이력은 <strong>영구 보존</strong>되며 수정이 불가능합니다.</li>
          <li><strong>멤버십 분류:</strong> VIP, Pro, Basic 티어는 월간 API 사용량 및 구독 상태에 따라 자동 갱신됩니다.</li>
          <li><strong>서버 상태:</strong> 대시보드 상단의 '정상' 표시는 각 노드의 <strong>Health Check</strong> 결과가 99.9% 이상일 때 유지됩니다.</li>
        </ul>
      </section>
    </div>
  );
}

export default DataPolicy;