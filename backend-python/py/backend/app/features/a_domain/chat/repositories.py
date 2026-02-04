from abc import ABC, abstractmethod
from .entities import ChatResult

# 채팅 데이터 처리를 위한 인터페이스
# 도메인 계층은 이 인터페이스에 의존하며, 실제 구현(MySQL, API 등)은 데이터 계층에서 담당합니다.
class BaseChatRepository(ABC):
    @abstractmethod
    def get_answer(self, message: str, use_rag: bool = True) -> ChatResult:
        """사용자 메시지에 대한 AI 답변을 가져오는 추상 메서드"""
        pass

