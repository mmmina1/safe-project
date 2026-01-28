from fastapi.testclient import TestClient
import sys
import os

# Add the project root to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

from backend.main import app

def test_diagnosis_flow():
    client = TestClient(app)

    # 1. Prepare Survey Answers (High Risk Scenario)
    payload = {
        "answers": [
            {"question_key": "q1_unknown_link", "answer": "yes"},  # Risk +20
            {"question_key": "q2_app_install", "answer": "yes"},   # Risk +20
            {"question_key": "q3_frequency", "answer": "often"}    # Risk +30
        ]
    }
    # Expected Score: 70 -> CAUTION (>=40, <80)

    print("Sending Diagnosis Request...")
    response = client.post("/diagnosis/", json=payload)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.json()}")

    assert response.status_code == 200
    data = response.json()
    assert data["score"] == 70
    assert data["risk_level"] == "CAUTION"
    print("✅ Diagnosis Verification Passed!")

if __name__ == "__main__":
    try:
        test_diagnosis_flow()
    except ImportError:
        print("⚠️ 'httpx' library is missing. Please run 'pip install httpx' to run this test.")
    except Exception as e:
        print(f"❌ Test Failed: {e}")
