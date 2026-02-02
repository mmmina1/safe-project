# 🚀 실행 가이드

<<<<<<< HEAD
=======
1번콘솔
cd frontend
npm run dev

2번콘솔
cd backend-python\py
.\.venv\Scripts\Activate.ps1
cd backend
python main.py

3번콘솔
cd backend
.\gradlew bootRun


>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534
## 📋 개요

이 프로젝트는 3개의 서버로 구성되어 있습니다:
- **React Frontend** (포트 5173)
- **Java Spring Boot Backend** (포트 8081)
- **Python FastAPI AI Backend** (포트 8000)

---

## 1️⃣ Spring Boot 백엔드 실행

### **방법 1: Gradle 사용 (권장)**

```powershell
cd E:\safe\safe-project\backend
.\gradlew.bat bootRun
```

### **방법 2: IntelliJ IDEA**

1. `backend` 폴더를 IntelliJ에서 열기
2. `src/main/java/com/safe/backend/BackendApplication.java` 파일 우클릭
3. **Run 'BackendApplication'** 클릭

### **확인**

브라우저에서 접속:
```
http://localhost:8081/api/test
```

응답: `스프링이랑 연결 성공했다!`

---

## 2️⃣ React 프론트엔드 실행

### **실행 명령어**

```powershell
cd E:\safe\safe-project\frontend-ex\frontend-react
npm run dev
```

### **확인**

브라우저에서 접속:
```
http://localhost:5173
```

React 앱이 열립니다.

---

## 3️⃣ Python AI 백엔드 실행 (선택사항)

AI 챗봇 기능을 사용하려면 Python 서버도 실행해야 합니다.

### **PyCharm 사용**

1. PyCharm에서 `backend-python/py` 폴더 열기
2. `backend/main.py` 파일 우클릭
3. **Run 'main'** 클릭

### **터미널 사용**

```powershell
cd E:\safe\safe-project\backend-python\py\backend
python main.py
```

### **확인**

브라우저에서 접속:
```
http://localhost:8000/health
```

응답: `{"status":"ok",...}`

---

## 🔗 전체 통신 흐름

```
React (5173) → Spring Boot (8081) → Python (8000) → OpenAI API
                      ↓
                  MySQL DB
```

---

## 🧪 AI 챗봇 테스트

1. **모든 서버 실행 확인**
   - Spring Boot: http://localhost:8081/api/test
   - Python: http://localhost:8000/health
   - React: http://localhost:5173

2. **브라우저에서 테스트**
   - `http://localhost:5173` 접속
   - 상단 메뉴에서 **Chatbot** 클릭
   - 메시지 입력 ("안녕하세요") → 전송
   - AI 응답 확인

---

## ⚠️ 문제 해결

### **포트 충돌**
```powershell
# 포트 사용 중인 프로세스 확인
netstat -ano | findstr :8081
netstat -ano | findstr :8000
netstat -ano | findstr :5173

# 프로세스 종료 (PID는 위 명령어로 확인)
taskkill /PID <PID> /F
```

### **Java 서버 종료**
```powershell
Get-Process | Where-Object {$_.ProcessName -eq "java"} | Stop-Process -Force
```

### **Python 서버 종료**
```powershell
Get-Process | Where-Object {$_.ProcessName -eq "python"} | Stop-Process -Force
```

### **React 서버 종료**
터미널에서 `Ctrl + C`

---

## 📁 프로젝트 구조

```
E:\safe\safe-project\
├── backend\                    # Spring Boot 백엔드
│   ├── src\
│   │   └── main\
│   │       ├── java\
│   │       └── resources\
│   └── build.gradle
│
├── backend-python\py\          # Python AI 백엔드
│   ├── backend\
│   │   └── main.py
│   ├── requirements.txt
│   └── .venv\
│
└── frontend-ex\frontend-react\ # React 프론트엔드
    ├── src\
    ├── package.json
    └── vite.config.js
```
