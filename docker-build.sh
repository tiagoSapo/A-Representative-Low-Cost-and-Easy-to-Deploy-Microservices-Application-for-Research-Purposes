#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Function to check if a command exists
command_exists () {
    command -v "$1" >/dev/null 2>&1;
}

# Check if Maven is installed
if ! command_exists mvn; then
    echo "Error: Maven (mvn) is not installed. Please install Maven to proceed."
    exit 1
fi

# Check if Docker is installed
if ! command_exists docker; then
    echo "Error: Docker is not installed. Please install Docker to proceed."
    exit 1
fi

# Check if Docker Compose is installed
if ! command_exists docker-compose; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose to proceed."
    exit 1
fi

# Paths to Bank's subprojects
CLIENTS_DIR="./bank/bank_clients"
NOTIFICATIONS_DIR="./bank/bank_notifications"

# Paths to Store's subprojects
USERS_DIR="./store/store_users"

# Paths to Publicitaki's subprojects
PRODUCTS_DIR="./publicitaki/pub-products"

# Function to build Maven projects
build_maven_project () {
    local project_dir=$1
    local target_file=$2
    echo "Building project at $project_dir..."
    cd $project_dir
    if [ -f "$target_file" ]; then
        echo "Executable $target_file already exists. Skipping build."
    else
        mvn clean install
    fi
    cd - > /dev/null
}

# Build the bank_clients project
build_maven_project $CLIENTS_DIR "target/clients-0.0.1-SNAPSHOT.jar"

# Build the bank_notifications project
build_maven_project $NOTIFICATIONS_DIR "target/notifications-0.0.1-SNAPSHOT.jar"

# Build the store_users project
build_maven_project $USERS_DIR "target/demo-0.0.1-SNAPSHOT.jar"

# Function to build Quarkus project (check for existence of target/quarkus-app directory)
build_quarkus_project () {
    local project_dir=$1
    echo "Building Quarkus project at $project_dir..."
    cd $project_dir
    if [ -d "target/quarkus-app" ]; then
        echo "Directory target/quarkus-app exists. Skipping build."
    else
        ./mvnw package
    fi
    cd - > /dev/null
}

# Build the pub-products project (Quarkus)
build_quarkus_project $PRODUCTS_DIR

# Function to build Docker Compose projects
build_docker_compose () {
    local project_dir=$1
    echo "Building Docker Compose project at $project_dir..."
    cd $project_dir
    docker-compose build
    cd - > /dev/null
}

# Run Docker Compose Build - BANK
build_docker_compose "./bank"

# Run Docker Compose Build - STORE
build_docker_compose "./store"

# Run Docker Compose Build - PUBLICITAKI
build_docker_compose "./publicitaki"

echo "All builds completed successfully."
