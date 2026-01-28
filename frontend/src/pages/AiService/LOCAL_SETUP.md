# ⚡ AI Service 통합 실행 가이드

모든 명령어는 **프로젝트 최상위 폴더(safe-project)**에서 시작합니다.
터미널 3개를 열어서 각각 실행해주세요.

## 1. Frontend (5173) - 화면
최초 1회만 `install` 명령어가 필요합니다.
```powershell
cd frontend
npm install
npm install react-router-dom lucide-react zustand
npm run dev
```

## 2. Python AI (8000) - 두뇌
```powershell
cd backend-python\py
.\.venv\Scripts\Activate.ps1
cd backend
python main.py
```

## 3. Spring Boot (8081) - 다리(Bridge)
```powershell
cd backend
.\gradlew bootRun
```
