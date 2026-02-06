# Spring Boot Backend Dockerfile
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy the built JAR file
COPY target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run application
CMD ["java", "-jar", "app.jar"]
