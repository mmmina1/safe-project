# 🛠️ Technology Stack (기술 스택)

이 프로젝트는 현대적인 웹 서비스 아키텍처를 따르며, 사용자 중심의 프론트엔드, 견고한 비즈니스 로직의 자바 백엔드, 그리고 고도화된 AI 능력을 가진 파이썬 서버가 유기적으로 결합된 시스템입니다.

---

## 💻 Frontend (사용자 인터페이스)
사용자에게 직관적이고 미려한 UI/UX를 제공하기 위해 최신 React 생태계를 활용합니다.

- **Core**: ⚛️ React 19 (Vite)
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query v5, Axios
- **Navigation**: React Router DOM v7
- **Styling**: Bootstrap 5, React Bootstrap
- **Visualization**: Chart.js, Recharts, React Leaflet (Map)
- **Integration**: 🎮 React Unity WebGL (3D 시뮬레이션 인터랙션)
- **Payment**: Toss Payments SDK (결제 모듈)
- **Utilities**: Lucide React, React Hook Form

---

## ☕ Backend - Core (비즈니스 로직)
견고한 성능과 보안이 필요한 핵심 서버 기능은 Spring Boot를 기반으로 합니다.

- **Language**: Java 17
- **Framework**: Spring Boot 3.5.10 (Gradle)
- **Database**: MySQL (Production), H2 (Test)
- **ORM**: Spring Data JPA
- **Security**: Spring Security, JWT (jjwt)
- **Cloud/Storage**: AWS S3 (Spring Cloud AWS)
- **Utilities**: Lombok, Validation

---

## 🐍 Backend - AI (지능형 엔진)
추론 및 자연어 처리가 필요한 AI 핵심 모듈은 Python의 Clean Architecture를 따릅니다.

- **Full-Stack Framework**: FastAPI
- **Architecture**: Domain-Driven Design (DDD) 기반 Clean Architecture
- **Language Model**: OpenAI API
- **Vector Database**: ChromaDB (RAG 기반 지식 검색)
- **Data Processing**: Pydantic v2
- **Logic**: RAG (Retrieval-Augmented Generation) 패턴 적용

---

## 🏗️ Infrastructure & Others
안정적인 서비스 배포와 운영을 위한 환경입니다.

- **Containerization**: 🐳 Docker, Docker Compose
- **In-Memory Cache**: Redis 7
- **Version Control**: Git
- **Documentation**: Markdown, Mermaid Diagrams
