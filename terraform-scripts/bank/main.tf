terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.70.0"
    }
  }
}

#  Provider
provider "aws" {
  region = "eu-north-1"
}

#
#  S3 - BUCKET (with code)
#
resource "aws_s3_bucket" "s3_bucket_fctuc_bank" {
  bucket = "fctuc-bank-bucket"
  acl    = "private"
}

# Bank frontend - C#
resource "aws_s3_bucket_object" "s3_bucket_object_fctuc_bank_frontend" {
  bucket = aws_s3_bucket.s3_bucket_fctuc_bank.id
  key    = "beanstalk/fctuc-bank-frontend"
  source = "executables/Archive.zip" # asp.net path on local machine
}
# Bank clients - Java
resource "aws_s3_bucket_object" "s3_bucket_object_fctuc_bank_clients" {
  bucket = aws_s3_bucket.s3_bucket_fctuc_bank.id
  key    = "beanstalk/fctuc-bank-clients"
  source = "executables/clients-0.0.1-SNAPSHOT.jar" # jar path on local machine
}
# Bank notifications - Java
resource "aws_s3_bucket_object" "s3_bucket_object_fctuc_bank_notifications" {
  bucket = aws_s3_bucket.s3_bucket_fctuc_bank.id
  key    = "beanstalk/fctuc-bank-notifications"
  source = "executables/notifications-0.0.1-SNAPSHOT.jar" # jar path on local machine
}


#
#  PERMISSIONS (PORTS)
#
resource "aws_security_group" "ec2_security_group" {
  name_prefix = "ec2-"
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.bank_ssh_ip_permission]
  }
}
resource "aws_security_group" "rds_mysql_security_group" {
  name_prefix = "rds-mysql-"
  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = [var.bank_db_ip_permission]
  }
}

#
#  EB - ELASTIC BEANSTALK APP (with 'VERSION' AND 'ENVIRONMENT')
#

# BANK - Frontend (C# ASP.NET Core MVC)
resource "aws_elastic_beanstalk_application" "beanstalk_fctuc_bank_frontend" {
  name        = "fctuc-bank-frontend"
  description = "Bank frontend's micro-service"
}
resource "aws_elastic_beanstalk_application_version" "beanstalk_fctuc_bank_frontend_version" {
  application = aws_elastic_beanstalk_application.beanstalk_fctuc_bank_frontend.name
  bucket      = aws_s3_bucket.s3_bucket_fctuc_bank.id                        # bucket's id
  key         = aws_s3_bucket_object.s3_bucket_object_fctuc_bank_frontend.id # id of bucket with jar
  name        = "fctuc-bank-frontend-1.0.0"
}
resource "aws_elastic_beanstalk_environment" "beanstalk_fctuc_bank_frontend_env" {
  name                = "fctuc-bank-frontend-dev"
  application         = aws_elastic_beanstalk_application.beanstalk_fctuc_bank_frontend.name
  solution_stack_name = "64bit Amazon Linux 2 v2.5.3 running .NET Core"
  version_label       = aws_elastic_beanstalk_application_version.beanstalk_fctuc_bank_frontend_version.name

  # bank-clients (java) micro-service's url
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "BANK_CLIENTS_URL"
    value     = aws_elastic_beanstalk_environment.beanstalk_fctuc_bank_clients_env.endpoint_url
  }

  setting {
    namespace = "aws:ec2:instances"
    name      = "InstanceTypes"
    value     = "t3.micro"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "aws-elasticbeanstalk-ec2-role"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = aws_security_group.ec2_security_group.name
  }
}

