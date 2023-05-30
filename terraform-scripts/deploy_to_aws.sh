#!/bin/bash

# Prompt the user for variable values
read -p "Enter the Databases' username: " db_username
read -p "Enter the Databases' password: " db_password
read -p "Enter the IPs authorized to access the Databases [default: 0.0.0.0/0]: " db_ip_permission
db_ip_permission=${db_ip_permission:-0.0.0.0/0} # Set default if empty
read -p "Enter the IPs authorized to access SSH [default: 0.0.0.0/0]: " ssh_ip_permission
ssh_ip_permission=${ssh_ip_permission:-0.0.0.0/0} # Set default if empty

# Run the Terraform apply command with the user-provided values

# BANK SYSTEM
cd bank
terraform init
terraform apply -var="bank_db_username=$db_username" -var="bank_db_password=$db_password" -var="bank_db_ip_permission=$db_ip_permission" -var="bank_ssh_ip_permission=$ssh_ip_permission" -auto-approve

# STORE SYSTEM
cd ../store
terraform init
terraform apply -var="store_db_username=$db_username" -var="store_db_password=$db_password" -var="store_db_ip_permission=$db_ip_permission" -var="store_ssh_ip_permission=$ssh_ip_permission" -auto-approve

# PUBLICITAKI SYSTEM
cd ../publicitaki
terraform init
terraform apply -var="pub_db_username=$db_username" -var="pub_db_password=$db_password" -var="pub_db_ip_permission=$db_ip_permission" -var="pub_ssh_ip_permission=$ssh_ip_permission" -auto-approve

#
#   VERY IMPORTANT!!!
#  --> DO NOT FORGET TO ADD A '5000' LISTENER FOR 'STORE-USERS' MICROSERVICE IN THE CONFIGURATION
#
