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
output "frontend_bucket_name" {
  description = "Bucket S3 que recebe os arquivos do frontend"
  value       = aws_s3_bucket.frontend.bucket
}

output "cloudfront_distribution_id" {
  description = "ID da distribuição CloudFront do frontend"
  value       = aws_cloudfront_distribution.frontend.id
}

output "frontend_url" {
  description = "URL pública do frontend"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "github_deploy_role_arn" {
  description = "ARN da role usada pelo GitHub Actions via OIDC"
  value       = aws_iam_role.github_frontend_deploy.arn
}

output "frontend_aws_region" {
  description = "Região AWS configurada para o projeto"
  value       = var.aws_region
}