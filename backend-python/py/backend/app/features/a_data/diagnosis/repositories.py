from app.features.a_domain.diagnosis.entities import DiagnosisRequest, DiagnosisResult
from app.features.a_domain.diagnosis.repositories import BaseDiagnosisRepository
from .sources import diagnosis_source, AIDiagnosisSource

class DiagnosisRepositoryImpl(BaseDiagnosisRepository):
    def __init__(self, data_source: AIDiagnosisSource = diagnosis_source):
        self.data_source = data_source

    def get_analysis(self, request: DiagnosisRequest) -> DiagnosisResult:
        # 1. 설문 응답들을 AI가 분석하기 좋은 텍스트 형식으로 변환
        formatted_content = "\n".join([
            f"문항: {ans.question_text}\n응답: {ans.answer_text}"
            for ans in request.answers
        ])
        
        # 2. AI 데이터 소스에 분석 요청
        analysis_data = self.data_source.analyze_survey(formatted_content)
        
        # 3. 분석 결과(dict)를 도메인 엔티티(DiagnosisResult)로 변환
        return DiagnosisResult(**analysis_data)
