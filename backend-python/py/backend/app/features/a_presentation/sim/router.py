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
    """사용자 대응 평가 및 다음 채팅 응답 동시 반환"""
    eval_result_str = sim_source.get_evaluation(request.situation, request.player_answer)
    chat_result = sim_source.chat_in_simulation(request.situation, request.player_answer)
    
    import json
    try:
        eval_data = json.loads(eval_result_str)
    except:
        eval_data = {"score": 50, "expert_comment": "평가 파싱 오류", "improvement_tip": "점수 산정에 실패했습니다."}

    return {
        "status": "success", 
        "data": {
            "evaluation": eval_data,
            "next_chat": chat_result.answer
        }
    }



# 프론트엔드로 보내는 최종 응답 형식 정의 (필요 시 추후 정의)
# class ChatResponseDTO(BaseModel):
#     answer: str
#     sources: List[ChatSourceDTO]
#     mode: str
