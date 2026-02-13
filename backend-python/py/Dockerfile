# 1. 빌드 스테이지
FROM python:3.12-slim AS builder
WORKDIR /app

# 시스템 의존성 설치
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 의존성 설치 최적화 (CPU 전용 torch 사용으로 용량 절감)
COPY requirements.txt .
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements.txt

# 2. 실행 스테이지
FROM python:3.12-slim
WORKDIR /app
ENV PYTHONPATH=/app/backend
ENV PYTHONIOENCODING=utf-8

# 필수 시스템 패키지만 복사 (필요한 경우)
# builder에서 설치된 패키지 복사
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# 소스 코드 복사 (정적 이미지용)
COPY . .

# 포트 노출
EXPOSE 8000

# 실행 명령
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
