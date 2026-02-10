from pydantic import BaseModel
from typing import List

# DTO (Data Transfer Object): API 통신 시 데이터를 주고받는 형식을 정의합니다.

# 사용자의 각 질문 답변을 담는 DTO
class SurveyAnswerDTO(BaseModel):
    question_key: str # 질문 식별값
    answer: str       # 응답 내용

# 보안 진단 요청 시 프론트엔드에서 전달하는 데이터 형식
class DiagnosisRequestDTO(BaseModel):
    answers: List[SurveyAnswerDTO]

# 보안 진단 완료 후 프론트엔드로 반환하는 데이터 형식
class DiagnosisResponseDTO(BaseModel):
    session_id: str # 진단 세션 ID
    score: int      # 점수
    risk_level: str # 위험도
    summary: str    # 설명 요약