# BANK - Clients (Java Spring Boot)
resource "aws_elastic_beanstalk_application" "beanstalk_fctuc_bank_clients" {
  name        = "fctuc-bank-clients"
  description = "Bank clients' micro-service"
}
resource "aws_elastic_beanstalk_application_version" "beanstalk_fctuc_bank_clients_version" {
  application = aws_elastic_beanstalk_application.beanstalk_fctuc_bank_clients.name
  bucket      = aws_s3_bucket.s3_bucket_fctuc_bank.id                       # bucket's id
  key         = aws_s3_bucket_object.s3_bucket_object_fctuc_bank_clients.id # id of bucket with jar
  name        = "fctuc-bank-clients-1.0.0"
}
resource "aws_elastic_beanstalk_environment" "beanstalk_fctuc_bank_clients_env" {
  name                = "fctuc-bank-clients-dev"
  application         = aws_elastic_beanstalk_application.beanstalk_fctuc_bank_clients.name
  solution_stack_name = "64bit Amazon Linux 2 v3.4.7 running Corretto 11"
  version_label       = aws_elastic_beanstalk_application_version.beanstalk_fctuc_bank_clients_version.name

  # database url, name, password, db-name
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "BANK_CLIENTS_DATABASE_URL"
    value     = aws_db_instance.rds_fctuc_bank.endpoint
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "BANK_CLIENTS_DATABASE_USERNAME"
    value     = aws_db_instance.rds_fctuc_bank.username
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "BANK_CLIENTS_DATABASE_PASSWORD"
    value     = aws_db_instance.rds_fctuc_bank.password
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "BANK_CLIENTS_DATABASE_NAME"
    value     = aws_db_instance.rds_fctuc_bank.name
  }

  setting {
    name      = "SERVER_PORT"
    namespace = "aws:elasticbeanstalk:application:environment"
    value     = "5000"
  }

  setting {
    namespace = "aws:ec2:instances"
    name      = "InstanceTypes"
    value     = "t3.micro"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "aws-elasticbeanstalk-ec2-role"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = aws_security_group.ec2_security_group.name
  }
}

# BANK - Notifications (Java Spring Boot)
resource "aws_elastic_beanstalk_application" "beanstalk_fctuc_bank_notifications" {
  name        = "fctuc-bank-notifications"
  description = "Bank notifications' micro-service"
}
resource "aws_elastic_beanstalk_application_version" "beanstalk_fctuc_bank_notifications_version" {
  application = aws_elastic_beanstalk_application.beanstalk_fctuc_bank_notifications.name
  bucket      = aws_s3_bucket.s3_bucket_fctuc_bank.id                             # bucket's id
  key         = aws_s3_bucket_object.s3_bucket_object_fctuc_bank_notifications.id # id of bucket with jar
  name        = "fctuc-bank-notifications-1.0.0"
}
resource "aws_elastic_beanstalk_environment" "beanstalk_fctuc_bank_notifications_env" {
  name                = "fctuc-bank-notifications-dev"
  application         = aws_elastic_beanstalk_application.beanstalk_fctuc_bank_notifications.name
  solution_stack_name = "64bit Amazon Linux 2 v3.4.7 running Corretto 11"
  version_label       = aws_elastic_beanstalk_application_version.beanstalk_fctuc_bank_notifications_version.name

  setting {
    name      = "SERVER_PORT"
    namespace = "aws:elasticbeanstalk:application:environment"
    value     = "5000"
  }

  setting {
    namespace = "aws:ec2:instances"
    name      = "InstanceTypes"
    value     = "t3.micro"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "aws-elasticbeanstalk-ec2-role"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = aws_security_group.ec2_security_group.name
  }
}

#
# BANK DATABASE (MySQL)
#
resource "aws_db_instance" "rds_fctuc_bank" {
  engine               = "mysql"
  engine_version       = "8.0.32"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  storage_type         = "gp2"
  identifier           = "fctuc-bank-db"
  name                 = "bank_clients" # db_name
  username             = var.bank_db_username
  password             = var.bank_db_password
  parameter_group_name = "default.mysql8.0"
  skip_final_snapshot  = true

  vpc_security_group_ids = [aws_security_group.rds_mysql_security_group.id]
}
