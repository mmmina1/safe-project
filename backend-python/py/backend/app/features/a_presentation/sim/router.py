from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional


from app.features.a_data.sim.sources import sim_source

router = APIRouter(tags=["Simulator"])

class SimRequest(BaseModel):
    message: str

@router.post("/simulator")
async def simulator_endpoint(request: SimRequest):
    print(f"시뮬레이터 API 호출됨: {request.message}")
    result = sim_source.get_simulation_response(request.message)
    return {"status": "success", "data": result}



# 프론트엔드로 보내는 최종 응답 형식 정의 (필요 시 추후 정의)
# class ChatResponseDTO(BaseModel):
#     answer: str
#     sources: List[ChatSourceDTO]
#     mode: str
