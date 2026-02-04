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
        simulationMessage,
        evaluationResult,
        isSimulating,
        startSimulation,
        evaluateAnswer,
        sendRandomNumberToUnity
    } = useSimulator();

    const [localInput, setLocalInput] = React.useState("");

    return (
        <div className="teller-station-container animate-fade-in">
            {/* 1. 배경용 사무실 분위기 (Ambient Background) */}
            <div className="station-ambient-bg"></div>

            <div className="teller-desk">
                {/* 2. 창구 유리창 영역 (The Window) */}
                <div className="teller-window-frame">
                    <div className="unity-viewport">
                        {/* 통신 테스트 UI (원래 있던 기능 복구) */}
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

                        {/* 로딩 중일 때 표시할 화면 (창구 앞에 가림막이 내려진 느낌) */}
                        {!isLoaded && (
                            <div className="window-shutter">
                                <Loader2 size={48} className="animate-spin mb-3 shutter-spinner" />
                                <h3>준비 중... {loadingPercentage}%</h3>
                                <div className="progress-minimal">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${loadingPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        <Unity
                            unityProvider={unityProvider}
                            style={{
                                width: "100%",
                                height: "100%",
                                visibility: isLoaded ? "visible" : "hidden",
                            }}
                        />
                    </div>
                    {/* 유리창 반사 효과 (Glass Overlay) */}
                    <div className="glass-reflection"></div>
                </div>

                {/* 3. 책상 위 업무 단말기 (The Terminal) */}
                <div className="desk-surface">
                    <div className="terminal-panel">
                        <div className="terminal-screen">
                            <div className="status-bar">
                                <span className="status-dot"></span>
                                <span className="status-text">
                                    {evaluationResult ? `EVALUATION COMPLETE - GRADE ${evaluationResult.evaluation_grade}` : 'TERMINAL ACTIVE - NODE_01'}
                                </span>
                            </div>
                            <div className="terminal-content">
                                {!isSimulating ? (
                                    <div className="terminal-welcome">
                                        <p className="text-cyan mb-2">대기 중... 시뮬레이션을 시작하십시오.</p>
                                        <button onClick={startSimulation} className="btn-terminal-action">
                                            시나리오 시작 (START_SIM)
                                        </button>
                                    </div>
                                ) : (
                                    <div className="terminal-active">
                                        <div className="info-section">
                                            <Info size={16} className="text-cyan" />
                                            <span>{simulationMessage}</span>
                                        </div>

                                        {!evaluationResult && (
                                            <div className="input-area mt-4">
                                                <input
                                                    type="text"
                                                    placeholder="당신의 대응을 입력하세요..."
                                                    className="terminal-input"
                                                    value={localInput}
                                                    onChange={(e) => setLocalInput(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            evaluateAnswer(localInput);
                                                            setLocalInput(""); // 제출 후 비우기
                                                        }
                                                    }}
                                                />
                                                <p className="text-xs text-slate-500 mt-2">Enter를 눌러 평가 요청</p>
                                            </div>
                                        )}

                                        {evaluationResult && (
                                            <div className="result-area animate-fade-in mt-2">
                                                <div className="score-badge">SCORE: {evaluationResult.score}</div>
                                                <p className="expert-comment mt-2">"{evaluationResult.expert_comment}"</p>
                                                <div className="improvement-tip mt-2">💡 {evaluationResult.improvement_tip}</div>
                                                <button onClick={startSimulation} className="btn-terminal-action mt-4">
                                                    다음 시나리오 (NEXT)
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 4. 업무 지침서 (Manual/Ledger) */}
                    <div className="desk-ledger">
                        <h4><Info size={18} /> 업무 지침 (Standard Operating Procedure)</h4>
                        <ul>
                            <li>의심스러운 상황 발생 시 단말기 신호를 즉시 확인하십시오.</li>
                            <li>실제 사례 기반으로 구성된 시뮬레이션입니다.</li>
                            <li>채점 기준: 가이드라인 이행 여부 ({evaluationResult?.matched_steps?.length || 0}개 항목 이행됨)</li>
                        </ul>
                    </div>
                </div>
            </div>

            <p className="system-footer">* SECURE SESSION ACTIVE | AUTH_LVL: TELLER_GRADE_A</p>
        </div>
    );
};

export default Simulator;
