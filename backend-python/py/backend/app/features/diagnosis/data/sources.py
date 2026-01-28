import mysql.connector
import os
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

# 실제 MySQL 데이터베이스와 통신하여 진단 데이터를 물리적으로 저장하는 클래스
class MySQLDiagnosisDataSource:
    def __init__(self):
        # .env 파일에서 로드된 DB 접속 정보 설정
        self.config = {
            'host': os.getenv('DB_HOST'),
            'user': os.getenv('DB_USER'),
            'password': os.getenv('DB_PASSWORD'),
            'database': os.getenv('DB_NAME')
        }

    def _get_connection(self):
        """MySQL 연결 객체를 생성하여 반환함"""
        return mysql.connector.connect(**self.config)

    def save(self, data: dict) -> dict:
        """진단 결과를 DB의 diagnosis_results 테이블에 저장하거나 업데이트함"""
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
            print(f"[MySQL] Saved/Updated Session: {data['session_id']}")
            return data
        except Exception as e:
            conn.rollback()
            print(f"[MySQL Error] Save failed: {e}")
            raise e
        finally:
            cursor.close()
            conn.close()

    def get(self, session_id: str) -> Optional[dict]:
        """세션 ID를 기반으로 특정 진단 기록을 조회함"""
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM diagnosis_results WHERE session_id = %s", (session_id,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()

# 실제 DB 연동을 위한 싱글톤 인스턴스
diagnosis_db = MySQLDiagnosisDataSource()

