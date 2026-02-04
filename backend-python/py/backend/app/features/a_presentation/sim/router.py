from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional


from app.features.a_data.sim.sources import sim_source

router = APIRouter(tags=["Simulator"])

class SimRequest(BaseModel):
    message: str

class SimStartRequest(BaseModel):
    scenario_type: str  # A, B, C, D

class EvalRequest(BaseModel):
    situation: str
    player_answer: str

@router.post("/simulator")
async def simulator_endpoint(request: SimRequest):
    """기존 시뮬레이터 엔드포인트 (호환성 유지)"""
    result = sim_source.get_simulation_response(request.message)
    return {"status": "success", "data": result}

@router.post("/simulator/start")
async def simulator_start(request: SimStartRequest):
    """시나리오 유형별 AI 첫 대사 생성"""
    result = sim_source.get_scenario_start(request.scenario_type)
    return {"status": "success", "data": result}

@router.post("/simulator/evaluate")
async def simulator_evaluate(request: EvalRequest):
    """사용자 대응 평가 및 JSON 결과 반환"""
    result = sim_source.get_evaluation(request.situation, request.player_answer)
    # result는 이미 JSON 문자열이므로 그대로 반환하거나 파싱하여 반환
    import json
    try:
        data = json.loads(result)
        return {"status": "success", "data": data}
    except:
        return {"status": "error", "message": "Evaluation result is not valid JSON", "raw_data": result}



# 프론트엔드로 보내는 최종 응답 형식 정의 (필요 시 추후 정의)
# class ChatResponseDTO(BaseModel):
#     answer: str
#     sources: List[ChatSourceDTO]
#     mode: str
