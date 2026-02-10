from fastapi import APIRouter
from .dtos import ChatRequestDTO, ChatResponseDTO
from ..domain.usecases import GetChatAnswerUseCase
from ..data.repositories import ChatRepositoryImpl

# API 입구(/chat)를 정의하는 라우터
router = APIRouter(tags=["AI Chatbot"])

# 의존성 주입 (필요한 도구들을 조립함)
repo = ChatRepositoryImpl()
usecase = GetChatAnswerUseCase(repo)

@router.post("/chat", response_model=ChatResponseDTO)
async def chat_endpoint(request: ChatRequestDTO):
    """
    AI 챗봇과 대화하는 실제 API 엔드포인트입니다.
    """
    print("\n\n")
    print("입력값 : ", request.message)
    # 비즈니스 로직(UseCase)을 실행하고 결과를 DTO 형식으로 변환하여 반환
    result = usecase.execute(request.message, use_rag=request.use_rag)
    print("출력값 : ", result.answer)
    return ChatResponseDTO(
        answer=result.answer,
        sources=[{"content": s.content, "source": s.source} for s in result.sources],
        mode=result.mode
    )
