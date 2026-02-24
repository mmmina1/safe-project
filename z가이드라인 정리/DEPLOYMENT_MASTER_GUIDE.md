# 🚀 SAFE 프로젝트 올인원(All-in-One) 배포 가이드

전체 배포 과정을 단계별로 따라하며 완료할 수 있도록 정리한 체크리스트입니다.

---

## 🏗️ 1단계: 인프라 기초 공사 (AWS Console & SSH)

1. **[AWS 웹 콘솔]** EC2 인스턴스 생성 (Ubuntu 22.04 또는 24.04).
2. **[AWS 웹 콘솔]** 보안 그룹에서 80(HTTP), 22(SSH) 포트 개방.
3. **[내 컴퓨터 PowerShell]** 서버 접속: `ssh -i "[키파일]" ubuntu@[서버IP]`
4. **[서버 SSH 터미널]** 메모리 부족 방지 Swap 설정:
   ```bash
   sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
   ```
5. **[서버 SSH 터미널]** 도커 설치:
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose-v2
   sudo usermod -aG docker ubuntu  # 이후 로그아웃/로그인 필요
   ```

---

## 🔗 2단계: 자동 배포 통로 개설 (GitHub & ECR)

6. **[AWS 웹 콘솔]** ECR 리포지토리 3개 생성 (`safe-frontend`, `safe-backend`, `safe-python-backend`).
7. **[AWS 웹 콘솔]** IAM -> 사용자 -> 액세스 키 발급 (ID와 Secret Key 복사).
8. **[GitHub 저장소]** Settings -> Secrets and variables -> Actions에 다음 값 등록:
   - `AWS_ACCESS_KEY_ID`: [IAM에서 복사한 키]
   - `AWS_SECRET_ACCESS_KEY`: [IAM에서 복사한 비밀키]
9. **[GitHub Actions 작동 원리]** 코드를 Push하면 서버가 아닌 **GitHub의 가상 컴퓨터**에서 다음 작업이 자동으로 일어납니다:
   - **Checkout**: 내 소스 코드를 가상 컴퓨터로 가져옴.
   - **Login**: 내 AWS 계정(ECR)에 로그인.
   - **Build**: `Dockerfile`을 읽어 실행 가능한 '이미지'로 압축.
   - **Push**: 압축된 이미지를 AWS ECR 창고로 전송.
   - **주의**: 이 과정에서 `.env` 같은 보안 파일은 포함되지 않습니다 (보안상 제외).

---

## 🛰️ 3단계: 실서버 가동 (Local & SSH)

10. **[내 컴퓨터 PowerShell]** 배포 지침서들을 서버로 전송:
    ```powershell
    scp -i "[키파일]" docker-compose.yml deploy.sh .env ubuntu@[서버IP]:~/
    ```
11. **[서버 SSH 터미널]** 서버에 전용 권한 등록:
    ```bash
    aws configure  # Access Key, Secret Key, 리전(ap-northeast-2) 입력
    ```
12. **[서버 SSH 터미널]** 배포 스크립트 실행 권한 부여 및 가동:
    ```bash
    chmod +x deploy.sh
    ./deploy.sh
    ```

---

## 🧠 4단계: AI 뇌 주입 (Data Populating)

13. **[서버 SSH 터미널]** 데이터 폴더 권한 미리 확보:
    ```bash
    sudo chown -R ubuntu:ubuntu ~/data
    ```
14. **[내 컴퓨터 PowerShell]** 학습 텍스트 파일들 전송:
    ```powershell
    scp -i "[키파일]" -r backend-python/py/data/* ubuntu@[서버IP]:~/data/
    ```
15. **[서버 SSH 터미널]** AI 학습 도구(Ingest) 가동:
    ```bash
    docker exec safe-python-backend python3 scripts/ingest.py
    ```
16. **[서버 SSH 터미널]** 생성된 DB 권한 수정 및 AI 재시작:
    ```bash
    sudo chown -R ubuntu:ubuntu ~/chroma_db
    docker restart safe-python-backend
    ```

---

## 🔒 5단계: 보안 및 비밀 관리 (수동 인계 목록)

Git이 관리하지 않는 파일들은 10번 단계에서 **사용자가 직접** 서버로 던져줘야 합니다.

17. **[전송 대상 리스트]** (내 컴퓨터 프로젝트 폴더 기준)
    - `.env`: API 키, DB 비밀번호 등 민감 정보가 담긴 파일.
    - `docker-compose.yml`: 서비스 구조 설정 파일.
    - `deploy.sh`: 서버용 배포 실행 스크립트.
    - `data/`: AI 학습용 텍스트 파일들이 담긴 폴더.
18. **[수동 전송 명령어 양식]** (내 컴퓨터 PowerShell에서 입력)
    ```powershell
    # 단일 파일 전송 (가장 많이 사용)
    scp -i "[키파일.pem]" [파일명] ubuntu@[서버IP]:~/
    
    # 폴더 통째로 전송 (AI 데이터 등)
    scp -i "[키파일.pem]" -r [폴더명]/* ubuntu@[서버IP]:~/data/
    ```

---

## 🌐 6단계: 네트워크 통신 설계 (Networking)

서버 내부와 외부의 통신 통로를 구분하여 보안을 강화합니다.

20. **[AWS 보안 그룹 설정]** 
    - **HTTP(80)**: `Anywhere (0.0.0.0/0)` - 전 세계 누구나 접속 허용.
    - **SSH(22)**: `My IP` - 오직 내 컴퓨터에서만 서버 관리 허용 (권장).
    - **기타(3306, 8000)**: 닫아둠 - 서버 내부에서만 통신하므로 외부 공개 불필요.
21. **[내부 통신 주소]** 
    - 백엔드에서 DB 접속 시: `jdbc:mysql://[서버 사설 IP]:3306/safe_db`
    - 브라우저에서 서버 접속 시: `http://[서버 공인 IP]`

---

## 📎 부록: 다른 브랜치를 서버에 배포하고 싶을 때

기본적으로 `develop` 브랜치 소스가 배포되도록 설정되어 있으나, 다른 브랜치(예: `main`, `release`)를 올리고 싶다면 다음 두 가지 방법을 사용합니다.

### 방법 1: 특정 브랜치 푸시 시 자동 배포 (실무용)
1. **[.github/workflows/deploy.yml]** 파일을 엽니다.
2. 상단 `on.push.branches` 리스트에 원하는 브랜치명을 추가합니다.
   ```yaml
   on:
     push:
       branches: [ "develop", "feature/unified-safe-ai", "main" ] # 여기에 추가
   ```
3. 해당 브랜치에 코드를 Push하면 자동으로 빌드가 시작됩니다.

### 방법 2: 수동으로 원하는 브랜치 선택해서 배포 (유연함)
1. **[.github/workflows/deploy.yml]** 상단 `on` 섹션에 `workflow_dispatch:`를 추가합니다.
   ```yaml
   on:
     push:
       branches: [ "develop", "feature/unified-safe-ai" ]
     workflow_dispatch: # 이 한 줄을 추가
   ```
2. 수정한 파일을 GitHub에 올립니다.
3. GitHub 웹사이트의 **[Actions]** 탭으로 접속합니다.
4. 왼쪽 목록에서 `Build and Push to AWS ECR` 워크플로우를 선택합니다.
5. 우측 상단에 나타난 **[Run workflow]** 버튼을 누르고, 배포를 원하는 브랜치를 선택한 뒤 실행합니다.

---

## 📝 관리 운영 팁 (Maintenance Tips)

### ⏱️ 배포 주기 및 소요 시간
- **빌드 단계 (자동)**: GitHub Actions에서 Push 후 약 **5~7분** 소요. (빌드 완료 시 GitHub Actions 탭이 초록색으로 바뀝니다.)
*   **반영 단계 (수동)**: 이미지 빌드 완료 후 서버에서 `./deploy.sh` 실행 시 약 **1분** 소요.
- **총합**: 코드 수정 후 실제 서버 반영까지 **넉넉히 10분 정도**의 작업 시간이 필요합니다.

### 🛡️ 왜 서버 배포는 수동(`deploy.sh`)인가요?
1. **안정성**: 빌드 중에 서버가 꺼지거나, 서비스가 의도치 않은 시점에 중단되는 것을 방지합니다.
2. **검증**: GitHub Actions가 성공(초록불)했는지 확인한 뒤, 관리자가 원하는 시점에 안전하게 서비스를 교체하기 위함입니다.
3. **Rollback**: 만약 배포 후 문제가 생기면 즉시 이전 상태로 되돌리기 용이합니다.

### 🔄 배포 갱신 루틴 (Routine)
로컬 코드 수정 ➔ `git push` ➔ GitHub Actions 성공 확인(5분 대기) ➔ 서버 접속 ➔ `./deploy.sh` 실행 (끝).

---

## ✅ 최종 확인
- 브라우저 주소창에 `http://[서버IP]` 입력 후 사이트 접속 확인.
- AI 챗봇에게 질문을 던져 지식 기반 답변이 오는지 확인.
