# Local Git Ignore Strategy (skip-worktree)

이 문서는 `application.properties`와 같이 이미 Git에 추적되고 있는 파일의 **로컬 변경사항만** 무시하는 방법을 설명합니다. 이 방법은 다른 팀원이나 원격 저장소에 아무런 영향을 주지 않습니다.

## 왜 `.gitignore` 대신 `skip-worktree`를 쓰나요?
- `.gitignore`: 아직 Git에 올라가지 않은 파일만 무시할 수 있습니다.
- `skip-worktree`: 이미 Git에 올라가 있는 파일의 로컬 수정을 Git이 감지하지 못하게 잠시 눈을 가리는 방식입니다. (로컬 DB 비번 수정 등에 유용)

## 사용 방법

### 1. 로컬 변경사항 무시 설정 (숨기기)
터미널(프로젝트 루트)에서 아래 명령어를 실행하세요.
```powershell
git update-index --skip-worktree backend/src/main/resources/application.properties
```

### 2. 현재 무시된 파일 목록 확인
내가 어떤 파일을 숨겼는지 잊어버렸을 때 확인하는 명령어입니다.
```powershell
# Windows PowerShell 기준
git ls-files -v | Select-String "^S"
```

### 3. 다시 변경사항 감지하게 하기 (복구)
만약 해당 파일을 실제로 수정해서 커밋해야 한다면 설정을 풀어줘야 합니다.
```powershell
git update-index --no-skip-worktree backend/src/main/resources/application.properties
```

---
**주의:** 이 설정은 내 컴퓨터의 `.git` 폴더에만 저장되므로, 다른 팀원들의 환경에는 영향을 주지 않으며 본인이 직접 명령어를 입력해야 적용됩니다.

## 💡 자주 묻는 질문 (FAQ)

### Q1. 풀 리퀘스트(PR)나 머지(Merge)할 때 어떻게 되나요?
- **내 수정사항은 무시됨:** Git이 이 파일의 수정을 아예 모르는 상태이므로, `git add .`을 해도 포함되지 않습니다. 따라서 PR에는 내가 수정한 로컬 설정(DB 비밀번호 등)이 아예 올라가지 않아 안전합니다.

### Q2. `git pull`을 받았을 때 서버 코드가 바뀌어 있으면요?
- **안전한 중단:** 서버의 `application.properties`가 업데이트되었는데 내 로컬 수정본과 충돌이 날 것 같으면, Git이 업데이트를 중단하고 경고를 줍니다.
- **해결법:** 잠시 설정을 풀고(`--no-skip-worktree`), 풀을 받은 뒤 다시 설정을 걸어주면 됩니다.

### Q3. 다른 컴퓨터에서도 적용되나요?
- **아니요:** 이 설정은 **현재 이 기기의 이 저장소**에만 적용됩니다. 다른 컴퓨터에서 작업한다면 거기서도 이 가이드의 명령어를 한 번 실행해줘야 합니다.
