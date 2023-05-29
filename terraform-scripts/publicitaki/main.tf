#
# SCRIPT PUBLICITAKI
#
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
resource "aws_s3_bucket" "s3_bucket_fctuc_pub" {
  bucket = "fctuc-pub-bucket"
  acl    = "private"
}

# Pub notifications - NodeJS (communicates with Postgres/MongoDB)
resource "aws_s3_bucket_object" "s3_bucket_object_fctuc_pub_notifications" {
  bucket = aws_s3_bucket.s3_bucket_fctuc_pub.id
  key    = "beanstalk/fctuc-pub-notifications"
  source = "executables/pub-notifications.zip" # path on local machine
}

# Pub users - NodeJS (communicates with PostgreSQL)
resource "aws_s3_bucket_object" "s3_bucket_object_fctuc_pub_users" {
  bucket = aws_s3_bucket.s3_bucket_fctuc_pub.id
  key    = "beanstalk/fctuc-pub-users"
  source = "executables/pub-users.zip" # path on local machine
}

# Pub products - Quarkus (communicates with Mysql)
resource "aws_s3_bucket_object" "s3_bucket_object_fctuc_pub_products" {
  bucket = aws_s3_bucket.s3_bucket_fctuc_pub.id
  key    = "beanstalk/fctuc-pub-products"
  source = "executables/pub-products.zip" # path on local machine
}

