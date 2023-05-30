#!/bin/bash

# Destroy the infrastructure created by the previous script

# BANK SYSTEM
cd bank
terraform init
terraform destroy -auto-approve

# STORE SYSTEM
cd ../store
terraform init
terraform destroy -auto-approve

# PUBLICITAKI SYSTEM
cd ../publicitaki
terraform init
terraform destroy -auto-approve

