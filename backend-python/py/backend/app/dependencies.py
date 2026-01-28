from app.features.diagnosis.domain.usecases import CalculateRiskUseCase
from app.features.diagnosis.data.repositories import DiagnosisRepositoryImpl


def get_diagnosis_use_case() -> CalculateRiskUseCase:
    repository = DiagnosisRepositoryImpl()
    return CalculateRiskUseCase(repository)
