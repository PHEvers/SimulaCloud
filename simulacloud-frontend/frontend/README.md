# SimulaCloud — Frontend

MVP do frontend do SimulaCloud: seleção de simulado, navegação entre
questões, resultado final e desempenho por domínio (AWS CLF-C02).

## Stack

- React 18 + Vite
- React Router (navegação entre Home / Simulado / Resultado)
- Sem CSS framework — estilos em JS por componente, tokens em `src/index.css`

## Rodando localmente

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`.

### Conectar ao Amazon Cognito

1. Na raiz do Terraform, execute `terraform output cognito_user_pool_id` e `terraform output cognito_app_client_id`.
2. Copie `.env.example` para `.env.local` e substitua os valores de exemplo pelos outputs.
3. Reinicie o servidor Vite para carregar as variáveis `VITE_COGNITO_USER_POOL_ID` e `VITE_COGNITO_APP_CLIENT_ID`.

O cadastro e o login usam o AWS Amplify Auth conectado ao User Pool existente. O frontend não precisa de Identity Pool nem de client secret. Em produção, configure as mesmas variáveis como Actions Variables no GitHub, junto com `AWS_ROLE_ARN`, `AWS_REGION`, `S3_BUCKET` e `CLOUDFRONT_DISTRIBUTION_ID`.

O acesso às questões continua público. A tela de perfil identifica a conta autenticada, mas o histórico ainda não é persistido: isso exige endpoints protegidos na API e uma tabela apropriada.

## Estrutura

```
src/
├── data/questions.js      # banco de questões mockado (troque pela API depois)
├── components/            # Header, ProgressBar, QuestionCard
├── pages/                 # Home, Simulado, Resultado
├── App.jsx                # rotas
└── main.jsx                # entrypoint
```

## Próximos passos sugeridos

- Trocar `src/data/questions.js` por chamada à API do backend
- Adicionar tela de login/cadastro (opcional, conforme roadmap)
- Persistir histórico de simulados
- Dockerfile para build da imagem de produção (Nginx servindo `dist/`)
