from fastapi import APIRouter, Depends
from app.features.diagnosis.presentation.dtos import DiagnosisRequestDTO, DiagnosisResponseDTO
from app.features.diagnosis.domain.entities import DiagnosisRequest, SurveyAnswer
from app.features.diagnosis.domain.usecases import CalculateRiskUseCase
from app.dependencies import get_diagnosis_use_case

# 보안 진단 관련 API 경로를 정의하는 라우터
router = APIRouter(prefix="/diagnosis", tags=["Diagnosis"])

@router.post("/")
async def submit_diagnosis(
    request: DiagnosisRequestDTO,
    use_case: CalculateRiskUseCase = Depends(get_diagnosis_use_case)
):
    """
    사용자의 설문 응답을 받아 위험도를 계산하고 결과를 반환하는 엔드포인트
    """
    # 1. DTO 형식을 도메인 엔티티(핵심 모델)로 변환
    domain_answers = [
        SurveyAnswer(question_id=ans.question_key, answer_value=ans.answer)
        for ans in request.answers
    ]
    domain_request = DiagnosisRequest(user_id=123, answers=domain_answers) # 임시 사용자 ID

    # 2. 비즈니스 로직(UseCase) 실행
    result = use_case.execute(domain_request)

    # 3. 결과를 반환용 DTO 형식으로 변환하여 응답
    return DiagnosisResponseDTO(
        session_id=result.session_id,
        score=result.total_score,
        risk_level=result.risk_level,
        summary=result.summary
    )
