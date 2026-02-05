# MySQL 명령어 모음

## 데이터베이스 선택
```sql
USE safe_db;
```

---

## 1. users (회원 테이블)

### 테이블 구조 확인
```sql
DESCRIBE users;
SHOW CREATE TABLE users;
```

### 조회
```sql
-- 전체 조회
SELECT * FROM users;

-- 개수 확인
SELECT COUNT(*) FROM users;

-- 특정 회원 조회
SELECT * FROM users WHERE user_id = 1;
SELECT * FROM users WHERE email = 'test@example.com';

-- 상태별 조회
SELECT * FROM users WHERE status = 'ACTIVE';
SELECT * FROM users WHERE status = 'INACTIVE';

-- 역할별 조회
SELECT * FROM users WHERE role = 'USER';
SELECT * FROM users WHERE role = 'ADMIN';
```

### 삽입
```sql
INSERT INTO users (email, name, password_hash, status, role, created_date, updated_date)
VALUES ('test@example.com', '테스트', 'hashed_password', 'ACTIVE', 'USER', NOW(), NOW());
```

### 수정
```sql
-- 상태 변경
UPDATE users SET status = 'INACTIVE', updated_date = NOW() WHERE user_id = 1;

-- 프로필 이미지 업데이트
UPDATE users SET profile_image = 'url', updated_date = NOW() WHERE user_id = 1;

-- 마지막 로그인 시간 업데이트
UPDATE users SET last_login_at = NOW() WHERE user_id = 1;
```

### 삭제
```sql
-- 특정 회원 삭제
DELETE FROM users WHERE user_id = 1;

-- 전체 삭제
TRUNCATE TABLE users;
```

---

## 2. user_state (회원 상태 관리 테이블)

### 테이블 구조 확인
```sql
DESCRIBE user_state;
SHOW CREATE TABLE user_state;
```

### 조회
```sql
-- 전체 조회
SELECT * FROM user_state;

-- 특정 회원의 상태 조회
SELECT * FROM user_state WHERE user_id = 1;

-- 타입별 조회
SELECT * FROM user_state WHERE type = 'WARNING';
SELECT * FROM user_state WHERE type = 'SUSPENDED';
SELECT * FROM user_state WHERE type = 'BANNED';

-- 활성 상태 조회 (end_date가 NULL인 것)
SELECT * FROM user_state WHERE end_date IS NULL;
```

### 삽입
```sql
INSERT INTO user_state (user_id, admin_id, type, reason, state_date, created_date, updated_date)
VALUES (1, 1, 'WARNING', '경고 사유', NOW(), NOW(), NOW());
```
 
### 수정
```sql
-- 상태 해제 (end_date 설정)
UPDATE user_state SET end_date = NOW(), updated_date = NOW() WHERE state_id = 1;
```

### 삭제
```sql
-- 특정 상태 삭제
DELETE FROM user_state WHERE state_id = 1;
 
-- 특정 회원의 모든 상태 삭제
DELETE FROM user_state WHERE user_id = 1;

-- 전체 삭제
TRUNCATE TABLE user_state;
```

---

## 3. auth_accounts (인증 계정 테이블)

### 테이블 구조 확인
```sql
DESCRIBE auth_accounts;
SHOW CREATE TABLE auth_accounts;
```

### 조회
```sql
-- 전체 조회
SELECT * FROM auth_accounts;

-- 특정 회원의 인증 계정 조회
SELECT * FROM auth_accounts WHERE user_id = 1;

-- 프로바이더별 조회
SELECT * FROM auth_accounts WHERE provider = 'LOCAL';
SELECT * FROM auth_accounts WHERE provider = 'GOOGLE';
SELECT * FROM auth_accounts WHERE provider = 'KAKAO';
```

### 삽입
```sql
INSERT INTO auth_accounts (user_id, provider, provider_user_id, created_date)
VALUES (1, 'LOCAL', 'test@example.com', NOW());
```

