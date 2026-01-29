# 실행 가이드

## 빠른 시작

이 프로젝트는 3개의 서버로 구성되어 있습니다:
- **React Frontend** (포트 5173)
- **Java Spring Boot Backend** (포트 8080)
- **Python FastAPI AI Backend** (포트 8000)

```bash
# 프로젝트 루트에서 실행
docker-compose up -d

# 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs -f
```

### 2. 백엔드 실행

```bash
cd backend

# Windows
gradlew.bat bootRun

브라우저에서 접속:
```
http://localhost:8080/api/test
```

또는 IDE에서 `BackendApplication.java` 실행

**확인**: `http://localhost:8080` 접속 가능한지 확인

### 3. 프론트엔드 실행

```bash
cd frontend

# 의존성 설치 (최초 1회)
npm install

# 개발 서버 실행
npm run dev
```

**확인**: `http://localhost:5173` 접속 가능한지 확인

## 환경별 설정

### 로컬 개발 (기본)
- MySQL: `localhost:3306`
- Redis: `localhost:6379`
- 프로파일: `local`

### 개발 서버
```bash
export SPRING_PROFILES_ACTIVE=dev
```

- MySQL: `3.39.143.83:3306`
- 프로파일: `dev`

## 문제 해결

### MySQL 연결 실패
1. Docker 컨테이너가 실행 중인지 확인
   ```bash
   docker-compose ps
   ```

2. 포트 충돌 확인
   ```bash
   # Windows
   netstat -ano | findstr :3306
   
   # Linux/Mac
   lsof -i :3306
   ```

3. 컨테이너 재시작
   ```bash
   docker-compose restart mysql
   ```

### Redis 연결 실패
1. Redis 컨테이너 확인
   ```bash
   docker-compose logs redis
   ```

2. Redis 클라이언트로 테스트
   ```bash
   docker exec -it safe-redis redis-cli ping
   # 응답: PONG
   ```

### 포트 충돌
- MySQL: 3306 포트 사용 중이면 `docker-compose.yml`에서 포트 변경
- Redis: 6379 포트 사용 중이면 `docker-compose.yml`에서 포트 변경
- 백엔드: 8080 포트 사용 중이면 `application.yml`에서 변경

## 데이터베이스 초기화

### 테이블 자동 생성 (개발용)
`application.yml`에서:
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update
```

### 수동 SQL 실행
```bash
# MySQL 컨테이너 접속
docker exec -it safe-mysql mysql -u safe_user -psafe1234 safe_db

# SQL 파일 실행
docker exec -i safe-mysql mysql -u safe_user -psafe1234 safe_db < schema.sql
```

## 관리자 페이지 접속

1. 프론트엔드 실행 후: `http://localhost:5173/admin`
2. 로그인 필요 시 인증 구현 필요

## API 테스트

```
React (5173) → Spring Boot (8080) → Python (8000) → OpenAI API
                      ↓
                  MySQL DB
```

---

## 🧪 AI 챗봇 테스트

1. **모든 서버 실행 확인**
   - Spring Boot: http://localhost:8080/api/test
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
netstat -ano | findstr :8080
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
