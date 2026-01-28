from ..domain.repositories import BaseChatRepository
from ..domain.entities import ChatResult
from .sources import chat_source

# 도메인 인터페이스의 실제 구현체
# 데이터 소스(sources.py)를 호출하여 최종 답변을 생성하는 책임이 있습니다.
class ChatRepositoryImpl(BaseChatRepository):
    def get_answer(self, message: str, use_rag: bool = True) -> ChatResult:
        # AI 데이터 소스에서 응답을 생성하여 반환함
        return chat_source.get_response(message, use_rag)

