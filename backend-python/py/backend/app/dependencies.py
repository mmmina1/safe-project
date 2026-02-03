from app.features.a_domain.diagnosis.usecases import CalculateRiskUseCase
from app.features.a_data.diagnosis.repositories import DiagnosisRepositoryImpl


def get_diagnosis_use_case() -> CalculateRiskUseCase:
    repository = DiagnosisRepositoryImpl()
    return CalculateRiskUseCase(repository)
