from fastapi import APIRouter, Depends
from app.features.a_presentation.diagnosis.dtos import (
    DiagnosisRequestDTO, DiagnosisResponseDTO,
    DiagnosisAnalysisRequestDTO, DiagnosisAnalysisResponseDTO
)
from app.features.a_domain.diagnosis.entities import DiagnosisRequest, SurveyAnswer
from app.features.a_domain.diagnosis.usecases import CalculateRiskUseCase
from app.dependencies import get_diagnosis_use_case

# 보안 진단 관련 API 경로를 정의하는 라우터
router = APIRouter(prefix="/diagnosis", tags=["Diagnosis"])

@router.post("/analyze", response_model=DiagnosisAnalysisResponseDTO)
async def analyze_diagnosis(
    request: DiagnosisAnalysisRequestDTO,
    use_case: CalculateRiskUseCase = Depends(get_diagnosis_use_case)
):
    """
    [신규] 사용자의 설문 응답을 받아 AI 심층 분석을 수행하고 결과를 반환하는 엔드포인트
    """
    # TODO: 실제 AI 분석 유즈케이스(UseCase)로 연결 예정
    # 지금은 테스트를 위해 규격에 맞는 가짜 데이터를 반환합니다.
    
    return DiagnosisAnalysisResponseDTO(
        aiComment="보안 진단 답변을 분석한 결과, 전반적으로 양호하지만 2단계 인증 설정이 필요합니다.",
        top3Types=["메신저 피싱", "기관 사칭", "지인 사칭"],
        recommendations=[
            "모든 계정에 2단계 인증(MFA)을 활성화하세요.",
            "출처가 불분명한 링크는 절대 클릭하지 마세요.",
            "의심스러운 전화는 즉시 끊고 해당 기관에 직접 확인하세요."
        ]
    )