### 수정
```sql
UPDATE auth_accounts SET provider_user_id = 'new_id' WHERE auth_id = 1;
```

### 삭제
```sql
-- 특정 인증 계정 삭제
DELETE FROM auth_accounts WHERE auth_id = 1;

-- 특정 회원의 모든 인증 계정 삭제
DELETE FROM auth_accounts WHERE user_id = 1;

-- 전체 삭제
TRUNCATE TABLE auth_accounts;
```

---

## 4. blacklist (블랙리스트 테이블)

### 테이블 구조 확인
```sql
DESCRIBE blacklist;
SHOW CREATE TABLE blacklist;
```

### 조회
```sql
-- 전체 조회
SELECT * FROM blacklist;

-- 활성 블랙리스트만 조회
SELECT * FROM blacklist WHERE is_active = 1;

-- 타입별 조회
SELECT * FROM blacklist WHERE type = 'PHONE';
SELECT * FROM blacklist WHERE type = 'URL';

-- 특정 값 조회
SELECT * FROM blacklist WHERE target_value = '010-1234-5678';
```

### 삽입
```sql
-- 전화번호 추가
INSERT INTO blacklist (target_value, type, report_count, voice_report_cnt, sms_report_cnt, is_active, created_date)
VALUES ('010-1234-5678', 'PHONE', 0, 0, 0, 1, NOW());

-- URL 추가
INSERT INTO blacklist (target_value, type, report_count, voice_report_cnt, sms_report_cnt, is_active, created_date)
VALUES ('https://malicious.com', 'URL', 0, 0, 0, 1, NOW());
```

### 수정
```sql
-- 활성/비활성 토글
UPDATE blacklist SET is_active = 0 WHERE blacklist_id = 1;

-- 신고 횟수 증가
UPDATE blacklist SET report_count = report_count + 1, last_reported_at = NOW() WHERE blacklist_id = 1;

-- 차단 사유 업데이트
UPDATE blacklist SET reason = '새로운 사유' WHERE blacklist_id = 1;
```

### 삭제
```sql
-- 특정 블랙리스트 삭제
DELETE FROM blacklist WHERE blacklist_id = 1;

-- 비활성 블랙리스트만 삭제
DELETE FROM blacklist WHERE is_active = 0;

-- 전체 삭제
TRUNCATE TABLE blacklist;
```

---

## 5. blacklist_history (블랙리스트 이력 테이블)

### 테이블 구조 확인
```sql
DESCRIBE blacklist_history;
SHOW CREATE TABLE blacklist_history;
```

### 조회
```sql
-- 전체 조회
SELECT * FROM blacklist_history;

-- 특정 블랙리스트의 이력 조회
SELECT * FROM blacklist_history WHERE blacklist_id = 1;

-- 액션 타입별 조회
SELECT * FROM blacklist_history WHERE action_type = 'CREATE';
SELECT * FROM blacklist_history WHERE action_type = 'UPDATE';
SELECT * FROM blacklist_history WHERE action_type = 'DELETE';
```

### 삽입
```sql
INSERT INTO blacklist_history (blacklist_id, action_type, admin_id, created_at)
VALUES (1, 'CREATE', 1, NOW());
```

### 삭제
```sql
-- 특정 이력 삭제
DELETE FROM blacklist_history WHERE history_id = 1;

-- 특정 블랙리스트의 모든 이력 삭제
DELETE FROM blacklist_history WHERE blacklist_id = 1;

-- 전체 삭제
TRUNCATE TABLE blacklist_history;
```

---

## 6. banners (배너 테이블)

### 테이블 구조 확인
```sql
DESCRIBE banners;
SHOW CREATE TABLE banners;
```

### 조회
```sql
-- 전체 조회
SELECT * FROM banners;

-- 활성 배너만 조회
SELECT * FROM banners WHERE is_active = 1;

-- 표시 순서대로 조회
SELECT * FROM banners ORDER BY display_order ASC;

-- 기간 내 활성 배너 조회
SELECT * FROM banners 
WHERE is_active = 1 
AND (start_at IS NULL OR start_at <= NOW())
AND (end_at IS NULL OR end_at >= NOW())
ORDER BY display_order ASC;
```

