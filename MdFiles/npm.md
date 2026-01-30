# 📦 NPM Dependencies List & Usage

이 문서는 프로젝트의 프론트엔드(`frontend`)에서 사용되는 모든 NPM 패키지 리스트와 해당 패키지들이 **어느 기능, 어느 파일**에서 사용되고 있는지 정리합니다.

## 🚀 필수 라이브러리 (Core & UI)
| 패키지명 | 주요 파일/위치 | 상세 용도 |
| :--- | :--- | :--- |
| **react** | `src/main.jsx`, 전체 컴포넌트 | UI 렌더링 및 컴포넌트 기반 아키텍처 핵심 |
| **react-router-dom** | `src/App.jsx` | 페이지 라우팅 (Home, MyPage, AiService 등 이동) |
| **bootstrap** | `src/main.jsx` | 전역 스타일 및 레이아웃 기초 |
| **react-bootstrap** | `src/components/`, `src/pages/` | Modal, Button, Navbar 등 UI 컴포넌트 구성 |

## 🛠️ 기능성 라이브러리 (Logic & Data)
| 패키지명 | 주요 파일/위치 | 상세 용도 |
| :--- | :--- | :--- |
| **axios** | `src/api/axiosInstance.js`, `src/api/aiServiceApi.js` | 백엔드(Spring/Python)와의 비동기 HTTP 통신 |
| **zustand** | `src/store/userStore.js` | 로그인 정보, 유저 설정 등 전역 상태 관리 |
| **react-unity-webgl**| `src/pages/AiService/Simulator/` | AI 시뮬레이션 게임 엔진(Unity) 임베딩 및 통신 |

## 📊 시각화 및 디자인 (Visualization & Icons)
| 패키지명 | 주요 파일/위치 | 상세 용도 |
| :--- | :--- | :--- |
| **chart.js** | `src/pages/MyPage/components/Dashboard.jsx` | 위험 점수 추이 및 통계 데이터 시각화 엔진 |
| **react-chartjs-2** | `src/pages/MyPage/components/Dashboard.jsx` | Chart.js를 리액트 컴포넌트로 사용하기 위한 래퍼 |
| **lucide-react** | `Sidebar.jsx`, `Chatbot.jsx`, `Diagnosis.jsx` | 메뉴, 챗봇 대화창, 진단 결과 등 현대적인 아이콘 표시 |
| **react-icons** | `src/pages/Landing/Footer.jsx` | 소셜 아이콘 및 기타 범용 아이콘 보조 |

---

## ⚡ 설치 가이드
모든 라이브러리를 한 번에 설치하려면 아래 명령어를 사용하세요:

```bash
cd frontend
npm install axios bootstrap chart.js lucide-react react-bootstrap react-chartjs-2 react-icons react-router-dom react-unity-webgl zustand
```

> [!NOTE]
> 위 리스트는 실제 소스 코드(`src/`) 내의 `import` 문을 바탕으로 작성되었습니다. 새로운 라이브러리 추가 시 이 문서도 함께 업데이트해 주시기 바랍니다.
