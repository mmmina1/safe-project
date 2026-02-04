from .repositories import BaseChatRepository
from .entities import ChatResult

# 사용자의 채팅 질문을 처리하는 핵심 비즈니스 로직
class GetChatAnswerUseCase:
    def __init__(self, repository: BaseChatRepository):
        self.repository = repository

    def execute(self, message: str, use_rag: bool = True) -> ChatResult:
        # 리포지토리를 호출하여 답변을 생성하고 반환함
        return self.repository.get_answer(message, use_rag)
