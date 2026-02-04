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

    // 유니티가 로드된 후 키보드 캡처를 비활성화하는 강제 코드 주입
    useEffect(() => {
        if (isLoaded && window.unityInstance) {
            // 유니티 내부에서 키보드 이벤트를 브라우저로 흘려보내도록 설정
            // 이 설정이 활성화되어야 React Input 태그가 정상 작동함
            try {
                window.unityInstance.Module.canvas.addEventListener('keydown', (e) => {
                    e.stopPropagation();
                }, true);
            } catch (e) {
                console.warn("Unity keyboard capture override failed:", e);
            }
        }
    }, [isLoaded]);

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
