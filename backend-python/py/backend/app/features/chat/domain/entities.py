from pydantic import BaseModel
from typing import List, Optional

# 채팅 출처 정보를 담는 클래스
class ChatSource(BaseModel):
    content: str      # 인용 문구 내용
    source: Optional[str] # 출처 파일명 (예: 가이드라인.pdf)

# AI 채팅 결과를 담는 핵심 도메인 모델
class ChatResult(BaseModel):
    answer: str       # AI의 최종 답변
    sources: List[ChatSource] # 답변의 근거가 된 출처 목록
    mode: str         # 실행 모드 (RAG, Pure-LLM 등)
