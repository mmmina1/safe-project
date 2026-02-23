# ☁️ AWS 배포 가이드 (ECR + EC2 Docker Compose)

이 문서는 `safe-project`를 AWS 환경에 가장 안정적이고 효율적으로 배포하는 방법을 설명합니다.

---

## 🏗️ 전체 아키텍처
*   **이미지 저장소**: AWS ECR (Elastic Container Registry)
*   **컴퓨팅 서버**: AWS EC2 (Ubuntu 22.04 LTS)
*   **오케스트레이션**: Docker Compose
*   **데이터베이스**: 기존 AWS RDS/EC2 MySQL (유지)

---

## 🛠️ 1단계: AWS ECR 이미지 업로드 (로컬 작업)

도커 허브 대신 보안과 속도가 뛰어난 AWS ECR을 사용합니다.

1.  **ECR 리포지토리 생성** (AWS 콘솔 또는 CLI)
    *   `safe-backend`, `safe-frontend`, `safe-python-backend` 3개를 각각 생성합니다.

2.  **로그인 및 푸시**:
    ```bash
    # AWS 로그인 (리전과 계정ID 입력)
    aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin [계정ID].dkr.ecr.ap-northeast-2.amazonaws.com

    # 이미지 빌드 및 태그 지정
    docker build -t safe-backend ./backend
    docker tag safe-backend:latest [계정ID].dkr.ecr.ap-northeast-2.amazonaws.com/safe-backend:latest

    # 푸시
    docker push [계정ID].dkr.ecr.ap-northeast-2.amazonaws.com/safe-backend:latest
    ```
    *(프론트엔드와 파이썬 백엔드도 동일한 방식으로 진행합니다.)*

---

## 🚀 2단계: EC2 서버 설정 (AWS 인스턴스 작업)

1.  **인스턴스 생성**: Ubuntu 22.04 LTS (t3.medium 권장)
2.  **보안 그룹 설정**: 80(HTTP), 443(HTTPS), 8081(Backend API), 8000(Python API) 인바운드 허용
3.  **필수 도구 설치**:
    ```bash
    sudo apt-get update
    sudo apt-get install -y docker.io docker-compose awscli
    ```

---

## ⚙️ 3단계: EC2에서 서비스 실행

1.  **프로젝트 파일 복사**: `docker-compose.yml` 파일만 EC2로 복사합니다.
2.  **이미지 주소 수정**: `docker-compose.yml` 내의 `build:` 섹션을 `image: [ECR주소]`로 변경합니다.
3.  **환경 변수(.env) 생성**: 
    *   로컬의 `.env.sample`을 참고하여 서버 내부에 `.env` 파일을 만듭니다.
    *   `DB_URL` 등 실제 운영 정보를 입력합니다.
4.  **실행**:
    ```bash
    aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin [계정ID].dkr.ecr.ap-northeast-2.amazonaws.com
    docker-compose pull
    docker-compose up -d
    ```

---

## 📝 배포 자동화 (deploy.sh)

매번 수동으로 입력하기 번거로우므로, 아래 스크립트를 서버에 저장해 사용하세요.

```bash
#!/bin/bash
# deploy.sh

echo "1. AWS ECR 로그인..."
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin [계정ID].dkr.ecr.ap-northeast-2.amazonaws.com

echo "2. 최신 이미지 다운로드..."
docker-compose pull

echo "3. 서비스 재시작..."
docker-compose up -d --remove-orphans

echo "4. 정리..."
docker image prune -f

echo "✅ 배포 완료!"
```

---

## ⚠️ 주의 사항
*   **보안**: `.env` 파일은 절대 Git에 올리지 말고 서버에 직접 생성하세요.
*   **비용**: 사용하지 않는 이미지는 ECR에서 주기적으로 삭제하여 저장소 비용을 절약하세요.
