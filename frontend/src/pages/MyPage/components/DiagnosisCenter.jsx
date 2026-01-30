// ============================================================
// 1. 임포트 구역
// ============================================================
import React, { useState } from 'react';
import { Search, FileText, ChevronRight, LayoutDashboard, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

// ============================================================
// 2. 진단 센터 화면 부품
// ============================================================
const DiagnosisCenter = () => {
    // [상태관리] 
    // selectedReport: 목록에서 어떤 리포트를 눌렀는지 기억합니다. (null이면 목록 화면, 데이터가 있으면 상세 화면)
    const [selectedReport, setSelectedReport] = useState(null);
    // activeTab: 상세 리포트 안에서 '요약/권장사항/오답분석' 중 어떤 탭이 보여질지 결정합니다.
    const [activeTab, setActiveTab] = useState('summary');

    // [샘플데이터] 화면에 보여줄 가짜 진단 기록 리스트입니다.
    const history = [
        { id: 1, date: '2023.10.25', name: '정기 AI 종합 진단', score: 85, status: '완료' },
        { id: 2, date: '2023.09.01', name: '직업군 특화 진단', score: 72, status: '완료' },
        { id: 3, date: '2023.08.15', name: '간편 진단', score: null, status: '중단' },
    ];

    /* ------------------------------------------------------------
       A. 리포트 상세 보기 화면 (리포트를 클릭했을 때 나타남)
    ------------------------------------------------------------ */
    if (selectedReport) {
        return (
            <div className="animate-fade-in">
                {/* 목록으로 돌아가는 버튼 (selectedReport를 다시 null로 바꿈) */}
                <button className="btn btn-link text-decoration-none mb-4 p-0" onClick={() => setSelectedReport(null)}>
                    &lt; 뒤로가기
                </button>
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <h2 className="mb-0">{selectedReport.date} {selectedReport.name} 결과</h2>
                </div>

                {/* 상세 화면 내부 탭 네비게이션 */}
                <ul className="nav nav-tabs mb-4">
                    {['summary', 'recommend', 'analysis'].map((tab) => (
                        <li className="nav-item" key={tab}>
                            <button
                                className={`nav-link ${activeTab === tab ? 'active fw-bold' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === 'summary' ? '종합 요약' : tab === 'recommend' ? '개선 권장사항' : '오답 유형 분석'}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* 선택된 내부 탭(activeTab)에 따라 보여주는 내용이 바뀝니다 (조건부 렌더링) */}
                <div className="dashboard-card p-4">
                    {activeTab === 'summary' && (
                        <div className="animate-fade-in">
                            <div className="text-center mb-5">
                                <div className="display-4 fw-bold text-primary mb-2">{selectedReport.score}점</div>
                                <span className="status-badge badge-safe">안전 단계</span>
                            </div>
                            <h5 className="card-label">주요 발견 사항</h5>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item px-0">연령대 대비 금융 지식 수준이 높습니다.</li>
                                <li className="list-group-item px-0 text-warning fw-medium">최근 직업 관련 보안 인식이 다소 낮아졌습니다. (주의 필요)</li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'recommend' && (
                        <div className="animate-fade-in">
                            <h5 className="card-label">개선 권장사항 체크리스트</h5>
                            {[
                                { label: '[필수] 비밀번호를 특수문자 포함 12자리 이상으로 변경하세요.', done: false },
                                { label: '[권장] 2단계 인증을 활성화하세요.', done: false },
                                { label: '[완료] 최근 의심스러운 로그인 기록을 확인했습니다.', done: true },
                            ].map((item, idx) => (
                                <div key={idx} className="d-flex align-items-center mb-3 p-3 border rounded">
                                    <input type="checkbox" checked={item.done} readOnly className="form-check-input me-3" />
                                    <span className={item.done ? 'text-muted text-decoration-line-through' : 'fw-medium'}>
                                        {item.label}
                                    </span>
                                    {!item.done && <ChevronRight size={16} className="ms-auto text-muted" />}
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'analysis' && (
                        <div className="animate-fade-in">
                            <h5 className="card-label">가장 많이 틀린 유형: 상황 판단 능력</h5>
                            <div className="alert alert-light border">
                                <p className="fw-bold">Q. 다음 중 스미싱 문자로 의심되는 것은?</p>
                                <div className="small text-danger mb-2">당신의 선택: [오답] 이번달 건강검진 결과 확인하세요 (+링크)</div>
                                <div className="small text-success">정답: 모두 정답 (모든 출처 불분명 링크는 의심해야 함)</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    /* ------------------------------------------------------------
       B. 진단 이력 목록 화면 (기본 화면)
    ------------------------------------------------------------ */
    return (
        <div className="animate-fade-in">
            <h2 className="page-title">진단 센터</h2>

            {/* AI 진단 유도 배너 */}
            <div className="dashboard-card bg-primary text-white p-4 mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mb-2">내 취약점을 완벽하게 파악하고 싶다면?</h4>
                    <p className="opacity-75 mb-0">AI가 분석하는 정밀 보안 진단을 시작해보세요.</p>
                </div>
                <button className="btn btn-warning fw-bold px-4 py-2">AI 취약도 진단 바로가기</button>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-label mb-0">총 {history.length}건의 진단 내역이 있습니다.</h5>
            </div>

            {/* 진단 내역 테이블 목록 */}
            <div className="dashboard-card p-0 overflow-hidden">
                <table className="table table-hover mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th className="px-4 py-3 border-0">날짜</th>
                            <th className="py-3 border-0">진단명</th>
                            <th className="py-3 border-0">점수</th>
                            <th className="py-3 border-0">상태</th>
                            <th className="px-4 py-3 border-0 text-end">리포트</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((item) => (
                            <tr key={item.id} className="align-middle">
                                <td className="px-4 py-3">{item.date}</td>
                                <td className="py-3 fw-medium">{item.name}</td>
                                <td className="py-3">{item.score ? `${item.score}점` : '--'}</td>
                                <td className="py-3">
                                    <span className={`status-badge ${item.status === '완료' ? 'badge-safe' : 'badge-warning'}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-end">
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        // 결과를 클릭하면 selectedReport 상태가 바뀌어 '상세 화면'으로 전환됩니다.
                                        onClick={() => item.status === '완료' ? setSelectedReport(item) : null}
                                    >
                                        {item.status === '완료' ? '결과보기' : '이어하기'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DiagnosisCenter;
