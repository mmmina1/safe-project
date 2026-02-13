# 1. 빌드 스테이지: Gradle을 사용하여 Jar 파일 생성
FROM gradle:8.5-jdk17 AS build
WORKDIR /app
COPY . .
# Gradle Wrapper 대신 시스템 Gradle을 사용하여 빌드 (줄바꿈 문제 해결)
RUN gradle build -x test

# 2. 실행 스테이지: 가벼운 JRE 이미지 사용
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

# 포트 노출
EXPOSE 8080

# 실행 명령
ENTRYPOINT ["java", "-jar", "app.jar"]
