# Build stage
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY auth-service/pom.xml auth-service/
COPY registry-service/pom.xml registry-service/
COPY gateway-service/pom.xml gateway-service/
RUN mvn dependency:go-offline -pl gateway-service

COPY gateway-service/src gateway-service/src
RUN mvn package -DskipTests -pl gateway-service

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/gateway-service/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
