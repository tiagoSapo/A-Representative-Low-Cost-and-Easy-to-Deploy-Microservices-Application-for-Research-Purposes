import requests
from faker import Faker
import random

# Initialize Faker instance
fake = Faker()

# Base URL of the bank API - Bank-clients service
base_url = 'http://localhost:6001'

# Function to create an account using POST request
def create_account():
    url = f'{base_url}/accounts'
    account_name = fake.name()  # Generate a random name using Faker
    account_data = {
        'name': account_name,
        'balance': random.randint(100, 10000)  # Generate random balance between 100 and 10000
    }

    try:
        response = requests.post(url, json=account_data)
        if response.status_code == 201:
            print(f"Account '{account_name}' created successfully.")
        else:
            print(f"Failed to create account. Status code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Error creating account: {e}")

# Create 100 accounts
for _ in range(100):
    create_account()
