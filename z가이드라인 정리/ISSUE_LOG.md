# 📋 발견된 이슈 및 문제 목록 (Issue Log)

이 문서는 개발 및 테스트 중 발견된 기술적 문제와 콘솔 에러를 기록합니다. (수기 작성 및 AI 분석 포함)

## 1. 프론트엔드 (Frontend)

### 📊 Recharts 차트 렌더링 경고
- **내용**: `The width(-1) and height(-1) of chart should be greater than 0...`
- **발생 위치**: `MyPage` 대시보드 및 관제 시스템 차트 컴포넌트
- **원인 분석**:
    - `ResponsiveContainer`가 부모 컨테이너의 크기를 계산하기 전에 렌더링되거나, 부모 컨테이너의 크기가 0(또는 `display: none`)일 때 발생합니다.
    - 특히 탭 전환 또는 애니메이션이 진행되는 동안 크기 계산이 누락되는 경우가 많습니다.
- **예상 해결 방안**: 부모 컨테이너에 `min-height`를 지정하거나, 렌더링 지연(Lazy loading) 또는 `Aspect Ratio` 속성을 활용하여 해결 가능합니다.

### 🔑 인증(Auth) 관련 401 에러
- **내용**: `Failed to load resource: the server responded with a status of 401 ()` / `대시보드 조회 실패: AxiosError`
- **발생 위치**: `api/mypage/dashboard` 호출 시
- **원인 분석**:
    - 로그인 세션이 만료되었거나, `localStorage`에 저장된 JWT 토큰이 `AxiosInstance`의 헤더에 정상적으로 포함되지 않은 상태에서 보호된 API에 접근할 때 발생합니다.
    - 로그인 직후 또는 페이지 새로고침 시 토큰 정보 로딩 타이밍 이슈일 가능성도 있습니다.
- **예상 해결 방안**: `Axios Interceptor`를 통해 토큰 주입 로직을 재확인하고, 세션 만료 시 자동 로그아웃 또는 토큰 갱신(Refresh Token) 로직을 점검해야 합니다.

## 2. 백엔드 (Backend)

### (기록 대기 중)
- 백엔드 관련 로그 분석 후 기록 예정

### � 상품 상세 페이지 재고/좋아요 기능 오작동
- **내용**: 모든 제품이 '재고 소진'으로 표시되며, 하트(찜하기) 버튼이 작동하지 않음.
- **발생 위치**: `ProductDetail.jsx`
- **원인 분석**:
    - **재고 소진**: `stockQty`가 0이거나 백엔드에서 값이 내려오지 않을 경우 기본값 0으로 설정되어 `isOutOfStock`이 `true`가 됨. 백엔드 데이터 확인 필요.
    - **좋아요 버튼**: `onClick` 핸들러에 `e.stopPropagation()`만 존재하며, 실제 좋아요 로직(API 호출 및 상태 업데이트)이 구현되어 있지 않음.
- **예상 해결 방안**: 
    - 백엔드 상품 데이터의 `stockQty` 유무 확인.
    - `handleLike` 함수를 구현하여 API 연동 및 UI 상태(하트 색상 등) 반영.

### 🖼️ 상품 이미지 로딩 500 에러
- **내용**: `GET http://3.39.143.83/uploads/products/... 500 (Internal Server Error)`
- **발생 위치**: 상품 목록 및 상세 페이지 이미지 영역
- **원인 분석**:
    - 서버(Nginx 또는 Backend)에서 `/uploads/` 경로에 저장된 이미지 파일을 요청받았으나, 서버 내부 오류로 파일을 응답하지 못함.
    - 파일 권한(Permission) 문제, 경로 설정 오류, 또는 실제 파일이 존재하지 않는 경우일 수 있음.
- **예상 해결 방안**: 
    - 서버 측 로그(Nginx error log 또는 Spring Boot log) 확인.
    - 이미지 저장 디렉토리(`/uploads/products/`)의 소유권 및 권한 설정(`chmod`, `chown`) 확인.

### �📄 게시글 작성 시 ReferenceError 발생
- **내용**: `ReferenceError: userId is not defined`
- **발생 위치**: `CommunityPost.jsx` (게시글 작성 버튼 클릭 시)
- **원인 분석**:
    - `onSubmit` 함수 내에서 `communityApi.createPost`를 호출할 때 `userId` 변수를 참조하지만, 해당 변수가 선언되거나 정의되지 않은 상태입니다. (예: `const { userId } = useAuth()`와 같은 선언 누락)
- **예상 해결 방안**: 현재 로그인된 사용자의 ID를 `AuthContext` 또는 `localStorage`에서 가져와 변수로 선언해 주어야 합니다.

### 📄 회원 삭제 시 500 에러 (Internal Server Error)
- **내용**: `DELETE /api/admin/users/{userId} 500 (Internal Server Error)`
- **발생 위치**: `UserSearchPage.jsx` 및 `UserManagement.jsx`
- **원인 분석**:
    - 프론트엔드에서는 삭제 요청을 보내지만, 백엔드(`AdminUserController.java`)에 해당 `DELETE` 엔드포인트가 정의되어 있지 않음.
- **예상 해결 방안**: 백엔드 컨트롤러 및 서비스에 `deleteUser` 로직 구현 필요.

### 📊 Chart 렌더링 경고 (Width/Height -1)
- **내용**: `The width(-1) and height(-1) of chart should be greater than 0...`
- **원인 분석**: Recharts의 `ResponsiveContainer`가 렌더링될 때 부모 요소의 크기를 즉시 계산하지 못해 발생.
- **해결 방향**: 부모 디브(div)에 `min-height`를 설정하거나 차트에 최소 크기 부여.

---
*마지막 업데이트: 2026-02-25*
