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

