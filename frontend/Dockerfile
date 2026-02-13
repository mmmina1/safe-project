# 실행 스테이지: Nginx를 사용하여 정적 파일 서빙 (로컬 빌드 결과물 사용)
FROM nginx:stable-alpine

# 로컬에서 이미 빌드된 dist 폴더를 복사
COPY dist /usr/share/nginx/html

# Nginx 기본 설정 덮어쓰기 (SPA 라우팅 지원용)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
