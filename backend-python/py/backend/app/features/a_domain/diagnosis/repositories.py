from abc import ABC, abstractmethod
from app.features.a_domain.diagnosis.entities import DiagnosisRequest, DiagnosisResult

# 보안 진단 AI 분석을 위한 인터페이스 정의
class BaseDiagnosisRepository(ABC):
    
    @abstractmethod
    def get_analysis(self, request: DiagnosisRequest) -> DiagnosisResult:
        """사용자의 답변 리스트를 바탕으로 AI 분석 결과를 가져오는 메서드"""
        pass
