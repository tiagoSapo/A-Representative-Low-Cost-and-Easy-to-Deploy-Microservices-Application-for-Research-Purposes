import requests
import random

# Base URL of the users service API
base_url = 'http://localhost/7003'

# Function to create a user using POST request
def create_user(name, email, password):
    url = f'{base_url}/customers/'
    data = {
        "name": name,
        "email": email,
        "password": password
    }

    try:
        response = requests.post(url, json=data)
        if response.status_code == 201:
            print(f"User '{name}' created successfully.")
        else:
            print(f"Failed to create user '{name}'. Status code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Error creating user '{name}': {e}")

# Generate 10 sample users
for i in range(1, 11):
    name = f"User {i}"
    email = f"user{i}@example.com"
    password = "password123"  # You can generate a random password if needed
    
    create_user(name, email, password)
