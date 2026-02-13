### AI 진단 시스템 데이터 인터페이스 정의

#### 1. 프론트엔드 API (React → Spring Boot)
**Endpoint:** `POST /api/ai/diagnosis/submit`

| 필드명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `diagnosisName` | String | 진단의 명칭 (예: "정기 AI 종합 진단") |
| `score` | Integer | 프론트엔드에서 자체 계산한 종합 점수 |
| `answers` | List\<Object\> | 사용자의 질문 및 답변 텍스트 뭉치 |
| - `question_text` | String | 질문 원문 |
| - `answer_text` | String | 사용자가 선택한 답변 원문 |

---

#### 2. 스프링부트 API (Spring Boot → Python)
**Endpoint:** `POST /simulator/analyze` (가칭)

| 필드명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `answers` | List\<Object\> | 프론트에서 받은 답변 리스트 그대로 전달 |
| - `question_text` | String | 질문 원문 |
| - `answer_text` | String | 답변 원문 |

---

#### 3. 파이썬 API (Python → Spring Boot)
**응답 데이터 (Response Body)**

| 필드명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `aiComment` | String | AI가 분석한 사용자의 현재 상태 총평 (긴 문장) |
| `top3Types` | List\<String\> | 가장 위험한 수법 Top 3 (예: ["기관사칭", "스미싱"]) |
| `recommendations` | List\<String\> | AI가 제안하는 맞춤형 개선 권장사항 리스트 |

---

#### 4. 데이터베이스 (DB 저장 구조)

**[TABLE: AI_DIAG_SESSION]**
- `overall_score`: 프론트가 준 점수 저장
- `diagnosis_name`: 프론트가 준 진단명 저장
- `ai_comment`: 파이썬이 준 총평 저장
- `top3_types`: 파이썬이 준 필드 콤마(,) 등으로 연결해 저장

**[TABLE: AI_DIAG_ANSWER]**
- `question_text`: 질문 원문 저장
- `answer_text`: 답변 원문 저장

**[TABLE: AI_DIAG_RECOMMEND]**
- `rec_text`: 파이썬이 준 권장사항 리스트를 한 줄씩 저장
