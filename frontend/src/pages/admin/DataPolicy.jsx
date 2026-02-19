import React from 'react';
import './DataPolicy.css';

function DataPolicy() {
  return (
    <div className="data-policy">
      <h1 className="admin-title">데이터 기준 안내</h1>
      <p className="admin-subtitle">
        RiskWatch 서비스에서 수집·표시되는 데이터와 관리자 조치 기록의 기준을 안내합니다.
      </p>

      {/* 1. 보안 지표 */}
      <section className="policy-card security">
        <h2>🛡️ 보안 탐지 및 운영 조치</h2>
        <ul>
          <li>
            <strong>탐지 이벤트:</strong> 로그인 등 주요 사용자 행동에서 발생하는 이벤트를 수집하여 대시보드에 표시합니다.
          </li>
          <li>
            <strong>유형 분류:</strong> 탐지 이벤트는 시스템에 정의된 분류 기준(예: 이상 로그인, 스팸/피싱 등)에 따라 유형별로 구분됩니다.
          </li>
          <li>
            <strong>관리자 판단:</strong> 제재는 자동으로 결정되지 않으며, 관리자가 탐지 현황과 사용자 상태를 확인한 후{' '}
            <strong>경고 / 정지 / 제재 해제</strong>를 직접 수행합니다.
          </li>
        </ul>
      </section>

      {/* 2. 성장 지표 */}
      <section className="policy-card">
        <h2>📈 통계 및 집계 기준</h2>
        <ul>
          <li>
            <strong>집계 원칙:</strong> 대시보드 및 화면에 표시되는 통계는 시스템(DB)에 저장된 실제 이벤트/데이터를 기반으로 집계됩니다.
          </li>
          <li>
            <strong>증감 표기:</strong> 증감(변화) 값은 비교 기준(예: 전일 대비, 기간 대비)이 있는 경우에만 함께 표시됩니다.
          </li>
          <li>
            <strong>해석 기준:</strong> 통계 지표는 운영자가 서비스 상태를 빠르게 파악하기 위한 참고 정보이며,
            단일 지표만으로 사용자 제재를 자동 결정하지 않습니다.
          </li>
        </ul>
      </section>

      {/* 3. 시스템 및 운영 기록 */}
      <section className="policy-card system">
        <h2>⚙️ 운영 기록 및 데이터 보존</h2>
        <ul>
          <li>
            <strong>운영 이력:</strong> 관리자의 경고/정지/제재 해제 조치는 운영 이력에 기록되며, 이후 조회할 수 있습니다.
          </li>
          <li>
            <strong>데이터 보존:</strong> 운영 이력 및 주요 데이터는 시스템에 저장되며, 화면에서 확인할 수 있는 범위 내에서 제공됩니다.
          </li>
          <li>
            <strong>서버 상태:</strong> 서버 상태 표시는 현재 서비스의 응답 가능 여부를 기준으로 표시됩니다.
          </li>
        </ul>
      </section>
    </div>
  );
}

export default DataPolicy;
