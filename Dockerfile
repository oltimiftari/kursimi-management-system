FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/kursimi-0.0.1-SNAPSHOT.jar kursimi-v1.0.jar
EXPOSE 9090
ENTRYPOINT ["java", "-jar", "kursimi-v1.0.jar"]