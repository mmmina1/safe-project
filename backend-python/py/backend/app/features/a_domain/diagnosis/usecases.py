import uuid
from datetime import datetime
from app.features.a_domain.diagnosis.entities import DiagnosisRequest, DiagnosisResult
from app.features.a_domain.diagnosis.repositories import BaseDiagnosisRepository

# 보안 진단 점수 계산 및 결과 생성을 담당하는 핵심 비즈니스 로직 클래스
class CalculateRiskUseCase:
    """
    비즈니스 로직: 사용자의 설문 응답을 바탕으로 위험 점수를 계산합니다.
    """
    def __init__(self, repository: BaseDiagnosisRepository):
        self.repository = repository

    def execute(self, request: DiagnosisRequest) -> DiagnosisResult:
        # 1. 점수 계산 로직 (간단한 예시 버전)
        score = 0
        
        # 각 답변 값에 따라 가중치 부여
        for ans in request.answers:
            if ans.answer_value.lower() == "yes":
                score += 20
            if ans.answer_value.lower() == "often":
                score += 30

        # 최대 점수는 100점으로 제한
        score = min(score, 100)

        # 2. 점수에 따른 위험도 단계 결정
        if score >= 80:
            risk_level = "DANGER"
            summary = "피싱 위험이 매우 높습니다. 즉각적인 주의가 필요합니다."
        elif score >= 40:
            risk_level = "CAUTION"
            summary = "주의가 필요한 수준입니다. 출처 불명의 링크를 조심하세요."
        else:
            risk_level = "SAFE"
            summary = "보안 습관이 훌륭합니다. 현재 상태를 잘 유지하세요."

        # 3. 최종 결과 엔티티 생성
        result = DiagnosisResult(
            session_id=str(uuid.uuid4()),
            user_id=request.user_id,
            total_score=score,
            risk_level=risk_level,
            summary=summary,
            created_at=datetime.now()
        )

        # 4. 리포지토리를 통해 결과를 안전하게 저장 (MySQL 연동)
        return self.repository.save_result(result)
