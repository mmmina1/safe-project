# ============================================================
# 1. 임포트 구역 (라이브러리 및 모듈 로드)
# ============================================================
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Feature Routers: 각 기능을 독립된 모듈로 관리
from app.features.diagnosis.presentation.router import router as diagnosis_router
from app.features.chat.presentation.router import router as chat_router
# 이 아래에 모듈들을 더 추가할수 있음 추가시에 저 아래에 라우터 등록도 해야함

# ============================================================
# 2. 함수 정의 구역 (실행은 나중에)
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    애플리케이션 수명 주기 관리
    - yield 위: 서버 시작 시 실행 (DB 연결, AI 모델 로드 등)
    - yield 아래: 서버 종료 시 실행 (연결 정리, 로그 저장 등)
    """
    # Startup Logic
    print("🚀 Phishing Prevention System starting...")
    yield
    # Shutdown Logic
    print("🛑 Shutting down...")


def health_check():
    """서버 상태 확인용 헬스 체크 엔드포인트"""
    return {
        "status": "ok", 
        "architecture": "Clean Architecture (LINE Tech Blog Standard)",
        "message": "The server is running normally."
    }


# ============================================================
# 3. 즉시 실행 구역 (서버 설정)
# ============================================================

# 환경 변수 로드 (.env 파일에서 API 키 등을 불러옴)
load_dotenv()

# FastAPI 앱 객체 생성
app = FastAPI(
    lifespan=lifespan,  # 수명 주기 함수 등록
    title="PhishShield AI API",
    description="Clean Architecture based API for Phishing Prevention"
)

# CORS 설정: 프론트엔드(리액트)와 백엔드 간 통신 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # 모든 출처 허용 (운영 시에는 특정 도메인만 허용 권장)
    allow_credentials=True,
    allow_methods=["*"],      # GET, POST 등 모든 HTTP 메서드 허용
    allow_headers=["*"],
)

# 기능별 라우터 등록
app.include_router(diagnosis_router)  # /diagnosis 경로 활성화
app.include_router(chat_router)       # /chat 경로 활성화
# 이 아래에 라우터 등록을 더 추가할 수 있음


# 헬스 체크 엔드포인트 등록
app.get("/health")(health_check)


# ============================================================
# 4. 서버 실행 구역 (직접 실행 시에만)
# ============================================================

if __name__ == "__main__":
    import uvicorn
    
    print("\n" + "="*50)
    print("📢 [Main Service] Starting modular Phishing Prevention API...")
    print(f"🔗 Swagger UI: http://127.0.0.1:8000/docs")
    print("="*50 + "\n")
    
    # 서버 시작 (8000번 포트에서 대기)
    uvicorn.run(app, host="127.0.0.1", port=8000)