### 삽입
```sql
INSERT INTO banners (title, image_url, link_url, display_order, is_active, created_at, updated_at, start_at, end_at)
VALUES ('배너 제목', 'https://example.com/image.jpg', 'https://example.com', 1, 1, NOW(), NOW(), NOW(), NULL);
```

### 수정
```sql
-- 배너 정보 업데이트
UPDATE banners 
SET title = '새 제목', image_url = 'new_url', link_url = 'new_link', updated_at = NOW()
WHERE banner_id = 1;

-- 활성/비활성 토글
UPDATE banners SET is_active = 0, updated_at = NOW() WHERE banner_id = 1;

-- 표시 순서 변경
UPDATE banners SET display_order = 2, updated_at = NOW() WHERE banner_id = 1;
```

### 삭제
```sql
-- 특정 배너 삭제
DELETE FROM banners WHERE banner_id = 1;

-- 비활성 배너만 삭제
DELETE FROM banners WHERE is_active = 0;

-- 전체 삭제
TRUNCATE TABLE banners;
```

---

## 7. notices (공지사항 테이블)

### 테이블 구조 확인
```sql
DESCRIBE notices;
SHOW CREATE TABLE notices;
```

### 조회
```sql
-- 전체 조회
SELECT * FROM notices;

-- 활성 공지사항만 조회
SELECT * FROM notices WHERE is_active = 1;

-- 공개된 공지사항만 조회
SELECT * FROM notices WHERE published_yn = 1;

-- 타입별 조회
SELECT * FROM notices WHERE notice_type = 'GENERAL';
SELECT * FROM notices WHERE notice_type = 'IMPORTANT';

-- 공개되고 활성인 공지사항 조회
SELECT * FROM notices WHERE published_yn = 1 AND is_active = 1 ORDER BY created_at DESC;
```

### 삽입
```sql
INSERT INTO notices (notice_type, title, content, published_yn, is_active, created_at)
VALUES ('GENERAL', '공지 제목', '공지 내용', 1, 1, NOW());
```

### 수정
```sql
-- 공지사항 업데이트
UPDATE notices 
SET title = '새 제목', content = '새 내용', notice_type = 'IMPORTANT'
WHERE notice_id = 1;

-- 활성/비활성 토글
UPDATE notices SET is_active = 0 WHERE notice_id = 1;

-- 공개/비공개 토글
UPDATE notices SET published_yn = 0 WHERE notice_id = 1;
```

### 삭제
```sql
-- 특정 공지사항 삭제
DELETE FROM notices WHERE notice_id = 1;

-- 비활성 공지사항만 삭제
DELETE FROM notices WHERE is_active = 0;

-- 전체 삭제
TRUNCATE TABLE notices;
```

---

## 8. BLIND_REASONS (블라인드 사유 테이블)

### 테이블 구조 확인
```sql
DESCRIBE BLIND_REASONS;
SHOW CREATE TABLE BLIND_REASONS;
```

### 조회
```sql
-- 전체 조회
SELECT * FROM BLIND_REASONS;

-- 활성 사유만 조회
SELECT * FROM BLIND_REASONS WHERE is_active = 1;

-- 특정 사유 조회
SELECT * FROM BLIND_REASONS WHERE reason_id = 1;
```

### 삽입
```sql
INSERT INTO BLIND_REASONS (reason_name, is_active, created_at)
VALUES ('부적절한 내용', 1, NOW());
```

### 수정
```sql
-- 사유명 변경
UPDATE BLIND_REASONS SET reason_name = '새 사유명' WHERE reason_id = 1;

-- 활성/비활성 토글
UPDATE BLIND_REASONS SET is_active = 0 WHERE reason_id = 1;
```

