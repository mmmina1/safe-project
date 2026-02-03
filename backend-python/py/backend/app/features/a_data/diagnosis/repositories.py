from typing import Optional
from app.features.a_domain.diagnosis.entities import DiagnosisResult
from app.features.a_domain.diagnosis.repositories import BaseDiagnosisRepository
from app.features.a_data.diagnosis.sources import diagnosis_db, MySQLDiagnosisDataSource

# 도메인 리포지토리 인터페이스의 MySQL 구현체
# 데이터 소스(sources.py)와 도메인 모델(entities.py) 사이의 다리 역할을 합니다.
class DiagnosisRepositoryImpl(BaseDiagnosisRepository):
    def __init__(self, data_source: MySQLDiagnosisDataSource = diagnosis_db):
        self.data_source = data_source

    def save_result(self, result: DiagnosisResult) -> DiagnosisResult:
        # 1. 도메인 엔티티를 DB에 저장하기 편리한 딕셔너리 형태로 변환
        data = result.dict()
        
        # 2. MySQL 데이터 소스에 저장을 요청
        saved_data = self.data_source.save(data)
        
        # 3. 저장된 데이터를 다시 도메인 엔티티로 변환하여 반환
        return DiagnosisResult(**saved_data)

    def get_result(self, session_id: str) -> Optional[DiagnosisResult]:
        # 세션 ID로 DB에서 진단 데이터를 조회
        data = self.data_source.get(session_id)
        if data:
            return DiagnosisResult(**data)
        return None
