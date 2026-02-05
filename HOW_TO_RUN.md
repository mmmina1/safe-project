# 실행 가이드

## 빠른 시작

### 1. Docker로 MySQL + Redis 실행

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

# Linux/Mac
./gradlew bootRun
```

또는 IDE에서 `BackendApplication.java` 실행

**확인**: `http://localhost:8081` 접속 가능한지 확인

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
- 백엔드: 8081 포트 사용 중이면 `application.yml`에서 변경

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

### Postman / curl 예시
```bash
# 회원 검색
curl http://localhost:8081/api/admin/users/search?keyword=test

# 블라인드 사유 목록
curl http://localhost:8081/api/admin/blind-reasons
```
