from pydantic import BaseModel
from typing import List

# DTO (Data Transfer Object): API 통신 시 데이터를 주고받는 형식을 정의합니다.

# 사용자의 각 질문 답변을 담는 DTO
class SurveyAnswerDTO(BaseModel):
    question_key: str   # 질문 식별값
    question_text: str  # [신규] 질문 전체 텍스트
    answer_value: str   # 응답 키값 (yes/no 등)
    answer_text: str    # [신규] 응답 전체 텍스트

# 보안 진단 요청 시 프론트엔드에서 전달하는 데이터 형식 (기존 호환용)
class DiagnosisRequestDTO(BaseModel):
    answers: List[SurveyAnswerDTO]

# [신규] AI 심층 분석 요청을 위한 DTO (스프링부트 전송 규격)
class DiagnosisAnalysisRequestDTO(BaseModel):
    answers: List[SurveyAnswerDTO]

# 보안 진단 완료 후 프론트엔드로 반환하는 데이터 형식 (기존 호환용)
class DiagnosisResponseDTO(BaseModel):
    session_id: str
    score: int
    risk_level: str
    summary: str

# [신규] AI 심층 분석 결과 반환을 위한 DTO (스프링부트 수신 규격)
class DiagnosisAnalysisResponseDTO(BaseModel):
    aiComment: str
    top3Types: List[str]
    recommendations: List[str]
