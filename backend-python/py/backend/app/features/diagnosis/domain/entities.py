from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

# 설문의 각 질문에 대한 사용자의 선택을 담는 모델
class SurveyAnswer(BaseModel):
    question_id: str   # 질문 식별 키 (예: q1)
    answer_value: str  # 응답 값 (예: yes, no)

# 진단 요청 시 필요한 정보를 담는 요청 모델
class DiagnosisRequest(BaseModel):
    user_id: int               # 사용자 식별자
    answers: List[SurveyAnswer] # 답변 리스트

# 최종 보안 진단 결과 정보를 담는 핵심 엔티티
class DiagnosisResult(BaseModel):
    session_id: str      # 진단 세션의 고유 식별자 (UUID)
    user_id: int         # 사용자 ID
    total_score: int     # 최종 합계 점수 (0-100)
    risk_level: str      # 위험도 단계 (Safe, Caution, Danger 등)
    summary: str         # 결과 총평 및 행동 가이드
    created_at: datetime # 진단 수행 시간
