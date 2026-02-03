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

2번콘솔
파이썬-백엔드
<!-- 첫 실행시 -->
# 1. 프로젝트 폴더로 이동
cd backend-python\py

# 2. Python 버전 확인 (가급적 3.11 또는 3.12 권장)
python --version

# 3. 가상환경 생성
python -m venv .venv

# 4. 가상환경 활성화 (권한 오류 방지를 위해 ExecutionPolicy 설정 추가)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
.\.venv\Scripts\Activate.ps1

# 5. 최신 pip 업데이트 및 패키지 설치
python -m pip install --upgrade pip
pip install -r requirements.txt

# 6. 데이터 인저스션 실행 (한글 인코딩 방지를 위한 환경변수 설정 추가)
$env:PYTHONIOENCODING="utf-8"
python scripts\ingest.py

# 7. 백엔드 서버 실행
cd backend
python main.py          

<!-- 재시작시 -->
cd backend-python\py
.\.venv\Scripts\Activate.ps1
cd backend
python main.py

3번콘솔
스프링부트-백엔드
cd backend
.\gradlew bootRun

