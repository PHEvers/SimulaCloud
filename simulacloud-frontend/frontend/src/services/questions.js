import { fetchAuthSession } from "aws-amplify/auth";
import { cognitoConfigured } from "./cognito.js";
const API_URL = (import.meta.env.VITE_API_URL || "https://71hxc7kuc2.execute-api.us-east-1.amazonaws.com").replace(/\/$/, "");
export async function api(path, options = {}) {
  const session = cognitoConfigured ? await fetchAuthSession() : null;
  const token = session?.tokens?.accessToken?.toString();
  const response = await fetch(API_URL + path, { ...options, headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}), ...options.headers } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Não foi possível concluir a operação.");
  return data;
}

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

export async function buscarQuestoes(signal, simulado = "A") {
  const data = await api("/questions?shuffle=true&simulado=" + encodeURIComponent(simulado), { signal });
  if (!Array.isArray(data) || !data.length) throw new Error("Este simulado ainda não possui questões.");
  return data.map(normalizarQuestao);
}
