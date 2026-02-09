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
            // 마지막 질문인 경우: 서버 통신(AI) 대신 로컬에서 점수 기반으로 결과 생성
            setIsLoading(true);

            // AI 분석을 흉내내기 위한 약간의 지연 시간 (0.8초)
            setTimeout(() => {
                // 100점 만점으로 환산 (총점 / 문항수 * 100)
                // 예: 10문제 중 8점 -> 80점
                const finalRawScore = newTotalScore;
                const finalScore = Math.round((finalRawScore / questions.length) * 100);

                let riskLevel = 'SAFE';
                let summary = "";

                // 점수 기반 위험도 판정 로직 (높을수록 안전!)
                if (finalScore >= 80) {
                    riskLevel = 'SAFE';
                    summary = "보안 상태가 매우 양호합니다! 평소 보안 수칙을 잘 지키고 계시네요. 앞으로도 출처 불분명한 링크는 클릭하지 마시고, 정기적으로 백신 검사를 수행하여 안전한 디지털 환경을 유지하시기 바랍니다.";
                } else if (finalScore >= 50) {
                    riskLevel = 'CAUTION';
                    summary = "주의가 필요한 단계입니다. 보안 수칙을 어느 정도 알고 계시지만, 일부 취약한 부분이 발견되었습니다. 어카운트인포를 통해 내 계좌 현황을 점검하고, 최신 피싱 수법에 대해 조금 더 관심을 가지실 것을 권장합니다.";
                } else {
                    riskLevel = 'DANGER';
                    summary = "위험 수준이 매우 높습니다! 현재 다양한 보이스피싱 위협에 노출되어 있을 가능성이 큽니다. 즉시 엠세이퍼를 통해 명의도용 여부를 확인하고, 출처가 불분명한 앱은 모두 삭제하십시오. 필요시 금융기관에 계좌 지급정지를 요청하세요.";
                }

                setResult({
                    score: finalScore,
                    risk_level: riskLevel,
                    summary: summary
                });

                // [NEW] 추천 항목 수집 (틀린 문제만)
                const recommendations = newAnswers
                    .filter(ans => ans.score < 1)
                    .map(ans => {
                        const originalQuestion = questions.find(q => q.id === ans.question_key);
                        return originalQuestion ? originalQuestion.recommendation : null;
                    })
                    .filter(rec => rec !== null);

                // [DEBUG] 데이터 흐름 확인용 로그
                console.log("=== [진단 완료] 서버로 전송할 데이터 ===");
                console.log("1. 총점:", finalScore);
                console.log("2. 답안 목록:", newAnswers);
                console.log("3. 추천 처방전:", recommendations);
                console.log("======================================");

                // [NEW] 서버로 결과 전송 (로그인한 사용자만)
                const token = localStorage.getItem('accessToken');
                if (token) {
                    phishService.submitDiagnosis(finalScore, newAnswers, recommendations)
                        .then(res => console.log("✅ 진단 결과 저장 성공:", res))
                        .catch(err => console.error("❌ 진단 결과 저장 실패:", err));
                } else {
                    console.log("ℹ️ 게스트 사용자: 결과 저장 건너뜀 (로컬 확인용)");
                }

                setIsLoading(false);
            }, 800);
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
