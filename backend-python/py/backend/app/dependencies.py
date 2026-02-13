from app.features.a_domain.diagnosis.usecases import AnalyzeDiagnosisUseCase
from app.features.a_data.diagnosis.repositories import DiagnosisRepositoryImpl


def get_diagnosis_use_case() -> AnalyzeDiagnosisUseCase:
    repository = DiagnosisRepositoryImpl()
    return AnalyzeDiagnosisUseCase(repository)
