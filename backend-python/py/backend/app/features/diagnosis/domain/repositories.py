from abc import ABC, abstractmethod
from typing import Optional
from app.features.diagnosis.domain.entities import DiagnosisResult

# 보안 진단 데이터 저장을 위한 인터페이스 정의
# 도메인 비즈니스 로직은 실제 DB가 무엇인지 상관없이 이 규칙에 따라 데이터를 요청합니다.
class BaseDiagnosisRepository(ABC):
    
    @abstractmethod
    def save_result(self, result: DiagnosisResult) -> DiagnosisResult:
        """진단 결과를 영구 저장소에 저장하는 메서드"""
        pass

    @abstractmethod
    def get_result(self, session_id: str) -> Optional[DiagnosisResult]:
        """세션 ID를 통해 과거의 진단 결과를 조회하는 메서드"""
        pass