# Pub frontend - React + Vite (uses Docker)
resource "aws_s3_bucket_object" "s3_bucket_object_fctuc_pub_frontend" {
  bucket = aws_s3_bucket.s3_bucket_fctuc_pub.id
  key    = "beanstalk/fctuc-pub-frontend"
  source = "executables/pub-frontend.zip" # path on local machine
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
    cidr_blocks = [var.pub_ssh_ip_permission]
  }
}
resource "aws_security_group" "rds_postgres_security_group" {
  name_prefix = "rds-postgres-"
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [var.pub_db_ip_permission]
  }
}
resource "aws_security_group" "rds_mysql_security_group" {
  name_prefix = "rds-mysql-"
  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = [var.pub_db_ip_permission]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

#
#  EB - ELASTIC BEANSTALK APP
#
# PUBLICTAIKI - Notifications (Nodejs)
resource "aws_elastic_beanstalk_application" "beanstalk_fctuc_pub_notifications" {
  name        = "fctuc-pub-notifications"
  description = "Publicitaki notifications' micro-service"
}
resource "aws_elastic_beanstalk_application_version" "beanstalk_fctuc_pub_notifications_version" {
  application = aws_elastic_beanstalk_application.beanstalk_fctuc_pub_notifications.name
  bucket      = aws_s3_bucket.s3_bucket_fctuc_pub.id                             # bucket's id
  key         = aws_s3_bucket_object.s3_bucket_object_fctuc_pub_notifications.id # id of bucket with jar
  name        = "fctuc-pub-notifications-1.0.0"
}
resource "aws_elastic_beanstalk_environment" "beanstalk_fctuc_pub_notifications_env" {
  name                = "fctuc-pub-notifications-dev"
  application         = aws_elastic_beanstalk_application.beanstalk_fctuc_pub_notifications.name
  solution_stack_name = "64bit Amazon Linux 2 v5.8.1 running Node.js 18"
  version_label       = aws_elastic_beanstalk_application_version.beanstalk_fctuc_pub_notifications_version.name

  setting {
    name      = "PORT"
    namespace = "aws:elasticbeanstalk:application:environment"
    value     = "8080"
  }

  # database
  setting {
    name      = "PUB_NOTIFICATIONS_DATABASE_NAME"
    namespace = "aws:elasticbeanstalk:application:environment"
    value     = aws_db_instance.rds_fctuc_pub_notifications.name
  }
  setting {
    name      = "PUB_NOTIFICATIONS_DATABASE_USERNAME"
    namespace = "aws:elasticbeanstalk:application:environment"
    value     = aws_db_instance.rds_fctuc_pub_notifications.username
  }
  setting {
    name      = "PUB_NOTIFICATIONS_DATABASE_PASSWORD"
    namespace = "aws:elasticbeanstalk:application:environment"
    value     = aws_db_instance.rds_fctuc_pub_notifications.password
  }
  setting {
    name      = "PUB_NOTIFICATIONS_DATABASE_HOST"
    namespace = "aws:elasticbeanstalk:application:environment"
    value     = aws_db_instance.rds_fctuc_pub_notifications.endpoint
  }
  setting {
    name      = "PUB_NOTIFICATIONS_DATABASE_PORT"
    namespace = "aws:elasticbeanstalk:application:environment"
    value     = 5432
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

# PUBLICTAIKI - Users (Nodejs)
resource "aws_elastic_beanstalk_application" "beanstalk_fctuc_pub_users" {
  name        = "fctuc-pub-users"
  description = "Publicitaki users' micro-service"
}
resource "aws_elastic_beanstalk_application_version" "beanstalk_fctuc_pub_users_version" {
  application = aws_elastic_beanstalk_application.beanstalk_fctuc_pub_users.name
  bucket      = aws_s3_bucket.s3_bucket_fctuc_pub.id                     # bucket's id
  key         = aws_s3_bucket_object.s3_bucket_object_fctuc_pub_users.id # id of bucket with jar
  name        = "fctuc-pub-users-1.0.0"
}
resource "aws_elastic_beanstalk_environment" "beanstalk_fctuc_pub_users_env" {
  name                = "fctuc-pub-users-dev"
  application         = aws_elastic_beanstalk_application.beanstalk_fctuc_pub_users.name
  solution_stack_name = "64bit Amazon Linux 2 v5.8.1 running Node.js 18"
  version_label       = aws_elastic_beanstalk_application_version.beanstalk_fctuc_pub_users_version.name

  setting {
    name      = "PORT"
    namespace = "aws:elasticbeanstalk:application:environment"
    value     = "8080"
  }

  # database
  setting {
    name      = "PUB_USERS_DATABASE_NAME"
    namespace = "aws:elasticbeanstalk:application:environment"
    value     = aws_db_instance.rds_fctuc_pub_users.name
  }
  setting {
    name      = "PUB_USERS_DATABASE_USERNAME"
    namespace = "aws:elasticbeanstalk:application:environment"
    value     = aws_db_instance.rds_fctuc_pub_users.username
  }
  setting {
    name      = "PUB_USERS_DATABASE_PASSWORD"
    namespace = "aws:elasticbeanstalk:application:environment"
    value     = aws_db_instance.rds_fctuc_pub_users.password
  }
  setting {
    name      = "PUB_USERS_DATABASE_HOST"
    namespace = "aws:elasticbeanstalk:application:environment"
    value     = aws_db_instance.rds_fctuc_pub_users.endpoint
  }
  setting {
    name      = "PUB_USERS_DATABASE_PORT"
    namespace = "aws:elasticbeanstalk:application:environment"
    value     = 5432
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

# PUB - Products (Java Quarkus)
resource "aws_elastic_beanstalk_application" "beanstalk_fctuc_pub_products" {
  name        = "fctuc-pub-products"
  description = "pub products' micro-service"
}
resource "aws_elastic_beanstalk_application_version" "beanstalk_fctuc_pub_products_version" {
  application = aws_elastic_beanstalk_application.beanstalk_fctuc_pub_products.name
  bucket      = aws_s3_bucket.s3_bucket_fctuc_pub.id                        # bucket's id
  key         = aws_s3_bucket_object.s3_bucket_object_fctuc_pub_products.id # id of bucket with jar
  name        = "fctuc-pub-products-1.0.0"
}
resource "aws_elastic_beanstalk_environment" "beanstalk_fctuc_pub_products_env" {
  name                = "fctuc-pub-products-dev"
  application         = aws_elastic_beanstalk_application.beanstalk_fctuc_pub_products.name
  solution_stack_name = "64bit Amazon Linux 2 v3.4.7 running Corretto 11"
  version_label       = aws_elastic_beanstalk_application_version.beanstalk_fctuc_pub_products_version.name

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

  # database (mysql)
  setting {
    name      = "PUB_PRODUCTS_DATABASE_NAME"
    namespace = "aws:elasticbeanstalk:application:environment"
    value     = aws_db_instance.rds_fctuc_pub_products.name
  }
  setting {
    name      = "PUB_PRODUCTS_DATABASE_USERNAME"
    namespace = "aws:elasticbeanstalk:application:environment"
    value     = aws_db_instance.rds_fctuc_pub_products.username
  }
  setting {
    name      = "PUB_PRODUCTS_DATABASE_PASSWORD"
    namespace = "aws:elasticbeanstalk:application:environment"
    value     = aws_db_instance.rds_fctuc_pub_products.password
  }
  setting {
    name      = "PUB_PRODUCTS_DATABASE_URL"
    namespace = "aws:elasticbeanstalk:application:environment"
    value     = aws_db_instance.rds_fctuc_pub_products.endpoint
  }
}

# PUBLICTAIKI - Frontend (React)
resource "aws_elastic_beanstalk_application" "beanstalk_fctuc_pub_frontend" {
  name        = "fctuc-pub-frontend"
  description = "Publicitaki frontend's micro-service"
}
resource "aws_elastic_beanstalk_application_version" "beanstalk_fctuc_pub_frontend_version" {
  application = aws_elastic_beanstalk_application.beanstalk_fctuc_pub_frontend.name
  bucket      = aws_s3_bucket.s3_bucket_fctuc_pub.id                        # bucket's id
  key         = aws_s3_bucket_object.s3_bucket_object_fctuc_pub_frontend.id # id of bucket with jar
  name        = "fctuc-pub-frontend-1.0.0"
}
resource "aws_elastic_beanstalk_environment" "beanstalk_fctuc_pub_frontend_env" {
  name                = "fctuc-pub-frontend-dev"
  application         = aws_elastic_beanstalk_application.beanstalk_fctuc_pub_frontend.name
  solution_stack_name = "64bit Amazon Linux 2 v3.5.7 running Docker"
  version_label       = aws_elastic_beanstalk_application_version.beanstalk_fctuc_pub_frontend_version.name

  # Restful APIs endpoints
  setting {
    name      = "PUB_FRONTEND_PRODUCTS_URL"
    namespace = "aws:elasticbeanstalk:application:environment"
    value     = aws_elastic_beanstalk_environment.beanstalk_fctuc_pub_products_env.endpoint_url
  }
  setting {
    name      = "PUB_FRONTEND_NOTIFICATIONS_URL"
    namespace = "aws:elasticbeanstalk:application:environment"
    value     = aws_elastic_beanstalk_environment.beanstalk_fctuc_pub_notifications_env.endpoint_url
  }
  setting {
    name      = "PUB_FRONTEND_USERS_URL"
    namespace = "aws:elasticbeanstalk:application:environment"
    value     = aws_elastic_beanstalk_environment.beanstalk_fctuc_pub_users_env.endpoint_url
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
# PUB DATABASES
#

# Note that PUB-NOTIFICATIONS is already created on elastic beanstalk!

# PUB-USERS (Postgresql)
resource "aws_db_instance" "rds_fctuc_pub_users" {
  engine              = "postgres"
  engine_version      = "14.7"
  instance_class      = "db.t3.micro"
  allocated_storage   = 20
  storage_type        = "gp2"
  identifier          = "fctuc-pub-users-db"
  name                = "users_db" # db_name
  username            = var.pub_db_username
  password            = var.pub_db_password
  skip_final_snapshot = true

  vpc_security_group_ids = [aws_security_group.rds_postgres_security_group.id]
}

resource "aws_db_instance" "rds_fctuc_pub_notifications" {
  engine              = "postgres"
  engine_version      = "14.7"
  instance_class      = "db.t3.micro"
  allocated_storage   = 20
  storage_type        = "gp2"
  identifier          = "fctuc-pub-notifications-db"
  name                = "notifications_db" # db_name
  username            = var.pub_db_username
  password            = var.pub_db_password
  skip_final_snapshot = true

  vpc_security_group_ids = [aws_security_group.rds_postgres_security_group.id]
}

# PUB-PRODUCTS (MySQL)
resource "aws_db_instance" "rds_fctuc_pub_products" {
  engine               = "mysql"
  engine_version       = "8.0.32"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  storage_type         = "gp2"
  identifier           = "fctuc-pub-products-db"
  name                 = "products_db" # db_name
  username             = var.pub_db_username
  password             = var.pub_db_password
  parameter_group_name = "default.mysql8.0"
  skip_final_snapshot  = true

  vpc_security_group_ids = [aws_security_group.rds_mysql_security_group.id]
}
