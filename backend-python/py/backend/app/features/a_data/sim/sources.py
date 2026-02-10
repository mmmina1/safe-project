from app.core.ai.engine import AIEngine
from pydantic import BaseModel
from typing import List

class SimResult(BaseModel):
    answer: str
    mode: str

class SimSource:
    def __init__(self):
        # 기본 엔진은 유지하되, 필요한 시점에 동적으로 생성하여 사용
        self.default_engine = AIEngine("simulation")

    def get_scenario_start(self, scenario_type: str) -> SimResult:
        """
        특정 시나리오 타입(A: 금전, B: 개인정보, C: 악성앱, D: 일반)에 따른
        AI의 첫 상황 대사를 생성합니다.
        """
        mapping = {
            "A": {"feature": "simulation_dangerous", "db": "financial_cases"},
            "B": {"feature": "simulation_dangerous", "db": "identity_cases"},
            "C": {"feature": "simulation_dangerous", "db": "malicious_app_cases"},
            "D": {"feature": "simulation_safe", "db": "normal_cases"}
        }
        
        cfg = mapping.get(scenario_type, mapping["D"])
        engine = AIEngine(cfg["feature"], collection_name=cfg["db"])
        
        # 첫 상황극 대사 요청
        query = "당신은 은행 창구에 방문한 [손님]입니다. 사용자는 [은행원]입니다. 상황에 몰입하여 첫 대사를 해주세요."
        answer = engine.get_answer(query, use_rag=True)
        return SimResult(answer=answer, mode=f"Start-{scenario_type}")

    def chat_in_simulation(self, situation: str, message: str) -> SimResult:
        # 시뮬레이션 도중 일반 대화 (평가 없음)
        # situation은 현재까지의 문맥으로 활용
        query = f"현재 상황: {situation}\n은행원의 말: {message}\n당신은 손님으로서 대답하세요. 짧고 간결하게 대사만 하세요."
        answer = self.engine.get_answer(query, use_rag=True)
        return SimResult(answer=answer, mode="Simulation-Chat")

    def get_evaluation(self, situation: str, player_answer: str) -> str:
        """
        상황 대사와 사용자 답변을 바탕으로 가이드라인 준수 여부를 평가합니다.
        """
        eval_engine = AIEngine("simulation_eval")
        query = f"상황: {situation}\n사용자 답변: {player_answer}"
        
        result = eval_engine.get_answer(query, use_rag=True)
        return self._clean_json_response(result)

    def _clean_json_response(self, text: str) -> str:
        """AI가 보낸 텍스트에서 JSON 블록만 추출합니다."""
        if "```json" in text:
            return text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            return text.split("```")[1].split("```")[0].strip()
        return text.strip()

    def get_simulation_response(self, message: str) -> SimResult:
        """기존 챗봇 형태의 시뮬레이션 응답 (호환성 유지)"""
        answer = self.default_engine.get_answer(message, use_rag=True)
        return SimResult(answer=self._clean_json_response(answer), mode="Sim-JSON")

sim_source = SimSource()
