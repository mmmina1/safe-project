import json
from app.core.ai.engine import AIEngine
from app.features.a_domain.diagnosis.entities import DiagnosisResult

class AIDiagnosisSource:
    def __init__(self):
        # 진단 전용 AI 엔진 가동
        self.engine = AIEngine("diagnosis")

    def analyze_survey(self, formatted_content: str) -> dict:
        """
        AI 엔진에게 설문 내용을 전달하고 분석 결과를 받아옵니다.
        """
        try:
            # AI 엔진 호출 (GPT-4o + RAG 활성화)
            raw_response = self.engine.get_answer(formatted_content, use_rag=True)
            
            # JSON 형식의 응답을 파이썬 딕셔너리로 변환
            # 응답이 ```json ... ``` 형태인 경우를 대비해 전처리 시도
            clean_json = raw_response.strip()
            if clean_json.startswith("```json"):
                clean_json = clean_json.split("```json")[1].split("```")[0].strip()
            elif clean_json.startswith("```"):
                clean_json = clean_json.split("```")[1].split("```")[0].strip()
            
            return json.loads(clean_json)
        except Exception as e:
            # 파싱 에러나 엔진 에러 발생 시 기본값 반환
            print(f"[AIDiagnosisSource] Error: {e}")
            return {
                "aiComment": f"분석 도중 오류가 발생했습니다: {str(e)}",
                "top3Types": ["분석 불가"],
                "recommendations": ["잠시 후 다시 시도해 주세요."]
            }

# 싱글톤 인스턴스
diagnosis_source = AIDiagnosisSource()
