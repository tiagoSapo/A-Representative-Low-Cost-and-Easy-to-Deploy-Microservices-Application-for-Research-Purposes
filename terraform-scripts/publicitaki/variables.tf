variable "pub_db_username" {
  description = "USERNAME for the Publicitaki's databases"
  type        = string
}

variable "pub_db_password" {
  description = "PASSWORD for the Publicitaki's databases"
  type        = string
}

variable "pub_db_ip_permission" {
  description = "IP authorized to access Publicitaki's Databases [example: 0.0.0.0/0]"
  type        = string
  default     = "0.0.0.0/0"
}

variable "pub_ssh_ip_permission" {
  description = "IP authorized to access SSH [example: 0.0.0.0/0]"
  type        = string
  default     = "0.0.0.0/0"
}


