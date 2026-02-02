# VSCode에서 MySQL 연결하기

## 1. MySQL 확장 프로그램 설치

VSCode에서 다음 확장 프로그램을 설치하세요:

1. **MySQL Client** (cweijan.vscode-mysql-client2)
   - VSCode 확장 프로그램 마켓플레이스에서 "MySQL Client" 검색
   - 또는 `Ctrl+Shift+X` → "MySQL Client" 검색 → 설치

## 2. Docker로 MySQL 실행

터미널에서 프로젝트 루트로 이동 후:

```bash
docker-compose up -d
```

MySQL 컨테이너가 실행되었는지 확인:

```bash
docker-compose ps
```

## 3. VSCode에서 MySQL 연결

### 방법 1: 확장 프로그램 사용

1. VSCode 왼쪽 사이드바에서 **MySQL** 아이콘 클릭
2. **"+"** 버튼 클릭하여 새 연결 추가
3. 다음 정보 입력:

```
Host: localhost
Port: 3306
User: safe_user
Password: safe1234
Database: safe_db
```

4. **Connect** 클릭

### 방법 2: 설정 파일 사용 (이미 준비됨)

`.vscode/settings.json` 파일에 연결 정보가 이미 설정되어 있습니다.

1. VSCode에서 `Ctrl+Shift+P` (또는 `Cmd+Shift+P` on Mac)
2. "MySQL: Connect" 입력
3. "Safe Project - Local MySQL" 선택

## 4. 연결 확인

연결이 성공하면:

1. 왼쪽 사이드바에서 MySQL 아이콘 클릭
2. `safe_db` 데이터베이스가 보임
3. 테이블 목록 확인 가능

## 5. SQL 쿼리 실행

1. MySQL 확장 프로그램에서 데이터베이스 선택
2. 테이블 우클릭 → "Open Table" 또는 "Query Table"
3. SQL 쿼리 작성 후 실행

또는 새 SQL 파일 생성:

1. `Ctrl+N`으로 새 파일 생성
2. 파일 확장자를 `.sql`로 저장
3. SQL 쿼리 작성
4. `Ctrl+Shift+E`로 쿼리 실행

## 6. 유용한 SQL 쿼리 예시

```sql
-- 데이터베이스 목록 확인
SHOW DATABASES;

-- 현재 데이터베이스의 테이블 목록 확인
SHOW TABLES;

-- users 테이블 구조 확인
DESCRIBE users;

-- users 테이블 데이터 조회
SELECT * FROM users LIMIT 10;

-- 테이블 생성 확인
SELECT COUNT(*) FROM users;
```

## 문제 해결

### 연결 실패 시

1. **Docker 컨테이너 확인**
   ```bash
   docker-compose ps
   docker-compose logs mysql
   ```

2. **포트 확인**
   - MySQL이 3306 포트에서 실행 중인지 확인
   - 다른 MySQL 인스턴스가 실행 중이 아닌지 확인

3. **방화벽 확인**
   - Windows 방화벽이 3306 포트를 차단하지 않는지 확인

### 권한 오류 시

```bash
# MySQL 컨테이너 접속
docker exec -it safe-mysql mysql -u root -proot1234

# 사용자 권한 확인
SELECT user, host FROM mysql.user WHERE user='safe_user';

# 필요시 권한 부여
GRANT ALL PRIVILEGES ON safe_db.* TO 'safe_user'@'%';
FLUSH PRIVILEGES;
```

## 추가 팁

### 데이터베이스 스키마 시각화

VSCode MySQL 확장 프로그램에서:
- 테이블 우클릭 → "Show Create Table" - 테이블 생성 SQL 확인
- 데이터베이스 우클릭 → "Export Database" - 스키마 내보내기

### SQL 포맷팅

VSCode에서 SQL 파일을 열면 자동으로 포맷팅됩니다.
- `Shift+Alt+F` - 포맷팅

### 자동 완성

MySQL 확장 프로그램이 테이블명, 컬럼명 자동 완성을 지원합니다.
