# 🛠️ SAFE 프로젝트 배포 트러블슈팅 로그

본 문서는 실전 배포 과정에서 마주친 기술적 문제들과 그 해결 과정을 기록한 '지식 자산'입니다.

---

### CASE 1. 저사양 서버의 물리적 한계 (Memory)
- **문제**: t2.micro(1GB RAM) 환경에서 고사양 Java & Python 서비스를 동시 구동 시 서버 멈춤 현상 발생 가능성.
- **행동**: 하드디스크 2GB를 가상 메모리로 활용하는 **Swap** 설정을 적용함.
- **배운점**: 클라우드 프리티어 환경에서는 한정된 자원을 보완하기 위한 OS 차원의 최적화가 필수적임을 배움.
- **실행 환경 및 방법**: 
    - **[서버 SSH 터미널]**: 
        ```bash
        sudo fallocate -l 2G /swapfile
        sudo chmod 600 /swapfile
        sudo mkswap /swapfile
        sudo swapon /swapfile
        echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
        ```

### CASE 2. 디스크 용량 부족 (Storage Expansion)
- **문제**: 도커 이미지 빌드 및 레이어 누적으로 인해 기본 8GB 용량이 꽉 차서 서비스 중단.
- **행동**: AWS EBS 볼륨 확장 후, 리눅스 파티션과 파일시스템 확장 작업 수행.
- **실행 환경 및 방법**:
    - **[AWS 웹 콘솔]**: EC2 -> 볼륨 -> 해당 볼륨 선택 -> [수정] 클릭 -> 크기 25GB로 변경
    - **[서버 SSH 터미널]**: 
        ```bash
        sudo growpart /dev/nvme0n1 1    # 파티션 확장
        sudo resize2fs /dev/nvme0n1p1  # 파일시스템 확장
        ```

### CASE 3. ECR 리포지토리 접근 권한 (AWS CLI)
- **문제**: AWS ECR(이미지 창고) 권한 거부로 인한 배포 중단.
- **행동**: 서버 환경에서 `aws configure`를 통해 인증 정보 등록.
- **실행 환경 및 방법**:
    - **[AWS 웹 콘솔]**: IAM -> 사용자 -> 보안 자격 증명 -> 액세스 키 생성
    - **[서버 SSH 터미널]**: 
        ```bash
        aws configure
        # AWS Access Key ID: [복사한 키 입력]
        # AWS Secret Access Key: [복사한 비밀키 입력]
        # Default region name: ap-northeast-2
        ```

### CASE 4. 도커 볼륨 권한 이슈 (Permission Denied)
- **문제**: 로컬 컴퓨터에서 서버로 파일을 보낼 때 `remote setstat Permission denied` 에러 발생.
- **행동**: 폴더 소유권을 일반 사용자(`ubuntu`)로 변경 후 전송 시도.
- **실행 환경 및 방법**:
    - **[서버 SSH 터미널]**: `sudo chown -R ubuntu:ubuntu ~/data` (주인 권한 뺏어오기)
    - **[내 컴퓨터 PowerShell]**: `scp -i [키파일] -r [로컬경로] ubuntu@[IP]:~/data/` (다시 전송)

### CASE 5. 내부 망 통신 두절 (DB Connection Error)
- **문제**: 백엔드가 공인 IP로 접근하다 네트워크 타임아웃 발생.
- **행동**: `docker-compose.yml`을 수정하여 내부용 사설 IP로 통신 유도.
- **실행 환경 및 방법**:
    - **[내 컴퓨터 VS Code]**: `docker-compose.yml` 파일에서 `DB_URL`의 IP를 서버의 **사설 IP(172.31.x.x)**로 수정
    - **[내 컴퓨터 PowerShell]**: 수정된 `docker-compose.yml` 파일을 `scp`로 서버에 전송
    - **[서버 SSH 터미널]**: `./deploy.sh` 실행하여 서비스 재가동

### CASE 6. AI 벡터 데이터 인식 불가
- **문제**: 학습 데이터를 주입했음에도 챗봇이 `Nothing found on disk` 에러 발생.
- **행동**: 데이터 전송 ➔ 인덱싱 실행 ➔ 권한 수정 ➔ 서비스 재시작의 4단계 조치.
- **실행 환경 및 방법**:
    - **[내 컴퓨터 PowerShell]**: 학습용 `.txt` 파일들을 `scp`로 전송
    - **[서버 SSH 터미널]**:
        ```bash
        # 1. 벡터 데이터 변환(Ingest) 실행
        docker exec safe-python-backend python3 scripts/ingest.py
        # 2. 생성된 DB 폴더 권한 수정
        sudo chown -R ubuntu:ubuntu ~/chroma_db
        # 3. 서비스 재시작
        docker restart safe-python-backend
        ```

---
> **🏁 총평**: 배포는 코드의 완성이 아닌 새로운 '환경과의 조율'입니다. 발생한 에러들은 시스템의 구조를 더 깊이 이해하게 만든 최고의 스승이었습니다.
