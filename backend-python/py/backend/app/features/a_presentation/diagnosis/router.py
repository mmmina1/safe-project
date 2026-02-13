from fastapi import APIRouter, Depends
from app.features.a_presentation.diagnosis.dtos import (
    DiagnosisAnalysisRequestDTO, DiagnosisAnalysisResponseDTO
)
from app.features.a_domain.diagnosis.entities import DiagnosisRequest, SurveyAnswer
from app.features.a_domain.diagnosis.usecases import AnalyzeDiagnosisUseCase
from app.dependencies import get_diagnosis_use_case

# API 입구(/diagnosis)를 정의하는 라우터
router = APIRouter(prefix="/diagnosis", tags=["Security Diagnosis"])

@router.post("/analyze", response_model=DiagnosisAnalysisResponseDTO)
async def analyze_diagnosis(
    request: DiagnosisAnalysisRequestDTO,
    use_case: AnalyzeDiagnosisUseCase = Depends(get_diagnosis_use_case)
):
    """
    [신규] 사용자의 설문 응답을 받아 AI 심층 분석을 수행하고 결과를 반환하는 엔드포인트
    """
    # 1. DTO를 도메인 요청 객체로 변환
    domain_request = DiagnosisRequest(
        answers=[
            SurveyAnswer(
                question_key=ans.question_key,
                question_text=ans.question_text,
                answer_value=ans.answer_value,
                answer_text=ans.answer_text
            ) for ans in request.answers
        ]
    )

    # 2. 유즈케이스 실행 (진짜 AI 분석 수행)
    result = use_case.execute(domain_request)

    # 3. 분석 결과를 응답 DTO로 변환하여 반환
    return DiagnosisAnalysisResponseDTO(
        aiComment=result.aiComment,
        top3Types=result.top3Types,
        recommendations=result.recommendations
    )
