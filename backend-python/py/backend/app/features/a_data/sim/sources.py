from app.core.ai.engine import AIEngine
from pydantic import BaseModel
from typing import List

class SimResult(BaseModel):
    answer: str
    mode: str

class SimSource:
    def __init__(self):
        self.engine = AIEngine("simulation")

    def get_simulation_response(self, message: str) -> SimResult:
        answer = self.engine.get_answer(message, use_rag=True)
        
        # 만약 AI가 마크다운 코드 블록으로 감싸서 보냈다면 제거 (안전장치)
        if "```json" in answer:
            answer = answer.split("```json")[1].split("```")[0].strip()
        elif "```" in answer:
            answer = answer.split("```")[1].split("```")[0].strip()
            
        mode = "Sim-JSON" if "에러" not in answer else "Error"
        return SimResult(answer=answer, mode=mode)

sim_source = SimSource()
