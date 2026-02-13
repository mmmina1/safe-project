from app.features.a_domain.diagnosis.entities import DiagnosisRequest, DiagnosisResult
from app.features.a_domain.diagnosis.repositories import BaseDiagnosisRepository

# 보안 진단 AI 분석을 담당하는 핵심 비즈니스 로직 클래스
class AnalyzeDiagnosisUseCase:
    """
    비즈니스 로직: 사용자의 설문 응답을 바탕으로 AI에게 분석을 위임합니다.
    """
    def __init__(self, repository: BaseDiagnosisRepository):
        self.repository = repository

    def execute(self, request: DiagnosisRequest) -> DiagnosisResult:
        # 1. 리포지토리에 분석 요청 (리포지토리가 포맷팅 및 AI 호출 담당)
        return self.repository.get_analysis(request)
