# Build stage
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY auth-service/pom.xml auth-service/
COPY registry-service/pom.xml registry-service/
RUN mvn dependency:go-offline -pl registry-service

COPY registry-service/src registry-service/src
RUN mvn package -DskipTests -pl registry-service

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/registry-service/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]
