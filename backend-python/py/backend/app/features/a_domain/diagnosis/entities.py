from datetime import datetime
from typing import List
from pydantic import BaseModel

# 설문의 각 질문에 대한 사용자의 선택을 담는 모델
class SurveyAnswer(BaseModel):
    question_key: str
    question_text: str
    answer_value: str
    answer_text: str

# 진단 요청 시 필요한 정보를 담는 요청 모델
class DiagnosisRequest(BaseModel):
    answers: List[SurveyAnswer]

# 최종 보안 진단 결과 정보를 담는 핵심 엔티티
# Spring Boot의 PythonDiagnosisResponse와 규격을 맞춤
class DiagnosisResult(BaseModel):
    aiComment: str
    top3Types: List[str]
    recommendations: List[str]
    created_at: datetime = datetime.now()
