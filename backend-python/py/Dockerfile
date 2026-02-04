# 1. 베이스 이미지 설정 (가볍고 안정적인 3.12-slim 사용)
FROM python:3.12-slim

# 2. 작업 디렉토리 설정
WORKDIR /app
ENV PYTHONPATH=/app/backend

# 3. 시스템 의존성 설치 (필요한 경우)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 4. 의존성 파일 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. 소스 코드 복사 (개발 시에는 볼륨 마운트로 덮어씌워짐)
COPY . .

# 6. 포트 노출
EXPOSE 8000

# 7. 실행 명령 (uvicorn 사용, hot-reload 모드 활성화 가능)
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
