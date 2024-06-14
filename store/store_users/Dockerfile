# Fetching latest version of Java
FROM maven:3.8.3-jdk-11
 
# Setting up work directory
WORKDIR /app

# Copy the jar file into our app
COPY . /app

RUN mvn package

ENTRYPOINT ["java", "-jar", "./target/demo-0.0.1-SNAPSHOT.jar"]