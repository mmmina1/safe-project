// ============================================================
// 1. 임포트 구역 (라이브러리 데이터 로드)
// ============================================================
import React from 'react';
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
} from 'chart.js';
import { ArrowUpRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

// 차트 엔진을 조립(동작 설정)하는 과정입니다.
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// ============================================================
// 2. 대시보드 화면 부품
// ============================================================
const Dashboard = () => {
    // [차트 데이터] 그래프에 그려질 좌표와 라벨들을 정의합니다.
    const chartData = {
        labels: ['5월', '6월', '7월', '8월', '9월', '10월'],
        datasets: [
            {
                label: '보안 점수',
                data: [65, 78, 72, 80, 82, 85], // 실제 데이터 값
                borderColor: '#1a237e', // 선 색상
                backgroundColor: 'rgba(26, 35, 126, 0.1)', // 선 아래 색상
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
            y: { beginAtZero: true, max: 100 }, // Y축은 0부터 100까지 표시
        },
    };

    return (
        <div className="animate-fade-in">
            <h2 className="page-title">홍길동님, 안녕하세요!</h2>
            <p className="text-muted mb-4">오늘의 보안 리포트를 확인해보세요.</p>

            {/* 상단 레이아웃: 그래프 영역과 위험 상황 요약 */}
            <div className="row g-4 mb-4">
                <div className="col-lg-8">
                    <div className="dashboard-card">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="card-label mb-0">위험 점수 변화</h5>
                            <div className="d-flex align-items-center text-success fw-bold">
                                <span className="me-1">85점 / 안전</span>
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
                {/* 배열 데이터를 돌면서 카드를 반복 생성합니다. */}
                {[
                    { label: '연령대', status: '안전', desc: '30대 평균보다 높음', icon: <CheckCircle2 className="text-success" /> },
                    { label: '직업군', status: '주의', desc: '전문직 대비 보수적', icon: <ShieldAlert className="text-warning" /> },
                    { label: '최근활동', status: '양호', desc: '심야시간 접속 패턴', icon: <CheckCircle2 className="text-success" /> },
                ].map((item, idx) => (
                    <div key={idx} className="col-md-4">
                        <div className="dashboard-card text-center hover-up">
                            <div className="mb-2">{item.icon}</div>
                            <div className="fw-bold mb-1">{item.label}</div>
                            <div className="small text-muted mb-2">{item.desc}</div>
                            {/* 상태에 따라 스타일(badge-safe, badge-warning)을 다르게 줍니다. */}
                            <span className={`status-badge ${item.status === '안전' || item.status === '양호' ? 'badge-safe' : 'badge-warning'}`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
