# Fetching Python 3.11
FROM python:3.11.2-alpine3.16

# Setting up work directory
WORKDIR /app

# Copy the project into the app
COPY . /app

# Install MySQL client
RUN apk add gcc musl-dev mariadb-connector-c-dev mariadb-dev

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt




