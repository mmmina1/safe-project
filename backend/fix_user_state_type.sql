-- user_state 테이블의 type 컬럼 길이를 늘리는 SQL
-- MySQL에서 실행하세요

ALTER TABLE user_state MODIFY COLUMN type VARCHAR(50) NOT NULL;
