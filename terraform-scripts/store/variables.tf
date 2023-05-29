variable "store_db_username" {
  description = "USERNAME for the Store's databases"
  type        = string
}

variable "store_db_password" {
  description = "PASSWORD for the Store's databases"
  type        = string
}

variable "store_db_ip_permission" {
  description = "IP authorized to access store's Databases [example: 0.0.0.0/0]"
  type        = string
  default     = "0.0.0.0/0"
}

variable "store_ssh_ip_permission" {
  description = "IP authorized to access SSH [example: 0.0.0.0/0]"
  type        = string
  default     = "0.0.0.0/0"
}


