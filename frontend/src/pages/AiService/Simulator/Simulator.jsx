// ============================================================
// 1. 임포트 구역
// ============================================================
import React from 'react';
import { Info, Loader2 } from 'lucide-react';
import { Unity } from "react-unity-webgl";
import { useSimulator } from './hooks/useSimulator';
import './Simulator.css'; // 전용 디자인 파일을 연결합니다.

// ============================================================
// 2. 시뮬레이터 컴포넌트
// ============================================================
const Simulator = () => {
    // 모든 유니티 로직은 커스텀 훅(`useSimulator`)에서 관리합니다.
    const {
        unityProvider,
        isLoaded,
        loadingPercentage,
        receivedNumber,
        sendRandomNumberToUnity
    } = useSimulator();

    return (
        <div className="simulator-container animate-fade-in">
            <div className="simulator-card">
                {/* A. 상단 제목 영역 */}
                <div className="simulator-header">
                    <h2>실전 모의 훈련 시뮬레이터</h2>
                    <p>실제 보이스피싱 상황을 가상 환경에서 안전하게 체험하고 대응법을 익히세요.</p>
                </div>

                {/* B. 유니티 WebGL 플레이어 영역 */}
                <div className="unity-container">
                    {/* 통신 테스트 UI (유니티 로드 완료 시에만 표시) */}
                    {isLoaded && (
                        <div className="unity-comm-test">
                            <div className="comm-box">
                                <span>수신된 숫자: <strong>{receivedNumber}</strong></span>
                                <button onClick={sendRandomNumberToUnity} className="btn-send">
                                    유니티로 랜덤 숫자 전송
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 로딩 중일 때 표시할 화면 */}
                    {!isLoaded && (
                        <div className="unity-mock-ui">
                            <Loader2 size={48} className="animate-spin text-primary mb-3" />
                            <h3>시뮬레이션 로딩 중... {loadingPercentage}%</h3>
                            <div className="progress w-50 mx-auto mt-3" style={{ height: '10px', background: 'rgba(255,255,255,0.1)' }}>
                                <div
                                    className="progress-bar progress-bar-striped progress-bar-animated"
                                    role="progressbar"
                                    style={{ width: `${loadingPercentage}%`, background: '#3949ab' }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* 실제 유니티 화면 */}
                    <Unity
                        unityProvider={unityProvider}
                        style={{
                            width: "100%",
                            height: "100%",
                            visibility: isLoaded ? "visible" : "hidden",
                            borderRadius: '20px'
                        }}
                    />
                </div>

                {/* C. 하단 도움말 영역 */}
                <div className="simulator-info text-start">
                    <span><Info size={16} className="me-2 inline-block" /> 시뮬레이터 이용 안내</span>
                    <ul className="mb-0 ps-3">
                        <li>이 시뮬레이션은 실제 발생했던 보이스피싱 사례를 바탕으로 재구성되었습니다.</li>
                        <li>훈련 중 발생하는 상황에 따라 적절한 대응 버튼을 눌러보세요.</li>
                        <li>결과에 따라 맞춤형 보안 가이드를 제공해 드립니다.</li>
                    </ul>
                </div>

                <p className="mt-4 text-muted small">
                    * 최적의 경험을 위해 데스크톱 환경과 크롬 브라우저 사용을 권장합니다.
                </p>
            </div>
        </div>
    );
};

export default Simulator;
