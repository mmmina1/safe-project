# 🎮 시뮬레이션 제작 가이드 (Full-Stack)

우리 프로젝트에서 새로운 시뮬레이션 시나리오(예: 로맨스 스캠, 택배 스미싱 등)를 추가하거나 수정하기 위한 종합 가이드입니다.

---

## 1. AI 백엔드 설정 (Python)

AI의 성격과 대사 스타일을 결정하는 단계입니다.

### A. AI 프롬프트 등록
- **파일**: `backend-python/py/backend/app/core/ai/config.py`
- `AI_CONFIG` 딕셔너리에 새로운 기능 키(예: `simulation_romance`)를 추가하고, `system_prompt`와 `basic_prompt`를 작성합니다.
- **팁**: `system_prompt`에 AI가 연기해야 할 구체적인 상황과 절대 하지 말아야 할 행동을 명시하세요.

### B. 시나리오 타입 매핑
- **파일**: `backend-python/py/backend/app/features/a_data/sim/sources.py`
- `get_scenario_start` 함수 내의 `mapping` 변수에 새로운 타입(예: "E")을 추가하고, 방금 만든 `AI_CONFIG` 키와 연동할 DB(ChromaDB collection)를 지정합니다.

---

## 2. 유니티 연출 설정 (Unity)

AI의 대사에 맞춰 캐릭터가 어떻게 움직일지 결정하는 단계입니다.

### A. 감정 타입 추가
- **파일**: `Assets/Scripts/Domain/Entity/SimulationEntity.cs`
- `EmotionType` 열거형(Enum)에 새로운 감정(예: `Suspicious`, `InLove`)을 추가합니다.

### B. 애니메이션 트리거 연결
- **파일**: `Assets/Scripts/Presentation/View/SimulationView.cs`
- `Render` 함수 내의 `npcAnimator.SetInteger("EmotionIdx", ...)` 부분에 새로운 감정이 애니메이터의 어떤 파라미터와 매칭되는지 코드로 작성합니다.

---

## 3. 프론트엔드 연결 (React)

사용자가 새 시나리오를 시작할 수 있게 버튼을 만들거나 로직을 업데이트합니다.

### A. 시뮬레이터 훅 업데이트
- **파일**: `frontend/src/pages/AiService/Simulator/hooks/useSimulator.js`
- `startSimulation` 함수 내의 `types` 배열에 새로 추가한 타입(예: "E")을 포함시킵니다.

---

## 🔄 데이터 흐름 요약 (Data Flow)

1.  **React**: "E" 타입 시나리오 시작 요청 ➔ **Java Backend**
2.  **Java Backend**: **Python AI**에 첫 대사 생성 요청
3.  **Python AI**: `AI_CONFIG["simulation_romance"]` 프롬프트를 사용하여 대사 생성 (JSON 형식)
    - 예: `{"dialogue": "어머, 제 선물이 세관에 걸렸대요...", "emotion": "Anxious", "tension": 40}`
4.  **Java ➔ React**: 생성된 데이터를 전달
5.  **React ➔ Unity**: `sendMessage("ReactReceiver", "OnReceiveSimulationData", jsonData)` 호출
6.  **Unity**: JSON을 파싱하여 캐릭터 애니메이션(Anxious)을 재생하고 말풍선에 대사 출력

---

> [!TIP]
> **새로운 AI 지식 추가**: 새로운 범죄 수법에 대한 최신 데이터를 AI가 참고하게 하려면, `backend-python/py/backend/chroma_db`에 해당 텍스트 파일을 임베딩하여 추가하세요.
