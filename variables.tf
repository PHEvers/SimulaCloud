# ==============================================================================
# AWS PROVIDER & REGION CONFIGURATION
# ==============================================================================

variable "aws_region" {
  description = "Região da AWS onde os recursos de infraestrutura serão provisionados (ex: us-east-1, us-west-2, sa-east-1)."
  type        = string
  default     = "us-east-1"

  validation {
    condition     = can(regex("^[a-z]{2}-[a-z]+-[0-9]{1}$", var.aws_region))
    error_message = "A variável aws_region deve seguir o formato de região válido da AWS (ex: us-east-1)."
  }
}

# ==============================================================================
# GENERAL PROJECT CONFIGURATION
# ==============================================================================

variable "project_name" {
  description = "Nome base do projeto. Utilizado como prefixo para nomear todos os recursos provisionados."
  type        = string
  default     = "simulado-aws"

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.project_name))
    error_message = "O nome do projeto deve conter apenas letras minúsculas, números e hífens."
  }
}

variable "environment" {
  description = "Ambiente de implantação da aplicação. Define o sufixo nos nomes e identificadores dos recursos."
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "O ambiente deve ser obrigatoriamente um dos seguintes valores: 'dev', 'staging' ou 'prod'."
  }
}

# ==============================================================================
# AWS LAMBDA CONFIGURATION
# ==============================================================================

variable "lambda_runtime" {
  description = "Versão do runtime Python que será executado na função AWS Lambda."
  type        = string
  default     = "python3.12"
}

variable "lambda_memory" {
  description = "Quantidade de memória alocada para a função Lambda em megabytes (mínimo 128 MB, máximo 10240 MB)."
  type        = number
  default     = 256

  validation {
    condition     = var.lambda_memory >= 128 && var.lambda_memory <= 10240
    error_message = "A memória da Lambda deve estar entre 128 MB e 10240 MB."
  }
}

variable "lambda_timeout" {
  description = "Tempo máximo de execução contínua permitido para a função Lambda em segundos (mínimo 1s, máximo 900s)."
  type        = number
  default     = 10

  validation {
    condition     = var.lambda_timeout >= 1 && var.lambda_timeout <= 900
    error_message = "O timeout da Lambda deve estar entre 1 segundo e 900 segundos (15 minutos)."
  }
}

# ==============================================================================
# COMMON TAGS & GOVERNANCE
# ==============================================================================

variable "common_tags" {
  description = "Mapa de tags padrão aplicadas automaticamente a todos os recursos criados via default_tags no provider AWS."
  type        = map(string)
  default = {
    Environment = "dev"
    ManagedBy   = "terraform"
    Project     = "simulado-aws"
    Owner       = "devops"
  }
}
