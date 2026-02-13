import { useState, useEffect } from 'react';
import { phishService } from '../../../../api/aiServiceApi';
import { diagnosisQuestions as questions } from '../data/diagnosisQuestions';

/**
 * useDiagnosis: 진단 설문 로직을 담당하는 커스텀 훅
 * - 설문 데이터 관리 (외부 diagnosisQuestions 참조)
 * - 답변 저장 및 진행 단계 관리
 * - 점수 기반 결과 반환
 */
export const useDiagnosis = () => {
    // --- [상태 관리] ---
    const [currentStep, setCurrentStep] = useState(0); // 현재 질문 번호 (0부터 시작)
    const [userAnswers, setUserAnswers] = useState([]); // 사용자가 선택한 답변들
    const [totalScore, setTotalScore] = useState(0); // 합산 점수
    const [isLoading, setIsLoading] = useState(false); // 서버 통신 중인지 확인
    const [result, setResult] = useState(null); // 서버에서 받은 최종 결과

    // --- [계산 로직] ---
    const currentQuestion = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    // --- [이벤트 핸들러] ---
    const handleAnswer = async (scoreIndex) => {
        // scoreIndex는 선택한 옵션의 인덱스 (0, 1, 2)
        const score = currentQuestion.scores[scoreIndex];
        const answerText = currentQuestion.options[scoreIndex];

        const answerObj = {
            question_key: currentQuestion.id,
            question_text: currentQuestion.text,
            answer_text: answerText,
            answer_value: answerText, // 텍스트 자체를 값으로 저장
            score: score
        };

        const newAnswers = [...userAnswers, answerObj];
        const newTotalScore = totalScore + score;

        if (currentStep + 1 < questions.length) {
            // 다음 질문이 있는 경우
            setUserAnswers(newAnswers);
            setTotalScore(newTotalScore);
            setCurrentStep(currentStep + 1);
        } else {
            // 마지막 질문인 경우: 서버 통신(AI) 시작
            setIsLoading(true);

            // 서버로 전송할 데이터 준비 (백엔드 DTO 규격에 맞춤)
            // AI 분석을 위해 텍스트 정보도 함께 보냅니다 (DB에는 저장되지 않음)
            const submitData = newAnswers.map(ans => ({
                question_key: ans.question_key,
                question_text: ans.question_text,
                answer_text: ans.answer_text,
                answer_value: ans.answer_value
            }));

            try {
                // 100점 만점으로 환산 (프론트에서도 일단 계산해서 보냄)
                const finalScore = Math.round((newTotalScore / questions.length) * 100);

                // 서버 API 호출 (AI 분석 + DB 저장 수행)
                const response = await phishService.submitDiagnosis(finalScore, submitData);

                // [변경] 서버에서 받은 진짜 AI 분석 결과를 상태에 저장
                // response 구조: { aiComment, top3Types, recommendations }
                setResult({
                    score: finalScore,
                    risk_level: finalScore >= 80 ? 'SAFE' : (finalScore >= 50 ? 'CAUTION' : 'DANGER'),
                    summary: response.aiComment, // AI의 총평
                    top3Types: response.top3Types, // TOP3 위험 유형
                    recommendations: response.recommendations // 맞춤 권장사항
                });

                console.log("✅ AI 진단 분석 성공:", response);
            } catch (error) {
                console.error("❌ AI 진단 분석 실패:", error);
                // 에러 피드백을 위한 기본 결과 설정
                setResult({
                    score: Math.round((newTotalScore / questions.length) * 100),
                    risk_level: 'ERROR',
                    summary: "AI 분석 서버와 통신하는 중 문제가 발생했습니다. 결과를 저장하지 못했습니다."
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    // 진단 다시 시작하기
    const resetDiagnosis = () => {
        setCurrentStep(0);
        setUserAnswers([]);
        setTotalScore(0);
        setResult(null);
        setIsLoading(false);
    };

    return {
        questions,
        currentStep,
        currentQuestion,
        progress,
        isLoading,
        result,
        handleAnswer,
        resetDiagnosis,
        totalQuestions: questions.length // [NEW] 전체 문항 수 반환
    };
};
