# 🐳 컨테이너화 및 배포 가이드라인 (DOCKER_GUIDE)

이 문서는 `safe-project`의 모든 서비스를 도커(Docker)를 통해 일관되게 관리하고 배포하는 방법을 설명합니다.

---

## 🏗️ 서비스 구성 프로젝트 상태

현재 프로젝트는 다음과 같은 마이크로서비스 구조로 컨테이너화되어 있습니다.

| 서비스 명 | 역할 | 기술 스택 | Dockerfile 위치 | 포트 (로컬) |
| :--- | :--- | :--- | :--- | :--- |
| **safe-backend** | 메인 백엔드 | Java 17, Spring Boot | `./backend/Dockerfile` | 8081 |
| **safe-frontend** | 웹 프론트엔드 | React, Vite, Nginx | `./frontend/Dockerfile` | 5173 |
| **safe-python-backend** | AI 도우미 서버 | Python 3.12, FastAPI | `./backend-python/py/Dockerfile` | 8000 |

> [!NOTE]
> **인프라 정리 완료**: AWS DB(RDS/EC2)를 직접 사용함에 따라 로컬 전용 `safe-mysql` 및 `safe-redis` 서비스는 제거되었습니다.

---

## 🚀 빠른 시작 (Quick Start)

모든 서비스를 한 번에 빌드하고 실행하려면 루트 디렉토리에서 아래 명령어를 실행하세요.

```powershell
# 이미지 빌드 및 컨테이너 실행
docker-compose up --build

# 백그라운드에서 실행하려면 (-d 옵션)
docker-compose up -d --build
```

---

## 🛠️ 각 컴포넌트별 컨테이너화 방법

### 1. Java Backend (`/backend`)
*   **멀티 스테이지 빌드**: 빌드 단계(`gradle:8-jdk17`)와 실행 단계(`openjdk:17-slim`)를 분리하여 보안성을 높이고 이미지 크기를 최소화했습니다.
*   **빌드 아티팩트**: `build/libs/*.jar` 파일이 실행 파일로 사용됩니다.

### 2. React Frontend (`/frontend`)
*   **Production 서빙**: 빌드 결과물(`dist`)을 `nginx:alpine` 이미지를 통해 정적 파일로 서빙합니다.
*   **포트**: 컨테이너 내부 80포트를 로컬의 5173포트로 연결합니다.

### 3. Python Backend (`/backend-python/py`)
*   **경량화 이미지**: `python:3.12-slim` 이미지를 사용하여 리소스 효율을 높였습니다.
*   **동적 환경**: 개발 시에는 소스 코드 변경 시 자동으로 재시작되는 환경을 지원합니다.

---

## ☁️ AWS 배포 전략 (AWS Deployment)

도커 이미지가 준비되었으므로, AWS 배포 프로세스는 매우 단순합니다.

1.  **AWS ECR**: 빌드된 이미지를 AWS의 컨테이너 저장소인 ECR(Elastic Container Registry)에 푸시합니다.
2.  **AWS App Runner (추천)**: 서버 관리 부담이 적은 App Runner를 통해 이미지를 배포합니다. 
    *   백엔드: 8080 포트 지정
    *   프론트엔드: 80 포트 지정
3.  **데이터베이스**: 현재 배포되어 있는 AWS RDS/EC2 MySQL 주소를 환경 변수(`DB_URL`)로 주입하여 연결합니다.

---

## 📦 라이브러리 및 의존성 관리 (npm, Gradle)

도커 환경에서는 로컬에 설치된 라이브러리(node_modules, .gradle 등)를 사용하지 않고, 이미지 빌드 시 컨테이너 내부에서 직접 설치합니다.

1.  **빌드 시 자동 설치**: 
    *   `Dockerfile` 내부에 `npm install`이나 `./gradlew build` 명령어가 포함되어 있어, 빌드 과정에서 필요한 모든 라이브러리가 컨테이너 내부에 자동으로 설치됩니다.
2.  **OS 간 충돌 방지**: 
    *   `.dockerignore`를 통해 로컬의 `node_modules`나 `build` 폴더가 컨테이너로 복사되는 것을 막습니다. 이는 윈도우에서 설치된 라이브러리가 리눅스 환경인 컨테이너에서 오작동하는 것을 방지하기 위함입니다.
3.  **새 라이브러리 추가 시**:
    *   로컬에서 `npm install [라이브러리]` 또는 `build.gradle`에 의존성을 추가한 후, 반드시 `docker-compose up --build` 명령어를 실행하여 도커 이미지를 갱신해야 합니다.

---

## ⚠️ 주의 사항 및 보안

*   **환경 변수 관리**: `JWT_SECRET`, `API_KEY` 등 민감 정보는 `.env` 파일을 통해 주입하며, 절대 Dockerfile에 직접 적지 않습니다.
*   **데이터 지속성**: MySQL 데이터는 `mysql_data` 볼륨을 통해 컨테이너가 재시작되어도 유지되도록 설정되어 있습니다.
*   **코드 변경 반영**: 소스 코드를 수정했을 때는 반드시 `docker-compose up --build`를 통해 이미지를 다시 빌드해야 합니다.
