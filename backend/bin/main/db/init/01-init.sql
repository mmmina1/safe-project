-- MySQL 초기 설정
-- UTF-8 인코딩 설정
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- 데이터베이스 생성 (이미 존재하면 무시)
CREATE DATABASE IF NOT EXISTS safe_db 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE safe_db;

-- 사용자 권한 설정 (이미 docker-compose에서 생성됨)
-- 필요시 추가 권한 부여
