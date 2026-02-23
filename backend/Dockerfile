<<<<<<< HEAD
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
=======
# Build stage
FROM gradle:8-jdk17 AS build
WORKDIR /home/gradle/src
COPY --chown=gradle:gradle . .
# gradlew.sh를 사용하여 리눅스 환경에서 빌드 (CRLF 오류 방지 및 권한 설정)
RUN sed -i 's/\r$//' gradlew.sh && chmod +x gradlew.sh
RUN ./gradlew.sh build --no-daemon -x test

# Run stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /home/gradle/src/build/libs/*SNAPSHOT.jar app.jar
EXPOSE 8080
>>>>>>> feature/docker-aws-cleanup
ENTRYPOINT ["java", "-jar", "app.jar"]
