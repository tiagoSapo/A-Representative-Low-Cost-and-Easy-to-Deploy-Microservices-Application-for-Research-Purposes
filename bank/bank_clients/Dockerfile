# Use the official openjdk:17-jdk-slim-buster image as the base image
FROM openjdk:17-jdk-slim-buster

# Set the working directory
WORKDIR /app

# Copy the jar file and the application.properties file to the container
COPY target/*.jar /app/app.jar
COPY src/main/resources/application.properties /app

# Set environment variables for the MySQL connection
ENV MYSQL_HOST=mysql
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=4242
ENV MYSQL_DATABASE=bank_clients

# Install MySQL client
RUN apt-get update && apt-get install -y mariadb-server

# Expose the application's port
EXPOSE 5000

# Start the application
CMD ["java", "-jar", "app.jar"]

