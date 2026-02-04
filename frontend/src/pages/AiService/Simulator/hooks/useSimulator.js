import { useState, useEffect, useCallback } from 'react';
import { useUnityContext } from "react-unity-webgl";

/**
 * useSimulator: 유니티 시뮬레이터의 상태 관리 및 통신 로직을 담당하는 커스텀 훅
 */
export const useSimulator = () => {
    // --- [상태 관리] ---
    const [receivedNumber, setReceivedNumber] = useState(0);
    const [simulationMessage, setSimulationMessage] = useState("");
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [isSimulating, setIsSimulating] = useState(false);

    // 유니티 컨텍스트 설정: public/unity-sim/uni 폴더의 빌드 파일들을 연결합니다.
    const {
        unityProvider,
        isLoaded,
        loadingProgression,
        sendMessage,
        addEventListener,
        removeEventListener
    } = useUnityContext({
        loaderUrl: "/unity-sim/uni/Build/02.loader.js",
        dataUrl: "/unity-sim/uni/Build/02.data.br",
        frameworkUrl: "/unity-sim/uni/Build/02.framework.js.br",
        codeUrl: "/unity-sim/uni/Build/02.wasm.br",
        // 유니티가 키보드 입력을 독점하지 않도록 설정 (입력창 뻑뻑함 해결의 핵심!)
        // https://react-unity-webgl.dev/docs/usage/unity-config
        webglContextAttributes: {
            preserveDrawingBuffer: true,
        },
        devicePixelRatio: window.devicePixelRatio,
    });

    // 유니티 키보드 입력 독점 해제 (가장 강력한 방법)
    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            // 현재 어떤 입력창(INPUT, TEXTAREA)에 포커스가 있다면
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                // 이 이벤트가 유니티(Canvas)로 전달되는 것을 방지
                e.stopPropagation();
            }
        };

        // 'true'를 사용하여 캡처 단계에서 미리 낚아챕니다.
        window.addEventListener('keydown', handleGlobalKeyDown, true);
        window.addEventListener('keyup', handleGlobalKeyDown, true);
        window.addEventListener('keypress', handleGlobalKeyDown, true);

        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown, true);
            window.removeEventListener('keyup', handleGlobalKeyDown, true);
            window.removeEventListener('keypress', handleGlobalKeyDown, true);
        };
    }, []);

    // --- [서버 통신 로직] ---

    // 1~4번 흐름: 시나리오 시작 (랜덤 변수 발생 및 서버 송신)
    const startSimulation = async () => {
        const types = ["A", "B", "C", "D"];
        const randomType = types[Math.floor(Math.random() * types.length)];
        setIsSimulating(true);
        setSimulationMessage("분석 중...");
        setEvaluationResult(null);

        try {
            const response = await fetch(`http://localhost:8080/api/ai/simulator/start?scenarioType=${randomType}`);
            const result = await response.json();
            const aiDialogue = result.data.answer;

            setSimulationMessage(aiDialogue);

            // 유니티로 AI 대사 전달 (말풍선 띄우기 등)
            if (isLoaded) {
                sendMessage("ReactReceiver", "ShowDialogue", aiDialogue);
            }
        } catch (error) {
            console.error("시나리오 시작 실패:", error);
            setSimulationMessage("시뮬레이션 서버 연결에 실패했습니다.");
        }
    };

    // 17~22번 흐름: 사용자 답변 평가
    const evaluateAnswer = async (playerAnswer) => {
        if (!simulationMessage) return;

        try {
            const response = await fetch(`http://localhost:8080/api/ai/simulator/evaluate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    situation: simulationMessage,
                    player_answer: playerAnswer
                })
            });
            const result = await response.json();
            setEvaluationResult(result.data);

            // 결과에 따른 유니티 연출 유도 (점수 전달 등)
            if (isLoaded) {
                sendMessage("ReactReceiver", "SetScore", result.data.score);
            }
        } catch (error) {
            console.error("평가 실패:", error);
        }
    };

    // --- [유니티 통신 로직] ---

    // 유니티 ➔ 리액트: 유니티에서 보낸 숫자를 수신하는 핸들러
    const handleNumberUpdate = useCallback((val) => {
        console.log("Unity로부터 수신된 숫자:", val);
        setReceivedNumber(val);
        // 특정 숫자가 오면 게임 시작 트리거로 쓸 수 있음 (예: 777)
        if (val === 777) startSimulation();
    }, [isLoaded]);

    // 이벤트 리스너 등록 및 해제
    useEffect(() => {
        // [수정] 유니티 .jslib에서 window.dispatchReactEvent를 호출하면 이 함수가 실행됩니다.
        window.dispatchReactEvent = (eventName, ...args) => {
            console.log(`Unity Event: ${eventName}`, args);
            if (eventName === "UpdateNumber") {
                handleNumberUpdate(args[0]);
            } else if (eventName === "PlayerSpeak") {
                // 유니티에서 플레이어가 정답을 선택했을 때 호출됨
                evaluateAnswer(args[0]);
            }
        };

        addEventListener("UpdateNumber", handleNumberUpdate);

        return () => {
            removeEventListener("UpdateNumber", handleNumberUpdate);
            delete window.dispatchReactEvent;
        };
    }, [addEventListener, removeEventListener, handleNumberUpdate, simulationMessage]);

    // 리액트 ➔ 유니티: 리액트에서 유니티로 랜덤 숫자를 보냅니다.
    const sendRandomNumberToUnity = () => {
        const randomNum = Math.floor(Math.random() * 100);
        sendMessage("ReactReceiver", "SetNumber", randomNum);
    };

    // 로딩 퍼센트 계산 (0 ~ 100)
    const loadingPercentage = Math.round(loadingProgression * 100);

    // --- [외부 노출 데이터 및 함수] ---
    return {
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
    };
};
