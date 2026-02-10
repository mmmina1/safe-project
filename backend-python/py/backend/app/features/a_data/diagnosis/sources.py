import mysql.connector
import os
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

from app.core.ai.engine import AIEngine

# 실제 MySQL 데이터베이스와 통신 및 AI 분석을 병행하는 데이터 소스
class MySQLDiagnosisDataSource:
    def __init__(self):
        self.config = {
            'host': os.getenv('DB_HOST'),
            'user': os.getenv('DB_USER'),
            'password': os.getenv('DB_PASSWORD'),
            'database': os.getenv('DB_NAME')
        }
        # 진단 전용 AI 엔진 추가
        self.engine = AIEngine("diagnosis")

    def _get_connection(self):
        return mysql.connector.connect(**self.config)

    def analyze_with_ai(self, habits: str) -> str:
        """사용자의 습관을 AI 엔진이 전문적으로 분석"""
        return self.engine.get_answer(habits, use_rag=False)

    def save(self, data: dict) -> dict:
        # (기존 MySQL 저장 로직 동일)
        conn = self._get_connection()
        cursor = conn.cursor()
        try:
            sql = """
            INSERT INTO diagnosis_results (session_id, total_score, risk_level, summary)
            VALUES (%s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                total_score = VALUES(total_score),
                risk_level = VALUES(risk_level),
                summary = VALUES(summary)
            """
            values = (
                data["session_id"],
                data["total_score"],
                data["risk_level"],
                data["summary"]
            )
            cursor.execute(sql, values)
            conn.commit()
            return data
        finally:
            cursor.close()
            conn.close()

    def get(self, session_id: str) -> Optional[dict]:
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM diagnosis_results WHERE session_id = %s", (session_id,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()

diagnosis_db = MySQLDiagnosisDataSource()
