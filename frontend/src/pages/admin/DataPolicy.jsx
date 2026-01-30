// src/pages/admin/DataPolicy.jsx
import React from 'react';
import './DataPolicy.css';

function DataPolicy() {
  return (
    <div className="data-policy">
      <h1 className="admin-title">데이터 기준 안내</h1>
      <p className="admin-subtitle">
        RiskWatch 서비스에서 사용하는 데이터 산정 기준 및 운영 원칙을 안내합니다.
      </p>

      <section className="policy-card">
        <h2>1. 위험 점수 산정 기준</h2>
        <ul>
          <li>사용자 행위 로그를 기반으로 이상 패턴을 분석합니다.</li>
          <li>단기간 반복 시도, 비정상 접근 빈도 등을 가중치로 반영합니다.</li>
          <li>점수는 내부 기준에 따라 0–100 범위로 산출됩니다.</li>
        </ul>
      </section>

      <section className="policy-card">
        <h2>2. 사용자 상태 분류</h2>
        <ul>
          <li>
            <strong>NORMAL</strong> : 정상 사용자
          </li>
          <li>
            <strong>WARNING</strong> : 주의 필요 (모니터링 대상)
          </li>
          <li>
            <strong>BLOCKED</strong> : 서비스 이용 제한
          </li>
        </ul>
      </section>

      <section className="policy-card">
        <h2>3. 관리자 조치 로그</h2>
        <ul>
          <li>모든 관리자 조치는 이력으로 저장됩니다.</li>
          <li>조치 시간, 관리자 계정, 대상 사용자 정보가 포함됩니다.</li>
          <li>로그 데이터는 변경·삭제할 수 없습니다.</li>
        </ul>
      </section>
    </div>
  );
}

export default DataPolicy;