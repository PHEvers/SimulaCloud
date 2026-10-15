const API_URL = "https://71hxc7kuc2.execute-api.us-east-1.amazonaws.com/questions?shuffle=true";

const DOMINIO_POR_NOME = {
  "Conceitos de Nuvem": "conceitos",
  "Segurança e Conformidade": "seguranca",
  "Tecnologia e Serviços": "tecnologia",
  "Faturamento e Precificação": "financeiro",
  "Cobrança, Preços e Suporte": "financeiro"
};

function normalizarQuestao(item) {
  if (!item || !Array.isArray(item.options) || item.options.length === 0) {
    throw new Error("A API retornou uma questão em formato inválido.");
  }

  const alternativas = item.options.map((opcao, indice) => ({
    id: String.fromCharCode(97 + indice),
    texto: typeof opcao === "string" ? opcao : opcao.text
  }));
  const corretaIndex = item.options.findIndex((opcao) => typeof opcao === "object" && opcao.isCorrect);
  const respostaCorreta = corretaIndex >= 0
    ? corretaIndex
    : Number.isInteger(item.correctIndex)
      ? item.correctIndex
      : typeof item.correctOption === "string"
        ? item.correctOption.toUpperCase().charCodeAt(0) - 65
        : -1;

  if (!item.question || respostaCorreta < 0 || respostaCorreta >= alternativas.length) {
    throw new Error("A API retornou uma questão sem enunciado ou resposta correta válida.");
  }

  return {
    id: String(item.id),
    dominio: DOMINIO_POR_NOME[item.domain] ?? "conceitos",
    enunciado: item.question,
    alternativas,
    correta: alternativas[respostaCorreta].id,
    explicacao: item.explanation ?? ""
  };
}

export async function buscarQuestoes(signal) {
  const response = await fetch(API_URL, { signal });
  if (!response.ok) {
    throw new Error(`Não foi possível carregar as questões (HTTP ${response.status}).`);
  }

  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("A API não retornou questões disponíveis.");
  }

  return data.map(normalizarQuestao);
}
