variable "lambda_runtime" {
  description = "Runtime utilizado na função AWS Lambda"
  type        = string
  default     = "python3.12"
}

variable "lambda_memory" {
  description = "Quantidade de memória alocada para a Lambda (em MB)"
  type        = number
  default     = 256
}

variable "lambda_timeout" {
  description = "Tempo máximo de execução da Lambda (em segundos)"
  type        = number
  default     = 10
}

variable "common_tags" {
  description = "Tags padrão aplicadas a todos os recursos da infraestrutura"
  type        = map(string)
  default = {
    Environment = "dev"
    ManagedBy   = "terraform"
    Project     = "simulado-aws"
    Owner       = "devops"
  }
}