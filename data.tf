# Zip do código Python da função Lambda
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/lambda/lambda_function.py"
  output_path = "${path.module}/lambda_function.zip"
}

# Informações da conta AWS atual
data "aws_caller_identity" "current" {}

# Informações da região AWS configurada
data "aws_region" "current" {}
