import { useState, useEffect, useCallback } from 'react';
import { useUnityContext } from "react-unity-webgl";

/**
 * useSimulator: 유니티 시뮬레이터의 상태 관리 및 통신 로직을 담당하는 커스텀 훅
 */
export const useSimulator = () => {
    // --- [상태 관리] ---
    const [receivedNumber, setReceivedNumber] = useState(0);

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
    });

    // --- [통신 로직] ---

    // 유니티 ➔ 리액트: 유니티에서 보낸 숫자를 수신하는 핸들러
    const handleNumberUpdate = useCallback((val) => {
        console.log("Unity로부터 수신된 숫자:", val);
        setReceivedNumber(val);
    }, []);

    // 이벤트 리스너 등록 및 해제
    useEffect(() => {
        // [수정] 유니티 .jslib에서 window.dispatchReactEvent를 호출하면 이 함수가 실행됩니다.
        window.dispatchReactEvent = (eventName, ...args) => {
            console.log(`Unity Event: ${eventName}`, args);
            if (eventName === "UpdateNumber") {
                // 첫 번째 인자가 유니티에서 보낸 숫자(val)입니다.
                handleNumberUpdate(args[0]);
            }
        };

        // 이 부분은 라이브러리의 표준 리스너이지만, 현재 .jslib 구조에서는 위 글로벌 함수가 핵심입니다.
        addEventListener("UpdateNumber", handleNumberUpdate);

        return () => {
            removeEventListener("UpdateNumber", handleNumberUpdate);
            delete window.dispatchReactEvent;
        };
    }, [addEventListener, removeEventListener, handleNumberUpdate]);

    // 리액트 ➔ 유니티: 리액트에서 유니티로 랜덤 숫자를 보냅니다.
    const sendRandomNumberToUnity = () => {
        const randomNum = Math.floor(Math.random() * 100);
        console.log("Unity로 보내는 숫자:", randomNum);

        // 유니티 프로젝트 사양: 오브젝트 "ReactReceiver", 함수 "SetNumber"
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
        sendRandomNumberToUnity
    };
};
