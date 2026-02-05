import React, { useState } from 'react';
import { phishService } from '../api';

// 기본 설문 질문 데이터
const defaultSurvey = {
    currentStep: 0,
    userAnswers: [],
    questions: [
        {
            id: 'q1',
            text: '의심스러운 전화나 메시지를 받은 적이 있나요?',
            options: ['예', '아니오'],
            weights: [1, 0]
        },
        {
            id: 'q2',
            text: '금융 정보를 요구하는 요청을 받은 적이 있나요?',
            options: ['예', '아니오'],
            weights: [1, 0]
        },
        {
            id: 'q3',
            text: '긴급한 상황이라고 하며 서두르라고 한 적이 있나요?',
            options: ['예', '아니오'],
            weights: [1, 0]
        }
    ]
};

const Diagnosis = () => {
    const [survey, setSurvey] = useState(defaultSurvey);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const currentQuestion = survey.questions[survey.currentStep];
    const progress = ((survey.currentStep + 1) / survey.questions.length) * 100;

    const addAnswer = (answerObj) => {
        setSurvey(prev => ({
            ...prev,
            userAnswers: [...prev.userAnswers, answerObj],
            currentStep: prev.currentStep + 1
        }));
    };

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
                    <h2>진단 결과를 분석 중입니다...</h2>
                </div>
            </section>
        );
    }

    if (result) {
        return (
            <section className="animate-fade" style={{ display: 'block', padding: '40px 20px' }}>
                <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '30px' }}>
                    <h2 style={{ marginBottom: '20px' }}>진단 결과</h2>
                    <div style={{ marginBottom: '15px' }}>
                        <strong>위험도:</strong> {result.risk_level || 'N/A'}
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <strong>점수:</strong> {result.score || 0}
                    </div>
                    {result.summary && (
                        <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
                            <strong>요약:</strong>
                            <p style={{ marginTop: '10px', marginBottom: 0 }}>{result.summary}</p>
                        </div>
                    )}
                    <button 
                        onClick={() => {
                            setResult(null);
                            setSurvey(defaultSurvey);
                        }}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        다시 진단하기
                    </button>
                </div>
            </section>
        );
    }

    if (!currentQuestion) {
        return (
            <section className="animate-fade" style={{ display: 'block', textAlign: 'center', paddingTop: '100px' }}>
                <div className="card">
                    <h2>진단이 완료되었습니다.</h2>
                </div>
            </section>
        );
    }

    return (
        <section id="diagnosis" className="animate-fade" style={{ display: 'block', padding: '40px 20px' }}>
            <div className="survey-box card" style={{ maxWidth: '800px', margin: '0 auto', padding: '30px' }}>
                <div className="progress-bar" style={{ height: '6px', background: '#e9ecef', borderRadius: '3px', marginBottom: '40px', overflow: 'hidden' }}>
                    <div className="progress-fill" style={{ width: `${progress}%`, height: '100%', background: '#007bff', transition: '0.5s' }}></div>
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
                                    background: '#f8f9fa',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: '0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = '#e9ecef';
                                    e.target.style.borderColor = '#007bff';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = '#f8f9fa';
                                    e.target.style.borderColor = '#dee2e6';
                                }}
                            >
                                {opt}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Diagnosis;
