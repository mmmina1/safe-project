# 🚀 실행 가이드

1번콘솔
리액트-프론트엔드
<!-- 첫 실행시 -->
cd frontend
npm install
npm install react-router-dom lucide-react zustand @tosspayments/tosspayments-sdk chart.js react-chartjs-2
npm run dev

<!-- 재시작시 -->
cd frontend
npm run dev

2번콘솔
파이썬-백엔드
<!-- 첫 실행시 -->
cd backend-python\py
python -m venv .venv              
.\.venv\Scripts\Activate.ps1       
pip install -r requirements.txt   
python scripts\ingest.py
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

