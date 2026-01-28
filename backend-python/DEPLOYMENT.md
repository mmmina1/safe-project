# 🚀 Python AI 서버 실행 가이드

## 1. 사전 준비 (최초 1회만)
`.env` 파일을 `backend-python/py/backend` 폴더 안에 생성하고 API 키를 입력하세요.
```ini
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
```

## 2. 서버 실행 명령어
터미널(PowerShell)을 열고 아래 명령어를 순서대로 입력하세요.

```powershell
# 1. 파이썬 프로젝트 폴더로 이동 (상대 경로)
cd backend-python\py

# 2. 가상환경 켜기
.\.venv\Scripts\Activate.ps1

# 3. 서버 실행 (앱 폴더 진입 후 실행)
cd backend
python main.py
```

성공 시 `http://127.0.0.1:8000` 주소로 서버가 실행됩니다.
종료하려면 `Ctrl + C`를 누르세요.
