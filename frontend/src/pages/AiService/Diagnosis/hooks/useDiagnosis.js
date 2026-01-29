import { useState, useEffect } from 'react';
import { phishService } from '../../api';

/**
 * useDiagnosis: 진단 설문 로직을 담당하는 커스텀 훅
 * - 설문 데이터 관리
 * - 답변 저장 및 진행 단계 관리
 * - 서버 통신 및 결과 반환
 */
export const useDiagnosis = () => {
    // --- [설문 설정 데이터] ---
    // 주의: 실제 환경에서는 서버에서 가져오거나 별도의 데이터 파일로 관리하는 것이 좋습니다.
    const questions = [
        {
            id: "Q1",
            text: "모르는 번호로 온 문자 메시지의 링크(URL)를 눌러본 적이 있나요?",
            options: ["전혀 없다", "한두 번 있다", "자주 있다"],
            weights: ["no", "often", "yes"] // 백엔드 로직에 맞춘 가중치 값
        },
        {
            id: "Q2",
            text: "공공기관이나 은행을 사칭한 전화를 받았을 때, 앱 설치를 요구받은 적이 있나요?",
            options: ["없다", "있다 (설치는 안 함)", "있다 (설치함)"],
            weights: ["no", "often", "yes"]
        },
        {
            id: "Q3",
            text: "비밀번호를 모든 사이트에서 동일하게 사용하시나요?",
            options: ["전부 다르게 쓴다", "일부 비슷하게 쓴다", "모두 동일하게 쓴다"],
            weights: ["no", "often", "yes"]
        },
        {
            id: "Q4",
            text: "출처가 불분명한 파일(.apk, .exe)을 다운로드한 경험이 있나요?",
            options: ["절대 없다", "실수로 한 번 있다", "필요해서 가끔 한다"],
            weights: ["no", "often", "yes"]
        }
    ];

    // --- [상태 관리] ---
    const [currentStep, setCurrentStep] = useState(0); // 현재 질문 번호 (0부터 시작)
    const [userAnswers, setUserAnswers] = useState([]); // 사용자가 선택한 답변들
    const [isLoading, setIsLoading] = useState(false); // 서버 통신 중인지 확인
    const [result, setResult] = useState(null); // 서버에서 받은 최종 결과

    // --- [계산 로직] ---
    const currentQuestion = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    // --- [이벤트 핸들러] ---
    const handleAnswer = async (value) => {
        const answerObj = { question_key: currentQuestion.id, answer: value };
        const newAnswers = [...userAnswers, answerObj];

        if (currentStep + 1 < questions.length) {
            // 다음 질문이 있는 경우
            setUserAnswers(newAnswers);
            setCurrentStep(currentStep + 1);
        } else {
            // 마지막 질문인 경우 서버로 전송
            setIsLoading(true);
            try {
                const res = await phishService.submitDiagnosis(newAnswers);
                setResult(res);
            } catch (error) {
                console.error("Diagnosis Error:", error);
                setResult({
                    score: 0,
                    risk_level: 'ERROR',
                    summary: '데이터 분석 중 오류가 발생했습니다. 다시 시도해 주세요.'
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
        resetDiagnosis
    };
};
