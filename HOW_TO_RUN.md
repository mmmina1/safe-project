# 🚀 실행 가이드

1번콘솔
리액트-프론트엔드
<!-- 첫 실행시 -->
cd frontend
npm install
npm install react-router-dom lucide-react zustand @tosspayments/tosspayments-sdk chart.js react-chartjs-2 react-unity-webgl
npm run dev

<!-- 재시작시 -->
cd frontend
npm run dev

---

## 🏗️ 도커(Docker)로 한 번에 실행하기 (추천)
모든 팀원이 동일한 환경에서 서버를 돌릴 수 있는 가장 쉬운 방법입니다.

### 1. 사전 준비
- **Docker Desktop** 설치 ([다운로드 링크](https://www.docker.com/products/docker-desktop/))

### 2. 실행 방법
```powershell
# 프로젝트 루트(최상위 폴더)에서 실행
docker-compose up --build
```
- 파이썬 서버가 **8000번 포트**에서 자동으로 실행됩니다.
- 접속 주소: [http://localhost:8000/docs](http://localhost:8000/docs)
- 수정 사항이 즉시 반영(Hot-reload)되도록 설정되어 있습니다.

---

## 🐍 파이썬 백엔드 수동 실행 (개별 설정 시)

<!-- 프로젝트 초기 설정 (새 컴퓨터 또는 가상환경 재설정 시) -->
# 1. 파이썬 3.12 설치 (최초 1회 필수)
# 다운로드: https://www.python.org/ftp/python/3.12.8/python-3.12.8-amd64.exe
# 설치 시 "Add Python to PATH" 반드시 체크

# 2. 기존 가상환경 삭제 및 재생성
cd backend-python\py
Remove-Item -Recurse -Force .venv -ErrorAction SilentlyContinue
py -3.12 -m venv .venv

# 3. 가상환경 활성화 및 패키지 설치
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt

# 4. 데이터 초기화 (AI 학습 데이터 임베딩)
$env:PYTHONIOENCODING="utf-8"
python scripts\ingest.py

# 5. 서버 실행
cd backend
python main.py

<!-- 일상적인 재시작 시 -->
cd backend-python\py
.\.venv\Scripts\Activate.ps1
cd backend
python main.py

3번콘솔
스프링부트-백엔드
cd backend
.\gradlew bootRun

---

## 🔐 중요 데이터(.env) 관리 가이드
API 키나 DB 비밀번호 같은 민감한 정보는 보안을 위해 다음과 같이 관리합니다.

1. **`.env` 파일 공유 금지**: 환경 변수 파일(`.env`)은 절대 Git에 올리지 않습니다. (이미 `.gitignore`에 등록되어 있습니다.)
2. **`.env.example` 활용**:
   - 팀원들에게 필요한 설정 항목을 알려주기 위해 `backend-python/py/backend/.env.example` 파일을 만들어 두었습니다.
   - 새로운 팀원은 이 파일을 복사해서 `.env`로 이름을 바꾼 뒤, 본인의 API 키를 입력하면 됩니다.
3. **도커에서의 사용**: 
   - `docker-compose.yml`이 자동으로 프로젝트의 `.env` 파일을 읽어 서비스에 주입합니다.

