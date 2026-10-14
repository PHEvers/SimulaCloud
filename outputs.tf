output "api_url" {
  description = "URL base do API Gateway HTTP API"
  value       = aws_apigatewayv2_api.http_api.api_endpoint
}

output "lambda_arn" {
  description = "ARN da função AWS Lambda"
  value       = aws_lambda_function.api_lambda.arn
}

output "dynamodb_table_name" {
  description = "Nome da tabela Amazon DynamoDB"
  value       = aws_dynamodb_table.questions.name
}

output "dynamodb_table_arn" {
  description = "ARN da tabela Amazon DynamoDB"
  value       = aws_dynamodb_table.questions.arn
}
