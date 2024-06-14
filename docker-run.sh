#!/bin/bash

# Function to check if Docker Compose project is running
is_running () {
    local project_dir=$1
    cd $project_dir
    docker-compose ps --quiet | grep -q .
    local result=$?
    cd - > /dev/null
    return $result
}

# Function to start Docker Compose project
start_project () {
    local project_name=$1
    local project_dir=$2
    echo "Starting $project_name services..."
    cd $project_dir
    docker-compose up -d
    cd - > /dev/null
}

# Paths to Docker Compose projects
PROJECTS=(
    "BANK=./bank"
    "STORE=./store"
    "PUBLICITAKI=./publicitaki"
)

# Trap CTRL+C to stop all running Docker Compose projects
trap 'echo "Stopping all services..."; docker-compose down; exit 1' INT

# Loop through each project and start if not already running
while true; do
    for project in "${PROJECTS[@]}"; do
        key="${project%%=*}"
        value="${project#*=}"
        project_name="$key"
        project_dir="$value"

        # Check if project is already running
        if is_running $project_dir; then
            echo "$project_name services are running."
        else
            # Start the project if not running
            start_project "$project_name" "$project_dir"
            if [ $? -eq 0 ]; then
                echo "$project_name services started successfully."
            else
                echo "Failed to start $project_name services. Exiting."
                exit 1
            fi
        fi
    done
    echo "Monitoring services... Press CTRL+C to stop."
    sleep 5  # Adjust the sleep interval as needed
done
