// ============================================================
// 1. 임포트 구역 (라이브러리 데이터 로드)
// ============================================================
import React, { useState, useEffect } from 'react';
import { getDashboardData } from '../../../api/myPageApi.js';
import { Line } from 'react-chartjs-2'; // 선 그래프 부품
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { ArrowUpRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { diagnosisQuestions } from '../../AiService/Diagnosis/data/diagnosisQuestions'; // [NEW] 진단 질문 데이터 (URL 매핑용)

// 차트 엔진을 조립(동작 설정)하는 과정입니다.
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

// ============================================================
// 2. 대시보드 화면 부품
// ============================================================
const Dashboard = () => {

    const userName = localStorage.getItem('userName') || '게스트';

    // 데이터를 저장할 변수들
    const [dashboardData, setDashboardData] = useState(null);

    // [중요] useEffect: 컴포넌트가 처음 켜질 때 '딱 한 번만' 실행됨
    useEffect(() => {
        getDashboardData()
            .then(data => {
                console.log("데이터 도착:", data);
                setDashboardData(data); // 데이터를 가져와서 저장
            })
            .catch(err => {
                console.error("데이터 로딩 실패");
            });
    }, []); // <- 이 빈 배열 []이 '한 번만 실행하라'는 뜻입니다.
    // [차트 데이터] 그래프에 그려질 좌표와 라벨들을 정의합니다.
    const chartData = {
        labels: dashboardData?.scoreHistory ? dashboardData.scoreHistory.map((_, i) => `${i + 1}회차`) : [],
        datasets: [
            {
                label: '보안 점수',
                data: dashboardData ? dashboardData.scoreHistory : [],
                borderColor: '#60a5fa', // 선 색상 (Accent Blue)
                backgroundColor: 'rgba(96, 165, 250, 0.2)', // 선 아래 색상
                tension: 0.4, // 선을 부드럽게 만드는 정도
                fill: true,
            },
        ],
    };

    // [차트 옵션] 그래프가 화면에서 어떻게 보일지 세밀하게 설정합니다.
    const chartOptions = {
        responsive: true, // 크기 자동 조절
        maintainAspectRatio: false, // CSS 높이에 맞춤
        plugins: {
            legend: { display: false }, // 범례(보안 점수 글자) 숨김
        },
        scales: {
            x: {
                ticks: { color: '#94a3b8' }, // X축 글자색 (밝은 회색)
                grid: { color: '#334155' }   // 그리드 라인색 (어두운 회색)
            },
            y: {
                beginAtZero: true,
                max: 100,
                ticks: { color: '#94a3b8' }, // Y축 글자색
                grid: { color: '#334155' }   // 그리드 라인색
            },
        },
    };

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'ShieldAlert': return <ShieldAlert className="text-warning" />;
            case 'CheckCircle2': return <CheckCircle2 className="text-success" />;
            case 'ArrowUpRight': return <ArrowUpRight size={18} />;
            default: return <CheckCircle2 className="text-muted" />;
        }
    };

    return (
        <div className="animate-fade-in">
            <h2 className="page-title">{userName}님, 안녕하세요!</h2>
            <p className="text-muted mb-4">오늘의 보안 리포트를 확인해보세요.</p>

            {/* 상단 레이아웃: 그래프 영역과 위험 상황 요약 */}
            <div className="row g-4 mb-4">
                <div className="col-lg-8">
                    <div className="dashboard-card">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="card-label mb-0">위험 점수 변화</h5>
                            <div className="d-flex align-items-center text-success fw-bold">
                                <span className="me-1">
                                    {dashboardData ? `${dashboardData.safetyScore}점 / ${dashboardData.safetyStatus}` : '로딩중...'}
                                </span>
                                <ArrowUpRight size={18} />
                            </div>
                        </div>
                        {/* 그래프 부품에 미리 정의한 데이터와 옵션을 넣어 화면에 그립니다. */}
                        <div className="chart-container">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="dashboard-card d-flex flex-column justify-content-center align-items-center text-center py-5">
                        <h5 className="card-label">위험 노출 현황</h5>
                        <div className="mb-3 p-4 rounded-circle bg-light">
                            <ShieldAlert size={48} className="text-warning" />
                        </div>
                        <p className="mb-3">현재 <strong>3건</strong>의 잠재적 위험이<br />감지되었습니다.</p>
                        <button className="btn btn-outline-primary btn-sm">자세히 보기 &gt;</button>
                    </div>
                </div>
            </div>

            {/* 하단 레이아웃: 3개의 요인 분석 카드 */}
            <h5 className="card-label mt-5 mb-3">취약 요인 분석 카드</h5>
            <div className="row g-4">
                {(dashboardData?.riskAnalysis && dashboardData.riskAnalysis.length > 0) ? (
                    dashboardData.riskAnalysis.map((item, idx) => {
                        // [NEW] 추천 텍스트로 원본 질문을 찾아 URL 가져오기
                        const originalQuestion = diagnosisQuestions.find(q => q.recommendation === item.label);
                        const linkUrl = originalQuestion ? originalQuestion.url : null;

                        return (
                            <div key={idx} className="col-md-4">
                                {/* [NEW] URL이 있으면 클릭 가능한 <a> 태그로, 없으면 div로 렌더링 */}
                                {linkUrl ? (
                                    <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-decoration-none" style={{ color: 'inherit' }}>
                                        <div className="dashboard-card text-center hover-up h-100 cursor-pointer">
                                            <div className="mb-2">{getIcon(item.iconType)}</div>
                                            <div className="fw-bold mb-1">{item.label}</div>
                                            <div className="small text-muted mb-2">{item.desc}</div>
                                            <span className={`status-badge ${item.status === '안전' || item.status === '양호' ? 'badge-safe' : 'badge-warning'}`}>
                                                {item.status}
                                            </span>
                                            <div className="mt-2 text-primary small">
                                                <ArrowUpRight size={14} className="me-1" />
                                                바로가기
                                            </div>
                                        </div>
                                    </a>
                                ) : (
                                    <div className="dashboard-card text-center hover-up h-100">
                                        <div className="mb-2">{getIcon(item.iconType)}</div>
                                        <div className="fw-bold mb-1">{item.label}</div>
                                        <div className="small text-muted mb-2">{item.desc}</div>
                                        <span className={`status-badge ${item.status === '안전' || item.status === '양호' ? 'badge-safe' : 'badge-warning'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="col-12">
                        <div className="dashboard-card text-center py-5">
                            <CheckCircle2 size={48} className="text-success mb-3" />
                            <h5>현재 발견된 취약점이 없습니다!</h5>
                            <p className="text-muted">완벽한 보안 상태를 유지하고 계시네요. 👏</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
