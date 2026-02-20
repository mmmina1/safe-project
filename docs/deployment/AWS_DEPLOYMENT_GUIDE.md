# ☁️ AWS Deployment & Environment Configuration Guide

이 문서는 프로젝트를 AWS 클라우드 환경으로 배포하기 위한 전략과 현재 코드의 하드코딩 문제를 해결하는 방법을 정리한 가이드입니다.

---

## 🏗️ 1. 배포 아키텍처 (AWS 표준)

현재 Docker Compose 구조를 AWS의 관리형 서비스로 전환하는 것을 목표로 합니다.

| 구성 요소 | 로컬 환경 (Docker) | AWS 환경 (추천) |
| :--- | :--- | :--- |
| **Frontend** | React (Nginx) | **Amazon App Runner** 또는 **S3 + CloudFront** |
| **Java Backend** | Spring Boot | **Amazon App Runner** 또는 **ECS (Fargate)** |
| **Python AI** | FastAPI | **Amazon App Runner** 또는 **ECS (Fargate)** |
| **Database** | MySQL (Container) | **Amazon RDS (MySQL)** |
| **Cache** | Redis (Container) | **Amazon ElastiCache (Redis)** |
| **Storage** | Local Filesystem | **Amazon S3** |

---

## 🌐 2. 'localhost' 하드코딩 해결 전략

현재 `SecurityConfig.java`, `axiosInstance.js` 등에 하드코딩된 `localhost` 주소는 배포 전 반드시 **환경 변수**로 치환되어야 합니다.

### A. Java (Spring Boot)
- **application-prod.properties** 파일을 생성하여 실제 서버 정보를 관리합니다.
- `@Value("${VAR_NAME}")`를 사용하여 코드 내의 주소를 변수화합니다.

### B. React (Frontend)
- Vite의 `.env.production` 기능을 활용합니다.
- `baseURL: import.meta.env.VITE_API_URL`과 같이 호출하여 빌드 시점에 주소가 결정되도록 합니다.

---

## 🚀 3. 단계별 배포 로드맵

### 1단계: 컨테이너 이미지화 및 저장
1. **Amazon ECR** 리포지토리를 생성합니다.
2. 각 서비스(Front, Java, Python) 이미지를 빌드하고 ECR에 `push`합니다.

### 2단계: 클라우드 인프라 준비
1. **Amazon RDS**로 데이터베이스를 구성하고 스키마를 마이그레이션합니다.
2. **AWS Secrets Manager**에 API 키나 DB 비밀번호를 안전하게 보관합니다.

### 3단계: 서비스 실행
1. **AWS App Runner**를 사용하여 간편하게 컨테이너를 실행하거나, **ECS**를 통해 클러스터링을 구성합니다.
2. **Application Load Balancer (ALB)**를 설정하여 도메인 연결 및 SSL(HTTPS)을 적용합니다.

---

## 💡 주요 참고 사항
- **환경 변수 우선순위**: 배포 시에는 소스 코드 내의 `.env` 파일보다 AWS 서비스 설정에서 직접 주입하는 환경 변수가 우선 적용되도록 설계합니다.
- **비용 최적화**: 초기 단계에서는 Redis를 컨테이너로 직접 띄우고, DB 사양을 낮게 설정하여 비용을 절감할 수 있습니다.

> [!IMPORTANT]
> 본 문서는 가이드라인이며, 실제 배포 시 각 서비스의 네트워크 보안 그룹(Security Group) 설정 및 IAM 권한 할당 작업이 추가로 필요합니다.
