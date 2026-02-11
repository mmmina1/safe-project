import React from 'react';
import { useDiagnosis } from './hooks/useDiagnosis';
import { ShieldAlert, CheckCircle, Info } from 'lucide-react';
import './Diagnosis.css';

const Diagnosis = () => {
    const {
        currentStep,
        currentQuestion,
        progress,
        isLoading,
        result,
        handleAnswer,
        resetDiagnosis,
        totalQuestions // [NEW] 전체 문항 수 추가
    } = useDiagnosis();

    // 로딩 중일 때 표시할 화면
    if (isLoading) {
        return (
            <div className="diagnosis-container">
                <div className="diagnosis-card loading-box">
                    <div className="loading-icon">🔍</div>
                    <h3>진단 결과를 분석 중입니다...</h3>
                    <p>잠시만 기다려주세요.</p>
                </div>
            </div>
        );
    }

    // 결과 화면
    if (result) {
        const getBadgeClass = () => {
            if (result.risk_level === 'DANGER') return 'badge-danger';
            if (result.risk_level === 'CAUTION') return 'badge-caution';
            return 'badge-safe';
        };

        const getBadgeIcon = () => {
            if (result.risk_level === 'DANGER') return <ShieldAlert size={20} />;
            if (result.risk_level === 'CAUTION') return <Info size={20} />;
            return <CheckCircle size={20} />;
        };

        return (
            <div className="diagnosis-container animate-fade-in">
                <div className="diagnosis-card text-center">
                    <div className="result-header">
                        <span className={`result-badge ${getBadgeClass()} d-inline-flex align-items-center gap-2 mb-3`}>
                            {getBadgeIcon()} {result.risk_level}
                        </span>
                        <div className="result-score">{result.score}점</div>
                        <h4 className="mt-3">종합 진단 결과</h4>
                    </div>
                    <div className="result-body py-4 px-3 bg-light rounded-4 mb-4 text-start">
                        <div className="mb-4">
                            <h5 className="fw-bold text-dark mb-2">🔍 AI 종합 진단 총평</h5>
                            <p className="mb-0 text-secondary" style={{ lineHeight: '1.7' }}>
                                {result.summary}
                            </p>
                        </div>

                        {result.top3Types && result.top3Types.length > 0 && (
                            <div className="mb-4">
                                <h5 className="fw-bold text-danger mb-2">⚠ 주의가 필요한 범죄 유형</h5>
                                <div className="d-flex flex-wrap gap-2">
                                    {result.top3Types.map((type, idx) => (
                                        <span key={idx} className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 rounded-pill">
                                            {type}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.recommendations && result.recommendations.length > 0 && (
                            <div>
                                <h5 className="fw-bold text-primary mb-2">🛡️ 맞춤형 보안 처방전</h5>
                                <ul className="list-unstyled mb-0">
                                    {result.recommendations.map((rec, idx) => (
                                        <li key={idx} className="d-flex align-items-start gap-2 mb-2 text-secondary">
                                            <CheckCircle size={16} className="text-primary mt-1 flex-shrink-0" />
                                            <span>{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <button onClick={resetDiagnosis} className="btn btn-primary btn-lg w-100 rounded-pill py-3">
                        다시 진단하기
                    </button>
                </div>
            </div>
        );
    }

    // 설문 화면
    return (
        <div className="diagnosis-container animate-fade-in">
            <div className="diagnosis-card">
                {/* 상단 진행도 */}
                <div className="diagnosis-progress-container">
                    <div
                        className="diagnosis-progress-fill"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="question-area">
                    <span className="text-primary fw-bold mb-2 d-block">질문 {currentStep + 1} / {totalQuestions}</span>
                    <h2 className="question-title">{currentQuestion.text}</h2>

                    <div className="option-group">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                className="option-button"
                                onClick={() => handleAnswer(index)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Diagnosis;
