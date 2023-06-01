#!/bin/bash

# Prompt the user for variable values
read -p "Enter the Databases' username: " db_username
read -p "Enter the Databases' password: " db_password

# Validate input
if [[ -z $db_username || -z $db_password ]]; then
    echo "Invalid input. Please provide a non-empty username and password."
    exit 1
fi

if [[ ${#db_username} -lt 8 || ${#db_password} -lt 8 ]]; then
    echo "Invalid input. Username and password must have a minimum length of 8 characters."
    exit 1
fi

# Run the Terraform apply command with the user-provided values

# BANK SYSTEM
cd bank
terraform init && terraform apply -var="bank_db_username=$db_username" -var="bank_db_password=$db_password" -auto-approve || exit 1

# STORE SYSTEM
cd ../store
terraform init && terraform apply -var="store_db_username=$db_username" -var="store_db_password=$db_password" -auto-approve || exit 1

# PUBLICITAKI SYSTEM
cd ../publicitaki
terraform init && terraform apply -var="pub_db_username=$db_username" -var="pub_db_password=$db_password" -auto-approve || exit 1

#
#   VERY IMPORTANT!!!
#  --> DO NOT FORGET TO ADD A '5000' LISTENER FOR 'STORE-USERS' MICROSERVICE IN THE CONFIGURATION
#
