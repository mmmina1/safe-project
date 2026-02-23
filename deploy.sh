#!/bin/bash
# deploy.sh - EC2 서버에서 실행할 자동 배포 스크립트

# 1. 환경 변수 로드 (필요시)
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

echo "🚀 [1/4] AWS ECR 로그인..."
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 728276449447.dkr.ecr.ap-northeast-2.amazonaws.com

echo "📥 [2/4] 최신 이미지 다운로드 (Pulling)..."
docker compose pull

echo "🔄 [3/4] 컨테이너 재시작..."
docker compose up -d --remove-orphans

echo "🧹 [4/4] 미사용 이미지 정리..."
docker image prune -f

echo "✅ [SUCCESS] 배포가 완료되었습니다!"
