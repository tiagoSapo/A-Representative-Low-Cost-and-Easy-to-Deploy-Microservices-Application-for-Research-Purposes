
# Compile each microservice, and copy the executables to their system respective directory.
# Rename them to the names below:
BANK (copy the executables to ./bank/executables):
- bank-clients: mvn clean install (copy the jar file from target)
- bank-notifications: mvn clean install (copy the jar file from target)
- bank-frontend: dotnet build -c Release; dotnet publish -c Release

STORE (copy the executables to ./store/executables):
- store-frontend: dotnet build -c Release; dotnet publish -c Release
- store-users: mvn clean install (copy the jar file from target)
- store-notifications: zip the source code as a zip file named 'store-notifications'
- store-products: zip the source code as a zip file named 'store-products'

PUBLICITAKI (copy the executables to ./publicitaki/executables):
- pub-frontend: zip the source code as a zip file named 'pub-frontend'
- pub-users: zip the source code as a zip file named 'pub-users'
- pub-products: ../mvnw package (zip the contents of the target folder)
- pub-notifications: zip the source code as a zip file named 'pub-notifications'


# After you run deploy_to_aws.sh, run the C# project in 'populate-countries-for-store' folder. The application will ask you to indicate the STORE-USERS microservice's URI on AWS.

# If you encounter compatibility issues while deploying through Terraform because of changes in the Amazon AWS image versions, manually update them in the Terraform main.tf files.