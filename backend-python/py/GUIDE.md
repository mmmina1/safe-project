# AI Banking Phishing Prevention - Clean Architecture Guide

이 가이드는 **Clean Architecture** 구조로 리팩토링된 프로젝트를 PyCharm에서 실행하고 사용하는 방법을 설명합니다.

## 1. 프로젝트 구조 (Clean Architecture)

기존 단순 구조에서, 기능별로 독립된 모듈 구조로 변경되었습니다.

`backend/app/features/diagnosis/`
*   **domain**: 핵심 로직 (외부 의존성 X) - 예: 점수 계산 규칙
*   **data**: 데이터 저장 (현재는 Mock DB) - 예: `sources.py` (딕셔너리 저장)
*   **presentation**: API 라우터 (@POST) - 예: `router.py`

---

## 2. PyCharm 실행 방법

**질문하신 내용**: "파이참에서 실행되는거야?"
**답변**: **네, 파이참에서 바로 실행 가능합니다.**

### 방법 A: 터미널에서 실행 (가장 간단)
PyCharm 하단의 `Terminal` 탭을 열고 아래 명령어를 입력하세요.

```bash
# 1. backend 폴더로 이동 (이미 이동되어 있다면 생략)
cd py/backend

# 2. 서버 실행
python main.py
```

### 방법 B: PyCharm 'Run' 버튼 설정
1.  PyCharm 상단 우측 `Current File` 혹은 `Edit Configurations...` 클릭
2.  `+` 버튼 -> `Python` 선택
3.  설정 값 입력:
    *   **Name**: `Run Backend`
    *   **Script path**: `.../Desktop/proto/py/backend/main.py` (파일 아이콘 눌러서 선택)
    *   **Working directory**: `.../Desktop/proto/py/backend` (자동 설정됨)
4.  `OK` 누르고, 초록색 `▶` 재생 버튼 클릭

---

## 3. 테스트 방법

### A. API 테스트 (테스트 스크립트)
만들어둔 테스트 스크립트를 실행하여 잘 동작하는지 확인합니다.

```bash
# 터미널에서 (proto/py 폴더 기준)
python scripts/test_diagnosis_feature.py
```
> 결과로 `Diagnosis Verification Passed!`가 나오면 성공입니다.

### B. 웹 브라우저 테스트 (Swagger UI)
서버가 켜진 상태(`RUN` 중)에서 브라우저를 엽니다.
*   주소: [http://localhost:8000/docs](http://localhost:8000/docs)
*   **POST /diagnosis/** 항목을 클릭 -> `Try it out` -> `Execute`
*   응답 결과(JSON)를 확인합니다.

---

## 4. 데이터베이스 (Mock DB)
현재 단계에서는 **실제 DB(MySQL)를 켜지 않아도 됩니다.**
`backend/app/features/diagnosis/data/sources.py` 파일 내부의 `self.storage = {}` 딕셔너리가 DB 역할을 대신합니다.
*   **장점**: 설치 불필요, 에러 없음, 구조 학습에 최적화
*   **단점**: 서버를 껐다 켜면 데이터가 사라짐 (나중에 실제 DB로 교체 예정)

---

이 가이드를 따라 실행해보시고, 잘 안되는 부분이 있으면 말씀해주세요!
