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
    );
};

export default Diagnosis;
