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


이 밑에만 추가

## 🐳 도커 통합 실행 가이드 (Docker Compose)
이 방식은 프론트엔드, 자바 백엔드, 파이썬 백엔드, 레디스를 한꺼번에 묶어서 실행합니다.

### 1. 사전 준비 (중요)
도커 빌드 성능 최적화를 위해 프론트엔드는 로컬에서 미리 빌드된 결과물을 사용합니다.
```powershell
cd frontend
npm run build
cd ..
```

### 2. 프로젝트 통합 가동
프로젝트 최상위 루트 폴더에서 아래 명령어를 입력합니다.
```powershell
docker-compose up -d --build
```
- **-d**: 서버를 백그라운드 모드로 실행합니다.
- **--build**: 소스 코드나 설정 변경 시 이미지를 다시 굽습니다.

### 3. 각 서비스 접속 주소
- **메인 웹 페이지 (React)**: [http://localhost](http://localhost)
- **자바 백엔드 (Spring)**: [http://localhost:8080](http://localhost:8080)
- **파이썬 AI 엔진 (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 4. 유용한 명령어
- **전체 상태 확인**: `docker-compose ps`
- **특정 서버 로그 보기**: `docker-compose logs -f [서비스명]` (예: `java-backend`)
- **전체 종료**: `docker-compose down`

---
> [!TIP]
> **Docker Desktop** 프로그램을 실행하면 **[Containers]** 탭에서 터미널 없이 마우스 클릭만으로 모든 서비스를 관리(시작/정지/로그 확인)할 수 있습니다.
