# Publicitaki-Store-Bank Systems

### Summary: 
This project consists of __three__ _interconnected_ applications that __simulate real-life websites communicating with each other__. They can be run on the **Cloud** (**Amazon AWS**) ☁️ using the Terraform IaC or Locally via **Docker** 🐋.

The project is structured around __three__ subsystems: 
- 📈 __Publicitaki__, a price tracker website;
- 🛍️ __Store__, an online platform for selling various types of products;
- 🏦 __Bank__, a system that manages transactions made on both Publicitaki and Store.

<br> __Communication__: 
- REST
- gRPC
- Publish/Subscribe pattern (banking transactions) 

<br> __Database management systems used__: 
- PostgreSQL
- MySQL

<br> __Programming languages/frameworks used__:
- Java (Spring Boot and Quarkus)
- C# (ASP.NET Core)
- Python (Django)
- JavaScript (NodeJS, React with Vite)

## Environment Setup and Installation - LOCAL (Docker) 🐋
- __Step 1__: Download the source code from Github;
- __Step 2__: Download and install **Docker** and **Docker-Compose** from the official website https://www.docker.com/get-started/;
- __Step 3__: Run docker-build.sh to build the containers;
- __Step 4__: Run docker-run.sh to run the containers;
- __Step 5__: (Optional) You can use the scripts in the "docker-scripts-for-data-insertion" folder to insert data samples.
- __Step 6__: Access the frontend container on: http://localhost:6003 for the **Bank** 🏦, http://localhost:5006 for the **Store** 🛍️, and http://localhost:7007 for **Publicitaki** 📈;


## Environment Setup and Installation - CLOUD (Amazon AWS) ☁️

__Note__: __Windows 10 and Windows 11__ 🪟 users should use _Windows Subsystem for Linux (WSL)_ and follow the Linux commands.


- __Step 1__: Create a __AWS account__: (https://console.aws.amazon.com/console/home?nc2=h_ct&src=header-signin)
- __Step 2__: Create a __IAM account__ with the __permissions "AdministratorAccess" and "AmazonS3FullAccess"__
- __Step 3__: Then in the __IAM account__ select the _"Security Credentials"_ tab and in _"Access keys"_ select __"Create access key"__
- __Step 4__: After the key's creation you should will have the __aws credentials__. __IMPORTANT__: do not forget to save the credentials because after you close the dialog you won't be able to see them again (if you forget them you can always delete them and create a new one)
- __Step 5__ Install software:
  - __macOS __: Install __Homebrew__ running the following command: <br> `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
  - __Linux 🐧__: __Update__ apt and install __curl__: <br> `sudo apt update && sudo apt install -y curl`
- __Step 6__: Install the __AWS CLI__:
  - __macOS __: Install it on macOS, running the following command: <br>`brew install awscli`
  - __Linux 🐧__: Install it on linux, running the following command: <br>`sudo apt install -y awscli`
- __Step 7__: Verify that the AWS CLI is installed by running the following command: <br>`aws --version`
- __Step 8__: Run the following command with the credentials given by AWS in __step 4__: <br>`aws configure`
- __Step 9__: Install __Terraform__:
  - __macOS __: Install it on macOS, running the following command: <br>`brew install terraform`
  - __Linux 🐧__: Install it on linux, running the following command: <br>`sudo apt install -y terraform`
- __Step 10__: To verify that Terraform is installed run the following command:<br>
`terraform --version`
- __Step 11__: (_Optional_) Compile each microservice for each system and put them in the corresponding directories:
```
//Make sure that you create the EXECUTABLES FOLDERS

/terraform-scripts/bank/executables
/terraform-scripts/publicitaki/executables
/terraform-scripts/store/executables
```
- __Step 12__: Go to the __terraform-scripts__ folder and run the deploy script:<br>
```
cd terraform-scripts
./deploy_to_aws.sh
```
<br>_After 10 to 20 minutes, the deployment should be complete._
- __Step 13__: After the deployment is complete, go to __Elastic Beanstalk Environments__ and select the environment __Store-Users__ and select __Configuration__ on the left pane. Then in __Instance traffic and scaling__ select __Edit__ and add a new _LISTENER_ on __port 5000 (TCP)__. Click __APPLY__. <br>After that, you should have a listener for __both__ ports 80 and 5000.
- After __Step 13__ the application is ready to be used. To __UNDEPLOY__ run the following script: <br>`./undeploy_from_aws.sh`


## _Deploy_ and _Undeploy_ commands:
- To __Deploy__(⬆️) run the following commands:
```
cd terraform-scripts
./deploy_to_aws.sh
```
- To __Undeploy__(⬇️) run the following commands:
```
cd terraform-scripts
./undeploy_from_aws.sh
```


## Notes
### Register PRODUCTS on Store and Publicitaki
(_Optional_) To __add new products__ on the __Store__, you should go to the __Store-Products__ microservice and do the following:
- Add a __category__, for example, "Playstation", on this URL: `<aws-endpoint-for-store-products>/categories`;
- Add a __brand__, for example, "SONY", on this URL: `<aws-endpoint-for-store-products>/brands`;
- Add a __product__, for example, "Resident Evil 4 Remake", on this URL: `<aws-endpoint-for-store-products>/products`.

(_Optional_) To __add new products__ on __Publicitaki__, you should go to the frontend of the website Publicitaki __Pub-Frontend__ and do the following:
- Login as an __Admin__;
- Go to __Account__ and select the option to add a new product;

## Application Architecture diagrams
The application C4 diagrams are in the "extras/application-c4-diagrams" folder.

## Locust and Amazon AWS (CPU / Network-out) charts
The application's Locust and Amazon AWS charts are in the "extras/charts" folder.

