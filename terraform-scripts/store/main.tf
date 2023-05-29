#
# SCRIPT Store
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
    cidr_blocks = [var.store_ssh_ip_permission]
  }
}
resource "aws_security_group" "rds_mysql_security_group" {
  name_prefix = "rds-mysql-"
  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = [var.store_db_ip_permission]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
resource "aws_security_group" "rds_postgres_security_group" {
  name_prefix = "rds-postgres-"
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [var.store_db_ip_permission]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

#
#  S3 - BUCKET (with code)
#
resource "aws_s3_bucket" "s3_bucket_fctuc_store" {
  bucket = "fctuc-store-bucket"
  acl    = "private"
}
# store frontend - C#
resource "aws_s3_bucket_object" "s3_bucket_object_fctuc_store_frontend" {
  bucket = aws_s3_bucket.s3_bucket_fctuc_store.id
  key    = "beanstalk/fctuc-store-frontend"
  source = "executables/Archive.zip" # asp.net path on local machine
}
# store users - Java Spring
resource "aws_s3_bucket_object" "s3_bucket_object_fctuc_store_users" {
  bucket = aws_s3_bucket.s3_bucket_fctuc_store.id
  key    = "beanstalk/fctuc-store-users"
  source = "executables/store-users.jar" # path on local machine
}
# store products - Django 
resource "aws_s3_bucket_object" "s3_bucket_object_fctuc_store_products" {
  bucket = aws_s3_bucket.s3_bucket_fctuc_store.id
  key    = "beanstalk/fctuc-store-products"
  source = "executables/store-products.zip" # jar path on local machine
}
# store notifications - Django
resource "aws_s3_bucket_object" "s3_bucket_object_fctuc_store_notifications" {
  bucket = aws_s3_bucket.s3_bucket_fctuc_store.id
  key    = "beanstalk/fctuc-store-notifications"
  source = "executables/store-notifications.zip" # path on local machine
}


#
# Store DATABASE
#
# Store Notifications (Postgres)
resource "aws_db_instance" "rds_fctuc_store_notifications" {
  engine              = "postgres"
  instance_class      = "db.t3.micro"
  allocated_storage   = 20
  storage_type        = "gp2"
  identifier          = "fctuc-store-notifications-db"
  name                = "storenotifications" # db_name
  username            = var.store_db_username
  password            = var.store_db_password
  skip_final_snapshot = true
  publicly_accessible = true

  engine_version         = "14.7"
  multi_az               = false
  port                   = 5432
  storage_encrypted      = false
  vpc_security_group_ids = ["${aws_security_group.rds_postgres_security_group.id}"]
}
# Store Users (Postgres)
resource "aws_db_instance" "rds_fctuc_store_users" {
  engine              = "postgres"
  instance_class      = "db.t3.micro"
  allocated_storage   = 20
  storage_type        = "gp2"
  identifier          = "fctuc-store-users-db"
  name                = "storeusers" # db_name
  username            = var.store_db_username
  password            = var.store_db_password
  skip_final_snapshot = true
  publicly_accessible = true

  engine_version         = "14.7"
  multi_az               = false
  port                   = 5432
  storage_encrypted      = false
  vpc_security_group_ids = ["${aws_security_group.rds_postgres_security_group.id}"]
}
# Store Products (Mysql)
resource "aws_db_instance" "rds_fctuc_store_products" {
  engine               = "mysql"
  engine_version       = "8.0.32"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  storage_type         = "gp2"
  identifier           = "fctuc-store-products-db"
  name                 = "storeproducts" # db_name
  username             = var.store_db_username
  password             = var.store_db_password
  parameter_group_name = "default.mysql8.0"
  skip_final_snapshot  = true

  vpc_security_group_ids = [aws_security_group.rds_mysql_security_group.id]
}


#
#  EB - ELASTIC BEANSTALK APP (with 'VERSION' AND 'ENVIRONMENT')
#

# Store - Notifications (Django)
resource "aws_elastic_beanstalk_application" "beanstalk_fctuc_store_notifications" {
  name        = "fctuc-store-notifications"
  description = "store notifications' micro-service"
}
resource "aws_elastic_beanstalk_application_version" "beanstalk_fctuc_store_notifications_version" {
  application = aws_elastic_beanstalk_application.beanstalk_fctuc_store_notifications.name
  bucket      = aws_s3_bucket.s3_bucket_fctuc_store.id                             # bucket's id
  key         = aws_s3_bucket_object.s3_bucket_object_fctuc_store_notifications.id # id of bucket with jar
  name        = "fctuc-store-notifications-1.0.0"
}
resource "aws_elastic_beanstalk_environment" "beanstalk_fctuc_store_notifications_env" {
  name                = "fctuc-store-notifications-dev"
  application         = aws_elastic_beanstalk_application.beanstalk_fctuc_store_notifications.name
  solution_stack_name = "64bit Amazon Linux 2 v3.5.2 running Python 3.8"
  version_label       = aws_elastic_beanstalk_application_version.beanstalk_fctuc_store_notifications_version.name

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

  # database url, name, password, db-name
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_ENGINE"
    value     = "django.db.backends.postgresql"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_URL"
    value     = aws_db_instance.rds_fctuc_store_notifications.endpoint
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_PORT"
    value     = "" # port is not necessary
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_USER"
    value     = aws_db_instance.rds_fctuc_store_notifications.username
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_PASSWORD"
    value     = aws_db_instance.rds_fctuc_store_notifications.password
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_NAME"
    value     = aws_db_instance.rds_fctuc_store_notifications.name
  }

  # make migrations
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "PRE_BUILD"
    value     = "python3 manage.py makemigrations && python3 manage.py migrate --noinput"
  }
}

