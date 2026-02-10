# 🚀 실행 가이드

1번콘솔
리액트-프론트엔드
<!-- 첫 실행시 -->
cd frontend
npm install
npm install react-router-dom react-bootstrap bootstrap react-icons lucide-react zustand axios @tanstack/react-query react-hook-form recharts chart.js react-chartjs-2 react-unity-webgl react-leaflet @tosspayments/tosspayments-sdk @tosspayments/payment-widget-sdk
npm run dev

<!-- 재시작시 -->
cd frontend
npm run dev

---

2번콘솔
스프링부트-백엔드

<!-- 첫 실행, 재 실행 시 -->
cd backend
.\gradlew bootRun


3번콘솔
파이썬-백엔드

# 도커로 실행


<!-- 첫 실행시 -->
```powershell
docker-compose up --build
```

<!-- 재시작시 -->
```powershell
docker-compose up
```

- 접속 주소: [http://localhost:8000/docs](http://localhost:8000/docs)


<!-- 벡터db 업데이트 -->
```powershell

docker exec -it safe-python-backend python scripts/ingest.py
```


---

# 터미널에서 실행 (파이썬 3.12)

<!-- 첫 실행 시 -->
```powershell
cd backend-python\py
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python scripts\ingest.py
python backend\main.py
```

<!-- 재시작 시 -->
```powershell
cd backend-python\py
.\.venv\Scripts\Activate.ps1
python backend\main.py
```

<!-- 벡터 DB 업데이트 -->
```powershell
cd backend-python\py
.\.venv\Scripts\Activate.ps1
python scripts\ingest.py
```



---
