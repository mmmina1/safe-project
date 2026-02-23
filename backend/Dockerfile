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
ENTRYPOINT ["java", "-jar", "app.jar"]
