resource "aws_cognito_user_pool" "users" {
  # Nome do pool. As variáveis permitem diferenciar o projeto e o ambiente,
  # por exemplo: "minha-app-users-dev".
  name = "${var.project_name}-users-${var.environment}"

  # Usa o e-mail como identificador para login, em vez de exigir um username separado.
  username_attributes = ["email"]

  # O Cognito envia um código ou link para confirmar que o usuário controla o e-mail.
  auto_verified_attributes = ["email"]

  # Regras para as senhas dos usuários.
  password_policy {
    minimum_length = 8       # Exige pelo menos 8 caracteres.
    require_lowercase = true # Exige ao menos uma letra minúscula.
    require_uppercase = true # Exige ao menos uma letra maiúscula.
    require_numbers  = true # Exige ao menos um número.
    require_symbols  = true # Exige ao menos um símbolo, como ! ou @.

    # Uma senha temporária, como a criada por um administrador,
    # pode ser usada por até 7 dias antes de expirar.
    temporary_password_validity_days = 7
  }

  # Define o atributo de usuário "email".
  schema {
    name                = "email"
    attribute_data_type = "String" # O valor do atributo é texto.

    required = true # Todo usuário precisa ter um e-mail.
    mutable  = true # O e-mail pode ser alterado depois da criação da conta.
  }

  # Aplica as tags comuns do projeto, úteis para organização e custos na AWS.
  tags = var.common_tags
}

resource "aws_cognito_user_pool_client" "web" {
  # Nome deste client, que representa o aplicativo web conectado ao pool.
  name = "${var.project_name}-web-${var.environment}"

  # Liga o client ao pool de usuários criado acima.
  user_pool_id = aws_cognito_user_pool.users.id

  # Aplicativos executados no navegador não conseguem proteger um segredo.
  # Por isso, este client é público e não gera um client secret.
  generate_secret = false

  # Métodos de autenticação permitidos para este client.
  explicit_auth_flows = [
    # SRP é um método de login que evita enviar a senha diretamente ao Cognito.
    "ALLOW_USER_SRP_AUTH",

    # Permite usar um refresh token para renovar a sessão sem novo login.
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]

  # Permite revogar tokens, por exemplo, ao encerrar sessões de um usuário.
  enable_token_revocation = true

  # Evita respostas que revelem se um usuário ou e-mail existe no pool.
  # Isso reduz a possibilidade de alguém enumerar contas válidas.
  prevent_user_existence_errors = "ENABLED"

  # Duração dos tokens. As unidades são definidas no bloco abaixo:
  access_token_validity  = 60 # Token de acesso válido por 60 minutos.
  id_token_validity      = 60 # Token de identidade válido por 60 minutos.
  refresh_token_validity = 30 # Refresh token válido por 30 dias.

  # Define a unidade usada nos valores de validade acima.
  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }
}
resource "aws_cognito_user_group" "roles" {
  for_each = toset(["Admin", "Colaborador", "Basico"])
  name = each.value
  user_pool_id = aws_cognito_user_pool.users.id
}
