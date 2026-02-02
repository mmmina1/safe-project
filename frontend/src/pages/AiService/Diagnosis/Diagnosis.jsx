<<<<<<< HEAD
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { phishService } from '../api';

const Diagnosis = () => {
    const { survey, addAnswer, setResult, setSection } = useAppStore();
    const [loading, setLoading] = useState(false);

    const currentQuestion = survey.questions[survey.currentStep];
    const progress = ((survey.currentStep + 1) / survey.questions.length) * 100;

    const handleAnswer = async (value) => {
        const answerObj = { question_key: currentQuestion.id, answer: value };

        if (survey.currentStep + 1 < survey.questions.length) {
            addAnswer(answerObj);
        } else {
            // Final Question
            setLoading(true);
            try {
                // We need to commit the last answer before submitting
                const finalAnswers = [...survey.userAnswers, answerObj];
                const res = await phishService.submitDiagnosis(finalAnswers);
                setResult(res);
            } catch (error) {
                setResult({ score: 0, risk_level: 'ERROR', summary: 'API 통신 실패' });
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return (
            <section className="animate-fade" style={{ display: 'block', textAlign: 'center', paddingTop: '100px' }}>
                <div className="card">
                    <h2>🔍 진단 결과를 분석 중입니다...</h2>
                </div>
            </section>
        );
    }

    return (
        <section id="diagnosis" className="animate-fade" style={{ display: 'block' }}>
            <div className="survey-box card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="progress-bar" style={{ height: '6px', background: 'var(--glass)', borderRadius: '3px', marginBottom: '40px', overflow: 'hidden' }}>
                    <div className="progress-fill" style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', transition: '0.5s' }}></div>
                </div>

                <div className="question-card">
                    <h2 style={{ marginBottom: '30px' }}>Q{survey.currentStep + 1}. {currentQuestion.text}</h2>
                    <div className="option-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {currentQuestion.options.map((opt, idx) => (
                            <div
                                key={idx}
                                className="option-item"
                                onClick={() => handleAnswer(currentQuestion.weights[idx])}
                                style={{
                                    padding: '20px',
                                    background: 'var(--glass)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    cursor: 'pointer'
                                }}
                            >
                                {opt}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .option-item:hover {
                    background: var(--glass-heavy);
                    border-color: var(--primary-light);
                    transition: 0.2s;
                }
            `}</style>
        </section>
=======
// ============================================================
// 1. 임포트 구역
// ============================================================
import React from 'react';
import { useDiagnosis } from './hooks/useDiagnosis'; // 방금 만든 로직 뭉치(Hook)를 가져옵니다.
import { ChevronRight, RefreshCw, ShieldCheck, AlertTriangle } from 'lucide-react';
import './Diagnosis.css'; // 전용 디자인 파일을 연결합니다.

// ============================================================
// 2. 진단 서비스 메인 화면 컴포넌트
// ============================================================
const Diagnosis = () => {
    // [리액트 기초] Hook 사용: 복잡한 로직은 잊어버리고, 필요한 데이터와 함수만 쏙쏙 뽑아 씁니다.
    const {
        currentStep,
        currentQuestion,
        progress,
        isLoading,
        result,
        handleAnswer,
        resetDiagnosis
    } = useDiagnosis();

    /* ------------------------------------------------------------
       A. 로딩 중 화면 (서버가 분석 중일 때)
    ------------------------------------------------------------ */
    if (isLoading) {
        return (
            <div className="diagnosis-container">
                <div className="diagnosis-card loading-box">
                    <div className="loading-icon">🔍</div>
                    <h3 className="fw-bold mb-3">보안 상태를 정밀 분석 중입니다...</h3>
                    <p className="text-muted">잠시만 기다려 주세요. 금방 완료됩니다!</p>
                </div>
            </div>
        );
    }

    /* ------------------------------------------------------------
       B. 결과 리포트 화면 (모든 답을 마치고 결과가 나왔을 때)
    ------------------------------------------------------------ */
    if (result) {
        return (
            <div className="diagnosis-container">
                <div className="diagnosis-card animate-fade-in">
                    <div className="result-header">
                        <div className="result-score">{result.score}점</div>
                        <div className={`result-badge badge-${result.risk_level?.toLowerCase()}`}>
                            {result.risk_level === 'SAFE' ? '위험도 낮음 (안전)' :
                                result.risk_level === 'CAUTION' ? '위험도 보통 (주의)' : '위험도 높음 (경고)'}
                        </div>
                    </div>

                    <div className="p-4 bg-light rounded-4 mb-4">
                        <h5 className="fw-bold mb-3 d-flex align-items-center">
                            <ShieldCheck size={20} className="me-2 text-primary" />
                            보안 정밀 분석 결과
                        </h5>
                        <p className="mb-0 text-dark leading-relaxed">{result.summary}</p>
                    </div>

                    <button
                        className="btn btn-primary w-100 py-3 rounded-3 fw-bold d-flex align-items-center justify-content-center"
                        onClick={resetDiagnosis}
                    >
                        <RefreshCw size={18} className="me-2" /> 새 진단 시작하기
                    </button>
                    <p className="text-center mt-3 small text-muted">마이페이지 &gt; 진단 센터에서 상세 리포트를 확인하실 수 있습니다.</p>
                </div>
            </div>
        );
    }

    /* ------------------------------------------------------------
       C. 기본 설문 진행 화면
    ------------------------------------------------------------ */
    return (
        <div className="diagnosis-container">
            <div className="diagnosis-card animate-fade-in">
                {/* 상단 진행률 바 */}
                <div className="diagnosis-progress-container">
                    <div
                        className="diagnosis-progress-fill"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* 질문 영역 */}
                <div className="question-section">
                    <div className="text-primary small fw-bold mb-2">질문 {currentStep + 1}</div>
                    <h2 className="question-title">{currentQuestion.text}</h2>

                    {/* 선택지 목록 */}
                    <div className="option-group">
                        {currentQuestion.options.map((opt, idx) => (
                            <button
                                key={idx}
                                className="option-button border-0 shadow-none"
                                onClick={() => handleAnswer(idx)}
                            >
                                <span>{opt}</span>
                                <ChevronRight size={18} className="text-muted" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* 하단 도움말 */}
                <div className="mt-5 pt-4 border-top d-flex align-items-start text-muted small">
                    <AlertTriangle size={16} className="me-2 mt-1 flex-shrink-0" />
                    <p className="mb-0">답변하신 내용은 보안 분석 용도로만 활용되며, 외부로 유출되지 않으니 안심하고 답변해 주세요.</p>
                </div>
            </div>
        </div>
>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534
    );
};

export default Diagnosis;
