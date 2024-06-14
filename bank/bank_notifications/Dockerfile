# Fetching latest version of Java
FROM openjdk:11
 
# Setting up work directory
WORKDIR /app

# Copy the jar file into our app
COPY . /app

# Expose the application's port
EXPOSE 5000

# Starting the application
CMD ["java", "-jar", "./target/notifications-0.0.1-SNAPSHOT.jar"]