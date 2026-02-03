from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional


router = APIRouter(tags=["Simulator"]) # 라우터 정의

@router.post("/simulator") # 경로 정의
async def simulator_endpoint():
    print("시뮬레이터 API 호출됨")
    return {"status": "success"} # 최소한의 응답



# 프론트엔드로 보내는 최종 응답 형식 정의 (필요 시 추후 정의)
# class ChatResponseDTO(BaseModel):
#     answer: str
#     sources: List[ChatSourceDTO]
#     mode: str
