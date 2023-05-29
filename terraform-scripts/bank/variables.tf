variable "bank_db_username" {
  description = "USERNAME for the Bank's database"
  type        = string
}

variable "bank_db_password" {
  description = "PASSWORD for the Bank's database"
  type        = string
}

variable "bank_db_ip_permission" {
  description = "IP authorized to access bank's Database [example: 0.0.0.0/0]"
  type        = string
  default     = "0.0.0.0/0"
}

variable "bank_ssh_ip_permission" {
  description = "IP authorized to access SSH [example: 0.0.0.0/0]"
  type        = string
  default     = "0.0.0.0/0"
}


