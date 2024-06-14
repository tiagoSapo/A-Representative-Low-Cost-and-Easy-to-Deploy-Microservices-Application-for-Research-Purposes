# Fetching Python 3.11
FROM python:3.11.2-alpine3.16

# Setting up work directory
WORKDIR /app

# Copy the jar file into our app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Install PostgreSQL client
RUN apk add postgresql-dev

