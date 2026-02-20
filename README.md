# Safe Project

사기 방지 및 피해 예방 플랫폼

## 기술 스택

### Backend
- **Framework**: Spring Boot 3.5.10
- **Database**: MySQL 8.0
- **ORM**: Hibernate + QueryDSL
- **Security**: Spring Security + JWT
- **Cache**: Redis
- **Scheduler**: Spring Scheduler
- **HTTP Client**: RestTemplate / WebClient

### Frontend
- **Framework**: React + Vite
- **State Management**: React Query, Zustand
- **HTTP Client**: Axios
- **Form**: React Hook Form
- **Charts**: Recharts
- **Map**: Kakao Map API

### Infrastructure
- **Container**: Docker + Docker Compose
- **Web Server**: Nginx
- **CI/CD**: GitHub Actions (선택사항)

## 프로젝트 구조

```
safe-project/
├── backend/              # Spring Boot 백엔드
│   ├── src/main/java/
│   │   └── com/safe/backend/
│   │       ├── domain/   # 도메인별 기능
│   │       │   ├── admin/    # 관리자 기능
│   │       │   ├── user/     # 회원 관리
│   │       │   ├── auth/     # 인증
│   │       │   └── ...
│   │       └── global/    # 전역 설정
│   └── src/main/resources/
│       └── application.yml
├── backend-python/       # Python 백엔드 (AI 서비스)
├── frontend/             # React 프론트엔드
├── docs/                 # 프로젝트 문서 (DB, 배포, 설정 가이드)
│   ├── database/         # MySQL 관련 가이드
│   ├── deployment/       # 배포 관련 가이드 (AWS 등)
│   ├── setup/            # 로컬 환경 세팅 가이드
│   └── technical/        # 기술적 상세 문서
└── docker-compose.yml    # Docker Compose 설정
```

## 📚 프로젝트 문서 가이드

프로젝트의 상세 가이드는 `docs/` 폴더에서 확인할 수 있습니다.

- **[배포 가이드 (AWS)](docs/deployment/AWS_DEPLOYMENT_GUIDE.md)**: AWS 클라우드 배포 및 환경 설정 가이드
- **[실행 방법](docs/setup/HOW_TO_RUN.md)**: 서비스 실행 상세 매뉴얼
- **[데이터베이스 설정](docs/database/MYSQL_COMMANDS.md)**: MySQL 명령어 및 구조 참조
- **[체크리스트](docs/setup/SETUP_CHECKLIST.md)**: 환경 구축을 위한 점검 리스트

## 시작하기

### 사전 요구사항
- Java 17+
- Node.js 18+
- Docker & Docker Compose
- MySQL 8.0 (또는 Docker 사용)

### 1. 데이터베이스 실행 (Docker)

```bash
# MySQL + Redis 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f mysql
```

### 2. 백엔드 실행

```bash
cd backend

# Gradle Wrapper로 실행
./gradlew bootRun

# 또는 IDE에서 BackendApplication 실행
```

백엔드는 `http://localhost:8080`에서 실행됩니다.

### 3. 프론트엔드 실행

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

프론트엔드는 `http://localhost:5173`에서 실행됩니다.

## 환경 변수

### 로컬 개발 환경
기본적으로 `application-local.yml` 설정을 사용합니다.

```yaml
spring:
  profiles:
    active: local
```

### 개발 서버 환경
```bash
export SPRING_PROFILES_ACTIVE=dev
export DB_URL=jdbc:mysql://3.39.143.83:3306/safe_db
export DB_USERNAME=admin
export DB_PASSWORD=safe1234
```

### 운영 환경
```bash
export SPRING_PROFILES_ACTIVE=prod
export DB_URL=...
export DB_USERNAME=...
export DB_PASSWORD=...
```

## 주요 기능

### 관리자 기능
- 회원 검색 및 조회
- 고객지원 대시보드
- 서비스 상품 관리
- 신고 게시글 처리
- 블라인드 사유 관리
- 공지사항 관리
- 배너 관리
- 블랙리스트 관리

### 사용자 기능
- 회원가입/로그인 (자체, 카카오, 구글)
- AI 취약도 진단
- 커뮤니티 게시글 작성/조회
- 사례 공유 및 검색

## 데이터베이스

### 주요 테이블
- `users` - 회원 정보
- `visit_post` - 커뮤니티 게시글
- `post_reason` - 게시글 신고
- `blind_reasons` - 블라인드 사유
- `blacklist` - 블랙리스트 (전화번호/URL)
- `notices` - 공지사항
- `banners` - 메인 배너
- `service_products` - 서비스 상품
- `ai_diag_session` - AI 진단 세션
- `risk_detection_log` - 위험 탐지 로그

## API 문서

### 관리자 API
- `GET /api/admin/users/search` - 회원 검색
- `GET /api/admin/cs/consultations` - CS 상담 목록
- `GET /api/admin/community/reports` - 신고 게시글 목록
- `GET /api/admin/blind-reasons` - 블라인드 사유 목록
- `GET /api/admin/notices` - 공지사항 목록
- `GET /api/admin/banners` - 배너 목록
- `GET /api/admin/blacklist` - 블랙리스트 목록

## 개발 가이드

### QueryDSL 사용법
```java
@Repository
public class UserRepositoryCustomImpl implements UserRepositoryCustom {
    
    @Autowired
    private JPAQueryFactory queryFactory;
    
    public List<User> searchUsers(String keyword) {
        QUser user = QUser.user;
        return queryFactory
            .selectFrom(user)
            .where(user.email.contains(keyword)
                .or(user.name.contains(keyword)))
            .fetch();
    }
}
```

### Redis 캐싱 사용법
```java
@Service
public class UserService {
    
    @Cacheable(value = "users", key = "#userId")
    public User getUser(Long userId) {
        return userRepository.findById(userId);
    }
    
    @CacheEvict(value = "users", key = "#userId")
    public void updateUser(Long userId, User user) {
        // 업데이트 로직
    }
}
```

## 라이선스

이 프로젝트는 내부 사용을 위한 것입니다.
