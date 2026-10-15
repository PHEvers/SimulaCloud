import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarQuestoes } from "../services/questions.js";
import ProgressBar from "../components/ProgressBar.jsx";
import QuestionCard from "../components/QuestionCard.jsx";

export default function Simulado() {
  const navigate = useNavigate();
  const [questoes, setQuestoes] = useState([]);
  const [indice, setIndice] = useState(0);
  const [alternativaSelecionada, setAlternativaSelecionada] = useState(null);
  const [confirmada, setConfirmada] = useState(false);
  const [respostas, setRespostas] = useState({});
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    buscarQuestoes(controller.signal)
      .then((lista) => setQuestoes(selecionarDezQuestoes(lista)))
      .catch((error) => {
        if (error.name !== "AbortError") setErro(error.message || "Erro ao carregar as questões.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregando(false);
      });
    return () => controller.abort();
  }, []);

  if (carregando) {
    return <div className="container"><p style={styles.mensagem}>Carregando questões...</p></div>;
  }

  if (erro) {
    return <div className="container"><p role="alert" style={styles.erro}>{erro}</p></div>;
  }

  const questaoAtual = questoes[indice];
  const ehUltima = indice === questoes.length - 1;

  function avancarQuestao() {
    if (!confirmada) {
      if (alternativaSelecionada) {
        setRespostas((atuais) => ({ ...atuais, [questaoAtual.id]: alternativaSelecionada }));
        setConfirmada(true);
      }
      return;
    }

    if (ehUltima) {
      navigate("/resultado", { state: { respostas, questoes } });
      return;
    }
    setIndice((i) => i + 1);
    setAlternativaSelecionada(null);
    setConfirmada(false);
  }

  function anterior() {
    setIndice((i) => Math.max(0, i - 1));
    setAlternativaSelecionada(null);
    setConfirmada(false);
  }

  return (
    <div className="container" style={{ paddingBottom: "88px" }}>
      <div style={{ marginTop: "32px", marginBottom: "24px" }}>
        <ProgressBar atual={indice + 1} total={questoes.length} />
      </div>

      <p style={styles.instrucao}>
        Selecione uma opção e confirme sua resposta para ver o resultado e a explicação.
      </p>

      <QuestionCard
        questao={questaoAtual}
        selecionada={alternativaSelecionada}
        confirmada={confirmada}
        onSelecionar={setAlternativaSelecionada}
      />

      <div style={styles.nav}>
        <button
          style={{ ...styles.navSecundario, ...(indice === 0 ? styles.desabilitado : {}) }}
          onClick={anterior}
          disabled={indice === 0}
        >
          Anterior
        </button>
        <span style={styles.contador}>{indice + 1} de {questoes.length}</span>
      </div>
      <button
        style={{ ...styles.botaoFixo, ...(!confirmada && !alternativaSelecionada ? styles.desabilitado : {}) }}
        onClick={avancarQuestao}
        disabled={!confirmada && !alternativaSelecionada}
      >
        {!confirmada ? "Confirmar resposta" : ehUltima ? "Ver resumo" : "Próxima pergunta"}
      </button>
      {ehUltima && (
        <button style={styles.voltar} onClick={() => navigate("/")}>
          Voltar para o início
        </button>
      )}
    </div>
  );
}

const styles = {
  instrucao: {
    color: "var(--text-muted)",
    fontSize: "14px",
    margin: "0 0 16px"
  },
  mensagem: { color: "var(--text-muted)", marginTop: "32px" },
  erro: { color: "var(--red)", marginTop: "32px" },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginTop: "20px"
  },
  contador: {
    color: "var(--text-muted)",
    fontSize: "13px",
    whiteSpace: "nowrap"
  },
  botaoFixo: {
    position: "fixed",
    right: "24px",
    bottom: "24px",
    zIndex: 10,
    background: "var(--gold)",
    color: "#241a05",
    border: "none",
    borderRadius: "6px",
    padding: "14px 24px",
    fontWeight: 600,
    cursor: "pointer"
  },
  navSecundario: {
    background: "transparent",
    color: "var(--text-muted)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    padding: "12px 24px",
    cursor: "pointer"
  },
  desabilitado: {
    opacity: 0.45,
    cursor: "not-allowed"
  },
  voltar: {
    width: "100%",
    marginTop: "12px",
    padding: "12px",
    background: "transparent",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    color: "var(--text)",
    cursor: "pointer"
  }
};

function selecionarDezQuestoes(lista) {
  const embaralhadas = [...lista];
  for (let i = embaralhadas.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [embaralhadas[i], embaralhadas[j]] = [embaralhadas[j], embaralhadas[i]];
  }
  return embaralhadas.slice(0, 10);
}