### 삭제
```sql
-- 특정 사유 삭제
DELETE FROM BLIND_REASONS WHERE reason_id = 1;

-- 비활성 사유만 삭제
DELETE FROM BLIND_REASONS WHERE is_active = 0;

-- 전체 삭제
TRUNCATE TABLE BLIND_REASONS;
```

---

## 9. service_products (서비스 상품 테이블)

### 테이블 구조 확인
```sql
DESCRIBE service_products;
SHOW CREATE TABLE service_products;
```

### 조회
```sql
-- 전체 조회
SELECT * FROM service_products;

-- 활성 상품만 조회
SELECT * FROM service_products WHERE is_active = 1;

-- 가격 타입별 조회
SELECT * FROM service_products WHERE price_type = 'FREE';
SELECT * FROM service_products WHERE price_type = 'PAID';

-- 상태별 조회
SELECT * FROM service_products WHERE status = '판매중';
```

### 삽입
```sql
INSERT INTO service_products (name, base_category_id, price_type, main_image, summary, description, status, is_active, created_date, updated_date)
VALUES ('상품명', 1, 'FREE', 'image_url', '요약', '상세 설명', '판매중', 1, NOW(), NOW());
```

### 수정
```sql
-- 상품 정보 업데이트
UPDATE service_products 
SET name = '새 상품명', price_type = 'PAID', summary = '새 요약', description = '새 설명', updated_date = NOW()
WHERE product_id = 1;

-- 활성/비활성 토글
UPDATE service_products SET is_active = 0, updated_date = NOW() WHERE product_id = 1;

-- 상태 변경
UPDATE service_products SET status = '판매중지', updated_date = NOW() WHERE product_id = 1;
```

### 삭제
```sql
-- 특정 상품 삭제
DELETE FROM service_products WHERE product_id = 1;

-- 비활성 상품만 삭제
DELETE FROM service_products WHERE is_active = 0;

-- 전체 삭제
TRUNCATE TABLE service_products;
```

---

## 10. post_reports (게시글 신고 테이블)

### 테이블 구조 확인
```sql
DESCRIBE post_reports;
SHOW CREATE TABLE post_reports;
```

### 조회
```sql
-- 전체 조회
SELECT * FROM post_reports;

-- 상태별 조회
SELECT * FROM post_reports WHERE status = '접수';
SELECT * FROM post_reports WHERE status = '반려';
SELECT * FROM post_reports WHERE status = '처리완료';

-- 특정 게시글의 신고 조회
SELECT * FROM post_reports WHERE post_id = 1;

-- 미처리 신고만 조회
SELECT * FROM post_reports WHERE status = '접수';
```

### 삽입
```sql
INSERT INTO post_reports (post_id, reporter_id, reason, status, created_at)
VALUES (1, 1, '신고 사유', '접수', NOW());
```

### 수정
```sql
-- 승인 처리
UPDATE post_reports 
SET status = '처리완료', admin_id = 1, processed_at = NOW()
WHERE report_id = 1;

-- 반려 처리
UPDATE post_reports 
SET status = '반려', admin_id = 1, processed_at = NOW()
WHERE report_id = 1;
```

### 삭제
```sql
-- 특정 신고 삭제
DELETE FROM post_reports WHERE report_id = 1;

-- 처리완료된 신고만 삭제
DELETE FROM post_reports WHERE status = '처리완료';

-- 전체 삭제
TRUNCATE TABLE post_reports;
```

---

## 11. cs_consultations (고객지원 상담 테이블)

### 테이블 구조 확인
```sql
DESCRIBE cs_consultations;
SHOW CREATE TABLE cs_consultations;
```

