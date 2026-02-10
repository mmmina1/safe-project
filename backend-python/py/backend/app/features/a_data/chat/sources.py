import os
from app.core.ai.engine import AIEngine
from app.features.a_domain.chat.entities import ChatResult, ChatSource

class LLMChatSource:
    def __init__(self):
        # 이제 복잡한 로직은 AIEngine이 담당합니다.
        self.engine = AIEngine("chat")

    def get_response(self, message: str, use_rag: bool) -> ChatResult:
        try:
            answer = self.engine.get_answer(message, use_rag=use_rag)
            
            # 소스 정보 추출
            sources = []
            if use_rag:
                docs = self.engine.get_sources(message)
                sources = [ChatSource(content=d.page_content[:100], source=d.metadata.get("source")) for d in docs]
            
            # 모드 판단 (엔진 내부 로직에 맞춤)
            mode = "RAG" if use_rag else "Pure-LLM"
            if "에러 발생" in answer: mode = "Error"

            return ChatResult(answer=answer, sources=sources, mode=mode)
        except Exception as e:
            return ChatResult(answer=f"⚠️ 에러: {str(e)}", sources=[], mode="Error")

chat_source = LLMChatSource()

