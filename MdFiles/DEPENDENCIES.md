# 🛠️ Project Dependency Log

이 문서는 `MyPage` 및 `AiService`를 구현하면서 새롭게 추가되었거나 필수적인 핵심 라이브러리들을 기록합니다. 나중에 다른 환경에서 프로젝트를 설정할 때 이 리스트를 참고하여 설치해 주세요.

## 1. 프론트엔드 (Frontend) 추가 라이브러리

모든 명령어는 `frontend` 폴더 내부에서 실행합니다.

### 📊 데이터 시각화 (MyPage 대시보드)
*   **설치 명령**: `npm install chart.js react-chartjs-2`
*   **용도**: 사용자의 보안 점수 추이를 선 그래프(Line Chart)로 시각화하는 데 사용됩니다.

### ✨ 아이콘 팩 (전체 공통)
*   **설치 명령**: `npm install lucide-react`
*   **용도**: 챗봇, 진단 센터, 사이드바 등 모든 화면에서 깨끗하고 현대적인 아이콘을 표시하는 데 사용됩니다.

### 🌐 서버 통신 (API 연동)
*   **설치 명령**: `npm install axios`
*   **용도**: 백엔드(Python/Spring Boot) 서버와 데이터를 주고받기 위한 HTTP 클라이언트로 사용됩니다.

### 🛤️ 라우팅 및 상태 관리 (기본 필수)
*   **설치 명령**: `npm install react-router-dom zustand`
*   **용도**: 페이지 간 이동(Routing) 및 전역 상태(Store) 관리를 위해 사용됩니다.

### 🎮 유니티 통합 (Simulation)
*   **설치 명령**: `npm install react-unity-webgl`
*   **용도**: 유니티 웹빌드(WebGL) 파일을 리액트 컴포넌트 내에서 실행하고 통신하기 위해 사용됩니다.

---

## 2. 전체 설치 요약 (한 번에 설치하기)

새로운 환경에서 한꺼번에 설치하려면 아래 명령어를 복사해서 사용하세요:

```bash
cd frontend
npm install chart.js react-chartjs-2 lucide-react axios react-router-dom zustand react-unity-webgl
```

---

## 3. 백엔드 (Python AI) 필수 패키지

`backend-python` 폴더에서 가상환경 활성화 후 설치합니다.

*   `fastapi`, `uvicorn`: API 서버 구축
*   `langchain`, `openai`: 인공지능 로직 처리
*   `python-dotenv`: 환경 변수 관리
*   `chromadb`: 벡터 데이터베이스 (RAG용)

---
> [!NOTE]
> 이 리스트는 기능이 추가됨에 따라 계속 업데이트됩니다.
