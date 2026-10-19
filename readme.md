# SimulaCloud

Plataforma educacional de prática para a certificação AWS Certified Cloud Practitioner (CLF-C02).

## Estado atual

O MVP oferece um banco com 25 questões em português. O Simulado A apresenta cinco questões aleatórias por etapa. Ao terminar cada etapa, a pessoa pode responder mais cinco ou analisar o resultado acumulado. Após cada resposta confirmada, recebe o resultado e a explicação. O resumo mostra a pontuação, o percentual de acertos, o desempenho por domínio e a revisão das questões respondidas.

O Simulado A é o único disponível. Os simulados B e C estão em preparação. O perfil e o login ainda são demonstrativos; não há autenticação, histórico nem salvamento de progresso.

## Tecnologias

- Frontend: React 18, Vite 5 e React Router
- API: Amazon API Gateway HTTP API
- Backend: AWS Lambda com Python 3.12
- Banco em produção: Amazon DynamoDB, modo sob demanda
- Hospedagem: bucket S3 privado e Amazon CloudFront com OAC
- Infraestrutura: Terraform
- CI/CD do frontend: GitHub Actions com OIDC para acesso à AWS

## Arquitetura atual

    Navegador ── HTTPS ── CloudFront ── OAC ── S3 privado (arquivos do frontend)
         │
         └── HTTPS ── API Gateway ── Lambda ── DynamoDB (questões)

O frontend consulta GET /questions na API. A Lambda embaralha as alternativas e marca a resposta correta para o fluxo de estudo. Os arquivos do front-end são estáticos; a distribuição do CloudFront também encaminha rotas do React Router para index.html.

## Estrutura

    SimulaCloud/
    ├── .github/
    │   └── workflows/
    │       └── deploy-frontend.yml
    │       └── terraform-check.yml
    ├── lambda/
    │   └── lambda_function.py
    ├── simulacloud-frontend/
    │   └── frontend/
    │       ├── src/
    │       ├── package.json
    │       └── vite.config.js
    ├── populate_db.py
    ├── main.tf
    ├── frontend.tf
    ├── outputs.tf
    ├── variables.tf
    └── providers.tf

As questões de produção ficam no DynamoDB. Não há atualmente um arquivo JSON ou SQL de carga versionado na raiz do repositório.

## Executar o frontend localmente

Requisitos: Node.js 22 e npm.

No diretório simulacloud-frontend/frontend:

    npm ci
    npm run dev

Para gerar uma versão de produção:

    npm run build

O Vite grava os arquivos em frontend/dist. A URL da API está configurada em src/services/questions.js.

## Infraestrutura AWS com Terraform

Execute os comandos na raiz deste repositório, onde estão os arquivos Terraform:

    terraform init
    terraform plan
    terraform apply

Revise o plano antes de aplicar. A configuração cria a API, tabela DynamoDB, Lambda, bucket privado do frontend, distribuição CloudFront e a role OIDC para o workflow do GitHub.

Para consultar os valores de implantação:

    terraform output

Outputs usados pelo workflow:

- frontend_bucket_name → S3_BUCKET
- cloudfront_distribution_id → CLOUDFRONT_DISTRIBUTION_ID
- github_deploy_role_arn → AWS_ROLE_ARN
- frontend_aws_region → AWS_REGION

O arquivo terraform.tfvars é local e está no .gitignore. Não publique credenciais AWS nem chaves de acesso. A role do workflow usa OIDC e deve confiar somente no repositório e na branch configurados.

Para este repositório, a role aceita os subjects OIDC antigo e imutável da branch principal: `repo:PHEvers/SimulaCloud:ref:refs/heads/main` e `repo:PHEvers@113642670/SimulaCloud@1387502457:ref:refs/heads/main`. Ambos ficam limitados ao mesmo repositório e à branch `main`; configure a lista em `github_oidc_subjects` no `terraform.tfvars` e aplique a atualização da role.

## Publicação automática do frontend

O workflow .github/workflows/deploy-frontend.yml roda em push na branch main quando há alterações no frontend ou no próprio workflow. Também pode ser iniciado manualmente pelo GitHub Actions.

Ele instala as dependências, cria o build, sincroniza frontend/dist com o bucket S3 e invalida o cache do CloudFront. Cadastre como variáveis do repositório GitHub:

- AWS_ROLE_ARN
- AWS_REGION
- S3_BUCKET
- CLOUDFRONT_DISTRIBUTION_ID

O deploy automático publica apenas o frontend. Alterações no Terraform ou no backend precisam ser aplicadas separadamente.

## CI da infraestrutura

O workflow `.github/workflows/terraform-check.yml` executa `terraform init` sem backend remoto e `terraform validate` em pull requests e pushes para `main` que alterem arquivos Terraform. Essa etapa verifica a configuração, mas não cria nem atualiza recursos AWS.

O state atual do Terraform é local. Antes de automatizar `terraform plan` ou `terraform apply` no GitHub Actions, migre esse state para um backend remoto S3 com bloqueio de estado e configure o acesso OIDC da role para ler e gravar somente nesse backend. Até essa migração, aplique mudanças de infraestrutura manualmente após revisar `terraform plan`.

## Banco de questões

O script `populate_db.py` carrega questões de um arquivo JSON fornecido pelo operador. Para gravá-las diretamente no DynamoDB, configure credenciais AWS locais com permissão de escrita na tabela e execute na raiz:

    python populate_db.py caminho/para/questoes.json

O nome padrão da tabela é simulado-aws-questions-dev. Também é possível fornecer outro nome de tabela como segundo argumento. Para enviar os registros pela API, informe a URL base como segundo argumento:

    python populate_db.py caminho/para/questoes.json https://71hxc7kuc2.execute-api.us-east-1.amazonaws.com

O endpoint POST /questions grava o item com o mesmo ID, substituindo a versão existente. Preserve os IDs, correctOption e correctIndex ao editar enunciados ou alternativas para manter o gabarito consistente.

## Rotas do frontend

- / — apresentação do projeto e início do simulado
- /simulados — simulados disponíveis e em preparação
- /simulado/A — etapas de 5 questões, com opção de continuar ou ver o resultado acumulado
- /resultado — resumo e revisão da tentativa atual
- /perfil — placeholder demonstrativo

## Limitações atuais

- Apenas o Simulado A está disponível.
- O Simulado A oferece as questões em etapas de cinco; a pessoa escolhe quando encerrar e analisar o resultado.
- Resultados e respostas não são salvos entre sessões.
- Cadastro e autenticação ainda não foram implementados.
- O projeto é independente e não possui vínculo, patrocínio ou endosso da Amazon Web Services.

## Licença

Projeto desenvolvido para estudo e portfólio.
