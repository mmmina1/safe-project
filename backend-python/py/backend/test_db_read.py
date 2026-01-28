import mysql.connector
import os
from dotenv import load_dotenv

# .env 파일 위치 지정 (현재 파일 위치 기준으로 최적화)
current_dir = os.path.dirname(__file__)
dotenv_path = os.path.join(current_dir, '.env')

# 만약 현재 폴더에 없으면 한 단계 위로 (루트/py/backend 대응)
if not os.path.exists(dotenv_path):
    dotenv_path = os.path.join(current_dir, 'py', 'backend', '.env')

load_dotenv(dotenv_path)

def test_db_read():
    print("🔍 데이터베이스 읽기 테스트를 시작합니다...")
    
    config = {
        'host': os.getenv('DB_HOST'),
        'user': os.getenv('DB_USER'),
        'password': os.getenv('DB_PASSWORD'),
        'database': os.getenv('DB_NAME')
    }

    print(f"📡 접속 시도 중: {config['host']}...")

    try:
        # 1. 연결 시도
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor(dictionary=True)
        print("✅ MySQL 서버 연결 성공!")

        # 2. 현재 존재하는 테이블 목록 확인 (Read Only)
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        print(f"\n📂 현재 데이터베이스({config['database']})의 테이블 목록:")
        if not tables:
            print("   - 테이블이 존재하지 않습니다.")
        for table in tables:
            print(f"   - {list(table.values())[0]}")

        # 3. 만약 diagnosis_results 테이블이 있다면 상위 5개 데이터 조회
        cursor.execute("SHOW TABLES LIKE 'diagnosis_results'")
        if cursor.fetchone():
            print("\n📊 'diagnosis_results' 테이블 상위 5개 데이터:")
            cursor.execute("SELECT * FROM diagnosis_results LIMIT 5")
            rows = cursor.fetchall()
            if not rows:
                print("   - 저장된 데이터가 없습니다.")
            for row in rows:
                print(f"   - ID: {row['id']}, Score: {row['total_score']}, Level: {row['risk_level']}")
        
        cursor.close()
        conn.close()
        print("\n✨ 읽기 테스트가 완료되었습니다.")

    except Exception as e:
        print(f"\n❌ 에러 발생: {e}")

if __name__ == "__main__":
    test_db_read()