# Store - products (Django)
resource "aws_elastic_beanstalk_application" "beanstalk_fctuc_store_products" {
  name        = "fctuc-store-products"
  description = "store products' micro-service"
}
resource "aws_elastic_beanstalk_application_version" "beanstalk_fctuc_store_products_version" {
  application = aws_elastic_beanstalk_application.beanstalk_fctuc_store_products.name
  bucket      = aws_s3_bucket.s3_bucket_fctuc_store.id                        # bucket's id
  key         = aws_s3_bucket_object.s3_bucket_object_fctuc_store_products.id # id of bucket with jar
  name        = "fctuc-store-products-1.0.0"
}
resource "aws_elastic_beanstalk_environment" "beanstalk_fctuc_store_products_env" {
  name                = "fctuc-store-products-dev"
  application         = aws_elastic_beanstalk_application.beanstalk_fctuc_store_products.name
  solution_stack_name = "64bit Amazon Linux 2 v3.5.2 running Python 3.8"
  version_label       = aws_elastic_beanstalk_application_version.beanstalk_fctuc_store_products_version.name

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

  # database url, name, password, db-name (mysql)
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_ENGINE"
    value     = "django.db.backends.mysql"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_URL"
    value     = aws_db_instance.rds_fctuc_store_products.endpoint
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_PORT"
    value     = "" # port is not necessary
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_USER"
    value     = aws_db_instance.rds_fctuc_store_products.username
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_PASSWORD"
    value     = aws_db_instance.rds_fctuc_store_products.password
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_NAME"
    value     = aws_db_instance.rds_fctuc_store_products.name
  }

  # make migrations
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "PRE_BUILD"
    value     = "sudo yum install -y mysql-devel && pip install -r requirements.txt && python3 manage.py makemigrations && python3 manage.py migrate --noinput"
  }
}

# Store - Users (Java Spring Boot)
resource "aws_elastic_beanstalk_application" "beanstalk_fctuc_store_users" {
  name        = "fctuc-store-users"
  description = "store users' micro-service"
}
resource "aws_elastic_beanstalk_application_version" "beanstalk_fctuc_store_users_version" {
  application = aws_elastic_beanstalk_application.beanstalk_fctuc_store_users.name
  bucket      = aws_s3_bucket.s3_bucket_fctuc_store.id                     # bucket's id
  key         = aws_s3_bucket_object.s3_bucket_object_fctuc_store_users.id # id of bucket with jar
  name        = "fctuc-store-users-1.0.0"
}
resource "aws_elastic_beanstalk_environment" "beanstalk_fctuc_store_users_env" {
  name                = "fctuc-store-users-dev"
  application         = aws_elastic_beanstalk_application.beanstalk_fctuc_store_users.name
  solution_stack_name = "64bit Amazon Linux 2 v3.4.7 running Corretto 11"
  version_label       = aws_elastic_beanstalk_application_version.beanstalk_fctuc_store_users_version.name

  # database url, name, password, db-name
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_URL"
    value     = aws_db_instance.rds_fctuc_store_users.endpoint
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_USER"
    value     = aws_db_instance.rds_fctuc_store_users.username
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_DRIVER"
    value     = "org.postgresql.Driver"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_PASSWORD"
    value     = aws_db_instance.rds_fctuc_store_users.password
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_NAME"
    value     = aws_db_instance.rds_fctuc_store_users.name
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

# Store - Frontend (C# ASP.NET Core MVC)
resource "aws_elastic_beanstalk_application" "beanstalk_fctuc_store_frontend" {
  name        = "fctuc-store-frontend"
  description = "store frontend's micro-service"
}
resource "aws_elastic_beanstalk_application_version" "beanstalk_fctuc_store_frontend_version" {
  application = aws_elastic_beanstalk_application.beanstalk_fctuc_store_frontend.name
  bucket      = aws_s3_bucket.s3_bucket_fctuc_store.id                        # bucket's id
  key         = aws_s3_bucket_object.s3_bucket_object_fctuc_store_frontend.id # id of bucket with jar
  name        = "fctuc-store-frontend-1.0.0"
}
resource "aws_elastic_beanstalk_environment" "beanstalk_fctuc_store_frontend_env" {
  name                = "fctuc-store-frontend-dev"
  application         = aws_elastic_beanstalk_application.beanstalk_fctuc_store_frontend.name
  solution_stack_name = "64bit Amazon Linux 2 v2.5.3 running .NET Core"
  version_label       = aws_elastic_beanstalk_application_version.beanstalk_fctuc_store_frontend_version.name

  # Users (java) micro-service's endpoint url
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "STORE_USERS_URL"
    value     = aws_elastic_beanstalk_environment.beanstalk_fctuc_store_users_env.endpoint_url
  }
  # Products (django) micro-service's endpoint url
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "STORE_PRODUCTS_URL"
    value     = aws_elastic_beanstalk_environment.beanstalk_fctuc_store_products_env.endpoint_url
  }
  # Notifications (django) micro-service's endpoint url
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "STORE_NOTIFICATIONS_URL"
    value     = aws_elastic_beanstalk_environment.beanstalk_fctuc_store_notifications_env.endpoint_url
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
