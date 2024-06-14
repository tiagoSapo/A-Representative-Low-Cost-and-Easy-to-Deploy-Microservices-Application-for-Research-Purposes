# Fetching latest version of Java
FROM openjdk:11
 
# Setting up work directory
WORKDIR /app

# Copy the jar file into our app
COPY . /app

# Starting the application
CMD ["java", "-jar", "notifications-0.0.1-SNAPSHOT.jar"]