# MySQL 사용 정리 (Risk Watch 프로젝트)

## 1. 연결 정보

| 환경 | 호스트 | 포트 | DB 이름 | 사용자 | 비밀번호 |
|------|--------|------|---------|--------|----------|
| **dev** (원격, 기본) | 3.39.143.83 | 3306 | safe_db | admin | safe1234 |
| **local** (Docker) | localhost | 3306 | safe_db | safe_user | safe1234 |
| **root** (Docker만) | localhost | 3306 | - | root | root1234 |

- 현재 기본 프로파일: `dev` → 원격 DB(3.39.143.83) 사용
- 로컬 Docker 사용 시: `--spring.profiles.active=local` 또는 `application-local.properties` 설정 필요

---

## 2. MySQL 클라이언트로 접속

### 원격(dev) DB 접속
```bash
mysql -h 3.39.143.83 -P 3306 -u admin -psafe1234 safe_db
```

### 로컬 Docker MySQL 접속
```bash
# 컨테이너 안에서 mysql 실행
docker exec -it safe-mysql mysql -u safe_user -psafe1234 safe_db

# root로 접속
docker exec -it safe-mysql mysql -u root -proot1234 safe_db
```

### 접속 후 기본 명령
```sql
-- DB 선택 (이미 접속 시 safe_db면 생략 가능)
USE safe_db;

-- 테이블 목록
SHOW TABLES;

-- 테이블 구조
DESCRIBE users;
SHOW CREATE TABLE users;
```

---

## 3. 자주 쓰는 명령어

### DB/테이블 확인
```sql
SHOW DATABASES;
USE safe_db;
SHOW TABLES;
SHOW TABLE STATUS;
```

### 조회 (SELECT)
```sql
-- 회원 수
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM users WHERE status = 'ACTIVE';

-- 회원 목록 (일부 컬럼)
SELECT user_id, email, name, status, created_at FROM users LIMIT 10;

-- 공지 목록
SELECT * FROM notices ORDER BY notice_id DESC LIMIT 10;

-- 서비스 상품
SELECT * FROM service_products;
```

### 데이터 수정 (주의: 운영 DB에서는 신중히)
```sql
-- 특정 회원 상태 변경
UPDATE users SET status = 'ACTIVE' WHERE user_id = 1;

-- 공지 노출 끄기
UPDATE notices SET is_active = 0 WHERE notice_id = 1;
```

### 백업/복원 (로컬 예시)
```bash
# Docker MySQL 덤프
docker exec safe-mysql mysqldump -u safe_user -psafe1234 safe_db > backup.sql

# 복원
docker exec -i safe-mysql mysql -u safe_user -psafe1234 safe_db < backup.sql
```

---

## 4. 프로젝트에서 쓰는 테이블 (JPA 엔티티 기준)

| 테이블명 | 설명 |
|----------|------|
| users | 회원 |
| user_state | 회원 상태 이력(경고/정지/밴) |
| auth_accounts | 로그인 계정(연동) |
| notices | 공지사항 |
| banners | 배너 |
| blacklist | 블랙리스트 |
| blacklist_history | 블랙리스트 변경 이력 |
| service_products | 서비스 상품 |
| cs_consultations | 고객상담 |
| post_reports | 게시글 신고 |
| BLIND_REASONS | 블라인드 사유 |

테이블 구조는 `spring.jpa.hibernate.ddl-auto=update` 로 앱 실행 시 맞춰지며, 컬럼 추가/변경은 엔티티 수정 후 재실행하면 반영된다.

---

## 5. 참고

- **문자셋**: UTF-8(utf8mb4) 사용
- **타임존**: dev는 `serverTimezone=Asia/Seoul` 또는 UTC, 로컬은 `TZ=Asia/Seoul`
- **비밀번호**: 위 값들은 개발용이며, 운영 환경에서는 반드시 변경할 것
