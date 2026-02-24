# 🌐 SAFE 프로젝트 인프라 핵심 개념 정리 (Infra Concepts)

이 문서는 SAFE 프로젝트의 실제 구조(Spring Boot, React, FastAPI)를 바탕으로 인프라 기술이 어떻게 적용되었는지 설명합니다.

---

### 1. 🚀 DevOps & CI/CD (자동 배포)
*   **CI (지속적 통합)**: 코드를 합치면 자동으로 앱 박스(Docker Image)를 만드는 시스템입니다.
    - **우리 프로젝트 사례**: `.github/workflows/deploy.yml` 파일이 설계도 역할을 합니다. 사용자가 코드를 `develop` 브랜치에 Push하면, GitHub의 가상 컴퓨터가 자바를 컴파일하고 리액트를 빌드하여 3개의 ECR 창고로 이미지를 전송합니다.
*   **CD (지속적 배포)**: 빌드된 결과물을 실제 서버에 반영하는 것입니다.
    - **우리 프로젝트 사례**: ECR에 최신 이미지가 올라가면, 사용자가 서버에서 `./deploy.sh`를 실행합니다. 이 스크립트는 `docker-compose.yml` 설정을 바탕으로 최신 이미지를 PULL 받아 서비스를 재가동합니다.

### 2. 🐳 Docker & Docker-compose (컨테이너 관리)
*   **Docker (박스화)**: 환경에 상관없이 어디서든 똑같이 앱을 실행하게 해주는 기술입니다.
    - **우리 프로젝트 사례**:
        - `safe-frontend`: Nginx 위에 React 앱을 올려 80번 포트로 서비스합니다.
        - `safe-backend`: Spring Boot 기반의 메인 API 서버입니다.
        - `safe-python-backend`: FastAPI 기반의 인공지능 서버입니다.
*   **Docker-compose (통합 관리)**: 흩어진 컨테이너들을 하나로 묶어 관리합니다.
    - **우리 프로젝트 사례**: `docker-compose.yml` 파일 하나로 위 3개의 서비스를 동시에 띄웁니다. 특히 `depends_on` 설정을 통해 AI 서버가 먼저 뜨고 나서 백엔드 서버가 뜨도록 순서를 제어합니다.

### 3. ☁️ AWS (클라우드 자원)
*   **EC2 & EBS (서버와 하드디스크)**: 
    - **우리 프로젝트 사례**: Ubuntu 24.04 기반의 `t2.micro` 인스턴스를 사용합니다. 초기 8GB였던 EBS(하드디스크) 용량이 도커 이미지 적재를 위해 부족해지자, 클라우드 기술을 이용해 **25GB로 무중단 확장**했습니다.
*   **ECR (이미지 저장소)**: 
    - **우리 프로젝트 사례**: 각 서비스별로 전용 저장소를 만들어 보안성을 높였습니다. 

### 4. 🗄️ Database & Networking (통신 설계)
*   **MySQL & Private IP**:
    - **우리 프로젝트 사례**: AWS RDS를 사용하는 대신, 서버에 직접 설치한 MySQL을 사용합니다. 백엔드 서비스는 보안을 위해 서버의 **사설 IP(172.31.x.x)**를 통해 DB에 접속하여 데이터 유출 위험을 차단했습니다.
*   **Vector DB (ChromaDB)**: 
    - **우리 프로젝트 사례**: AI 서버 내부에서 `ChromaDB`를 로컬 데이터베이스로 사용합니다. 학습된 지식 데이터는 서버의 `~/chroma_db` 폴더에 물리적으로 저장되어 관리됩니다.

---

### 💡 SAFE 기술 한 줄 요약
> **"React/Nginx ➔ Spring Boot ➔ FastAPI ➔ MySQL/ChromaDB가 하나의 Docker 네트워크 안에서 유기적으로 움직이는 풀스택 인프라입니다."**
