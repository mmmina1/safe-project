# 🏗️ AI 서비스 Clean Architecture 리팩토링 문서

이 문서는 `com.safe.backend.domain.aiservice` 패키지에 적용된 **Clean Architecture** 구조와 각 컴포넌트의 역할을 설명합니다.

---

## 🎯 리팩토링 목적
기존의 `Controller -> Service -> Client`로 이어지는 강한 결합을 끊고, **관심사의 분리(Separation of Concerns)**를 통해 유지보수성과 테스트 용이성을 높이기 위함입니다. 외부 시스템(Python AI 서버)의 변경이 비즈니스 로직(Domain)에 영향을 주지 않도록 설계했습니다.

---

## 📂 패키지 구조 (Directory Structure)

```text
aiservice
├── presentation        # [표현 계층] 외부 요청을 처리 (Web, API)
│   └── AiServiceController.java
│
├── domain              # [도메인 계층] 핵심 비즈니스 로직 (순수 Java)
│   ├── usecase         # 애플리케이션 업무 규칙
│   │   ├── ChatUseCase.java
│   │   └── DiagnosisUseCase.java
│   ├── model           # 비즈니스 데이터 객체 (Entity)
│   │   ├── ChatResult.java
│   │   └── ChatSource.java
│   └── repository      # 데이터 저장소 인터페이스
│       └── AiRepository.java
│
└── data                # [데이터 계층] 실제 데이터 처리 및 외부 통신
    ├── datasource      # 외부 소스(Python 서버) 연결
    │   └── PythonAiDataSource.java
    ├── repository      # 레포지토리 구현체
    │   └── AiRepositoryImpl.java
    └── dto             # 데이터 전송 객체 (네트워크 통신용)
        ├── ChatRequest.java
        └── ChatResponse.java
```

---

## 🧱 계층별 역할 (Layer Responsibilities)

### 1️⃣ Presentation Layer (표현 계층)
사용자의 요청을 받아 UseCase에 전달하고, 결과를 사용자에게 알맞은 형태로 반환합니다.
- **`AiServiceController`**: 
  - HTTP 요청(`POST /chat`, `GET /diagnosis`)을 받습니다.
  - 직접 로직을 처리하지 않고 `ChatUseCase`나 `DiagnosisUseCase`를 호출합니다.

### 2️⃣ Domain Layer (도메인 계층)
애플리케이션의 **핵심 비즈니스 로직**이 존재하는 곳입니다. 이 계층은 웹(Web)이나 DB, 외부 서버(Python)에 대해 전혀 알지 못합니다.
- **`ChatUseCase` / `DiagnosisUseCase`**: 
  - "메시지가 비어있는지 확인한다" 같은 유효성 검증과 업무 흐름을 제어합니다.
  - `AiRepository` 인터페이스를 통해 데이터를 요청합니다. (실제 구현체가 무엇인지는 모름)
- **`AiRepository` (Interface)**: 
  - 도메인 계층이 데이터를 얻기 위해 사용하는 **계약서(Interface)**입니다.
  - 예: "채팅 응답을 줘(chat)"라는 메서드만 정의되어 있습니다.
- **`ChatResult` / `ChatSource`**:
  - 비즈니스 로직에서 사용하는 순수한 데이터 모델입니다. DTO와 다릅니다.

### 3️⃣ Data Layer (데이터 계층)
실제 데이터를 가져오는 세부 구현이 존재하는 곳입니다.
- **`PythonAiDataSource`**: 
  - Python FastAPI 서버(8000번 포트)와 **실제 통신(HTTP REST)**을 담당합니다.
  - `RestTemplate`을 사용하여 JSON 데이터를 주고받습니다.
- **`AiRepositoryImpl`**: 
  - Domain 계층의 `AiRepository` 인터페이스를 구현(implements)합니다.
  - `PythonAiDataSource`에서 받아온 DTO(`ChatResponse`)를 도메인 객체(`ChatResult`)로 **변환(Mapping)**하여 반환합니다.
  - 이로써 도메인 계층은 외부 데이터의 형태(DTO)가 바뀌어도 영향을 받지 않습니다.
- **`ChatRequest` / `ChatResponse` (DTO)**:
  - Python 서버와 통신하기 위한 JSON 구조와 정확히 일치하는 객체입니다.

---

## 🚀 데이터 흐름 (Control Flow)

1. **요청**: `Frontend` → `AiServiceController` (Presentation)
2. **명령**: `Controller` → `ChatUseCase` (Domain)
3. **조회**: `UseCase` → `AiRepository` (Interface)
4. **구현**: `AiRepositoryImpl` (Data) → `PythonAiDataSource` (Data)
5. **통신**: `DataSource` ↔ `Python API` ↔ `OpenAI`
6. **반환**: 역순으로 데이터가 변환(`DTO` → `Entity`)되어 전달

---

## ✨ 이 구조의 장점
1. **의존성 규칙 준수**: 도메인 계층은 외부(Web, DB, Python)를 모릅니다. 외부 시스템이 바뀌어도 비즈니스 로직을 뜯어고칠 필요가 없습니다.
2. **테스트 용이성**: `AiRepository`를 가짜(Mock)로 만들면 Python 서버 없이도 비즈니스 로직만 테스트할 수 있습니다.
3. **유지보수성**: 코드가 역할별로 명확히 나뉘어 있어, 버그가 발생했을 때 어디를 봐야 할지 명확합니다.
