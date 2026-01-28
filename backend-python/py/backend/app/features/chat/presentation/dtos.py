from pydantic import BaseModel
from typing import List, Optional

# 프론트엔드에서 보내오는 채팅 요청 형식 정의
class ChatRequestDTO(BaseModel):
    message: str                      # 사용자 메시지
    session_id: str = "default_session" # 세션 식별 아이디
    use_rag: bool = True              # RAG 방식 사용 여부 선택

# 답변 근거 정보를 담는 DTO
class ChatSourceDTO(BaseModel):
    content: str                      # 인용 문구
    source: Optional[str]              # 파일 이름

# 프론트엔드로 보내는 최종 응답 형식 정의
class ChatResponseDTO(BaseModel):
    answer: str                       # AI 답변 내용
    sources: List[ChatSourceDTO]       # 답변 근거 목록
    mode: str                         # 처리 모드 (RAG/GPT)
