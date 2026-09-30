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
