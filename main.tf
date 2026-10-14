# ==============================================================================
# 1. DATABASE LAYER (AMAZON DYNAMODB)
# ==============================================================================

# Tabela DynamoDB para armazenar as questões do simulado (Modo Pay-Per-Request)
resource "aws_dynamodb_table" "questions" {
  name         = "${var.project_name}-questions-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-dynamodb-${var.environment}"
  })
}

# ==============================================================================
# 2. SECURITY & IAM LAYER (AWS IAM)
# ==============================================================================

# IAM Role de execução para a função Lambda
resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-lambda-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })

  tags = var.common_tags
}

# IAM Policy com princípio de Menor Privilégio (Least Privilege)
resource "aws_iam_policy" "lambda_policy" {
  name        = "${var.project_name}-lambda-policy-${var.environment}"
  description = "Permissoes granulares para CloudWatch Logs e leitura/escrita na tabela DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "CloudWatchLogsAccess"
        Effect   = "Allow"
        Action   = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Sid      = "DynamoDBQuestionsAccess"
        Effect   = "Allow"
        Action   = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Scan",
          "dynamodb:DeleteItem"
        ]
        Resource = aws_dynamodb_table.questions.arn
      }
    ]
  })
}

# Vincula a IAM Policy à IAM Role da Lambda
resource "aws_iam_role_policy_attachment" "lambda_attach" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

# ==============================================================================
# 3. COMPUTE LAYER (AWS LAMBDA)
# ==============================================================================

# Função AWS Lambda em Python 3.12
resource "aws_lambda_function" "api_lambda" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = "${var.project_name}-fn-${var.environment}"
  role             = aws_iam_role.lambda_role.arn
  handler          = "lambda_function.lambda_handler"
  runtime          = var.lambda_runtime
  memory_size      = var.lambda_memory
  timeout          = var.lambda_timeout
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.questions.name
    }
  }

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-lambda-${var.environment}"
  })
}

# ==============================================================================
# 4. OBSERVABILITY LAYER (AMAZON CLOUDWATCH)
# ==============================================================================

# Log Group do CloudWatch com retenção automática de 7 dias
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${aws_lambda_function.api_lambda.function_name}"
  retention_in_days = 7

  tags = var.common_tags
}

# ==============================================================================
# 5. API GATEWAY LAYER (AMAZON API GATEWAY HTTP API v2 WITH CORS)
# ==============================================================================

# API Gateway HTTP API v2 com suporte nativo a CORS
resource "aws_apigatewayv2_api" "http_api" {
  name          = "${var.project_name}-api-${var.environment}"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "DELETE", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization", "X-Api-Key", "X-Amz-Date"]
    max_age       = 300
  }

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-apigw-${var.environment}"
  })
}

# Stage padrão com auto-deploy ativado
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

# Integração do API Gateway com a Lambda (AWS_PROXY v2.0)
resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.api_lambda.invoke_arn
  payload_format_version = "2.0"
}

# Mapeamento dinâmico das rotas da API
resource "aws_apigatewayv2_route" "routes" {
  for_each = toset([
    "GET /questions",
    "GET /questions/{id}",
    "POST /questions",
    "DELETE /questions/{id}"
  ])

  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = each.value
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

# Permissão para o API Gateway invocar a Lambda
resource "aws_lambda_permission" "api_gw_permission" {
  statement_id  = "APIGatewayInvokePermission"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda.function_name
  principal     = join(".", ["apigateway", "amazonaws", "com"])
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}