### 조회
```sql
-- 전체 조회
SELECT * FROM cs_consultations;

-- 상태별 조회
SELECT * FROM cs_consultations WHERE status = 'PENDING';
SELECT * FROM cs_consultations WHERE status = 'IN_PROGRESS';
SELECT * FROM cs_consultations WHERE status = 'COMPLETED';

-- 특정 회원의 상담 조회
SELECT * FROM cs_consultations WHERE user_id = 1;

-- 특정 상담원의 상담 조회
SELECT * FROM cs_consultations WHERE admin_id = 1;

-- 미배정 상담 조회
SELECT * FROM cs_consultations WHERE admin_id IS NULL;
```

### 삽입
```sql
INSERT INTO cs_consultations (user_id, status, created_at, updated_at)
VALUES (1, 'PENDING', NOW(), NOW());
```

### 수정
```sql
-- 상담원 배정
UPDATE cs_consultations 
SET admin_id = 1, status = 'IN_PROGRESS', updated_at = NOW()
WHERE consultation_id = 1;

-- 메모 업데이트
UPDATE cs_consultations 
SET memo = '상담 메모 내용', updated_at = NOW()
WHERE consultation_id = 1;

-- 완료 처리
UPDATE cs_consultations 
SET status = 'COMPLETED', updated_at = NOW()
WHERE consultation_id = 1;
```

### 삭제
```sql
-- 특정 상담 삭제
DELETE FROM cs_consultations WHERE consultation_id = 1;

-- 완료된 상담만 삭제
DELETE FROM cs_consultations WHERE status = 'COMPLETED';

-- 전체 삭제
TRUNCATE TABLE cs_consultations;
```

---

## 전체 테이블 일괄 작업

### 모든 테이블 목록 확인
```sql
SHOW TABLES;
```

### 모든 테이블의 데이터 개수 확인
```sql
SELECT 
    'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'user_state', COUNT(*) FROM user_state
UNION ALL
SELECT 'auth_accounts', COUNT(*) FROM auth_accounts
UNION ALL
SELECT 'blacklist', COUNT(*) FROM blacklist
UNION ALL
SELECT 'blacklist_history', COUNT(*) FROM blacklist_history
UNION ALL
SELECT 'banners', COUNT(*) FROM banners
UNION ALL
SELECT 'notices', COUNT(*) FROM notices
UNION ALL
SELECT 'BLIND_REASONS', COUNT(*) FROM BLIND_REASONS
UNION ALL
SELECT 'service_products', COUNT(*) FROM service_products
UNION ALL
SELECT 'post_reports', COUNT(*) FROM post_reports
UNION ALL
SELECT 'cs_consultations', COUNT(*) FROM cs_consultations;
```

### 모든 테이블 전체 삭제 (주의!)
```sql
-- 순서 중요: 외래키 관계 고려
TRUNCATE TABLE cs_consultations;
TRUNCATE TABLE post_reports;
TRUNCATE TABLE service_products;
TRUNCATE TABLE BLIND_REASONS;
TRUNCATE TABLE notices;
TRUNCATE TABLE banners;
TRUNCATE TABLE blacklist_history;
TRUNCATE TABLE blacklist;
TRUNCATE TABLE auth_accounts;
TRUNCATE TABLE user_state;
TRUNCATE TABLE users;
```

---

## 유용한 쿼리 모음

### 최근 생성된 데이터 조회 (각 테이블별)
```sql
-- 최근 회원 10명
SELECT * FROM users ORDER BY created_date DESC LIMIT 10;

-- 최근 상담 10건
SELECT * FROM cs_consultations ORDER BY created_at DESC LIMIT 10;

-- 최근 신고 10건
SELECT * FROM post_reports ORDER BY created_at DESC LIMIT 10;
```

### 통계 쿼리
```sql
-- 활성 회원 수
SELECT COUNT(*) FROM users WHERE status = 'ACTIVE';

-- 진행중인 상담 수
SELECT COUNT(*) FROM cs_consultations WHERE status = 'IN_PROGRESS';

-- 미처리 신고 수
SELECT COUNT(*) FROM post_reports WHERE status = '접수';

-- 활성 배너 수
SELECT COUNT(*) FROM banners WHERE is_active = 1;
```
