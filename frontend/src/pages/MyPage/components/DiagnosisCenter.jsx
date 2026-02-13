// ============================================================
// 1. 임포트 구역
// ============================================================
import React, { useState } from 'react';
import { Search, FileText, ChevronRight, LayoutDashboard, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { phishService } from '../../../api/aiServiceApi.js';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

// ============================================================
// 2. 진단 센터 화면 부품
// ============================================================
const DiagnosisCenter = () => {
    // [상태관리] 
    // selectedReport: 목록에서 어떤 리포트를 눌렀는지 기억합니다. (null이면 목록 화면, 데이터가 있으면 상세 화면)
    const [selectedReport, setSelectedReport] = useState(null);
    // activeTab: 상세 리포트 안에서 '요약/권장사항/오답분석' 중 어떤 탭이 보여질지 결정합니다.
    const [activeTab, setActiveTab] = useState('summary');
    // [신규] 서버에서 가져온 실제 진단 내역
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
        phishService.getDiagnosisHistory()
            .then(data => {
                console.log("진단 내역 도착:", data);
                // 서버 데이터를 화면 규격에 맞게 변환
                const mappedHistory = data.map(item => ({
                    id: item.diagId,
                    date: new Date(item.createdDate).toLocaleDateString(),
                    name: 'AI 종합 취약점 진단',
                    score: item.score,
                    status: '완료',
                    summary: item.summary,
                    top3Types: item.top3Types,
                    recommendations: item.recommendations
                }));
                setHistory(mappedHistory);
            })
            .catch(err => {
                console.error("진단 내역 로딩 실패:", err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

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
                                <span className={`status-badge ${selectedReport.score >= 80 ? 'badge-safe' : (selectedReport.score >= 50 ? 'badge-warning' : 'badge-danger')}`}>
                                    {selectedReport.score >= 80 ? '안전' : (selectedReport.score >= 50 ? '주의' : '위험')} 단계
                                </span>
                            </div>
                            <h5 className="card-label">🔍 AI 종합 진단 총평</h5>
                            <div className="bg-light p-4 rounded-4 mb-4 border border-secondary border-opacity-10">
                                <p className="mb-0 fs-5" style={{ lineHeight: '1.7' }}>
                                    {selectedReport.summary}
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'recommend' && (
                        <div className="animate-fade-in">
                            <h5 className="card-label">🛡️ 맞춤형 보안 처방전</h5>
                            {selectedReport.recommendations && selectedReport.recommendations.length > 0 ? (
                                selectedReport.recommendations.map((item, idx) => (
                                    <div key={idx} className="d-flex align-items-center mb-3 p-3 border rounded">
                                        <input type="checkbox" checked={item.isChecked} readOnly className="form-check-input me-3" />
                                        <span className={item.isChecked ? 'text-muted text-decoration-line-through' : 'fw-medium'}>
                                            {item.recText}
                                        </span>
                                        {!item.isChecked && <ChevronRight size={16} className="ms-auto text-muted" />}
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted text-center py-4">사용 가능한 권장사항이 없습니다.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'analysis' && (
                        <div className="animate-fade-in">
                            <h5 className="card-label">⚠ 주의가 필요한 범죄 유형</h5>
                            <div className="d-flex flex-wrap gap-2 mb-4">
                                {selectedReport.top3Types && selectedReport.top3Types.length > 0 ? (
                                    selectedReport.top3Types.map((type, idx) => (
                                        <span key={idx} className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 rounded-pill">
                                            {type}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-muted">분석된 유형이 없습니다.</p>
                                )}
                            </div>
                            <div className="alert alert-light border">
                                <p className="small text-muted mb-0">※ AI가 사용자의 보안 설문 답변을 바탕으로 도출한 위험 요소입니다.</p>
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
                <Link to="/ai" className="text-decoration-none">
                    <button className="btn btn-warning fw-bold px-4 py-2">AI 취약도 진단 바로가기</button>
                </Link>

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
