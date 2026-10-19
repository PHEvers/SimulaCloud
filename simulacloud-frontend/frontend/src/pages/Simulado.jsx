import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarQuestoes } from "../services/questions.js";
import ProgressBar from "../components/ProgressBar.jsx";
import QuestionCard from "../components/QuestionCard.jsx";

export default function Simulado() {
  const navigate = useNavigate();
  const [questoes, setQuestoes] = useState([]);
  const [indice, setIndice] = useState(0);
  const [limiteQuestoes, setLimiteQuestoes] = useState(0);
  const [alternativaSelecionada, setAlternativaSelecionada] = useState(null);
  const [confirmada, setConfirmada] = useState(false);
  const [escolhendoContinuacao, setEscolhendoContinuacao] = useState(false);
  const [respostas, setRespostas] = useState({});
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    buscarQuestoes(controller.signal)
      .then((lista) => {
        const embaralhadas = embaralharQuestoes(lista);
        setQuestoes(embaralhadas);
        setLimiteQuestoes(Math.min(5, embaralhadas.length));
      })
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
  const ehUltimaDoBloco = indice === limiteQuestoes - 1;
  const temMaisQuestoes = limiteQuestoes < questoes.length;

  function analisarResultado() {
    navigate("/resultado", {
      state: { respostas, questoes: questoes.slice(0, limiteQuestoes) }
    });
  }

  function carregarMaisQuestoes() {
    setIndice(limiteQuestoes);
    setLimiteQuestoes((limite) => Math.min(limite + 5, questoes.length));
    setAlternativaSelecionada(null);
    setConfirmada(false);
    setEscolhendoContinuacao(false);
  }

  function avancarQuestao() {
    if (!confirmada) {
      if (alternativaSelecionada) {
        setRespostas((atuais) => ({ ...atuais, [questaoAtual.id]: alternativaSelecionada }));
        setConfirmada(true);
      }
      return;
    }

    if (ehUltimaDoBloco) {
      if (temMaisQuestoes) {
        setEscolhendoContinuacao(true);
        return;
      }
      analisarResultado();
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

  if (escolhendoContinuacao) {
    return (
      <section className="container" style={styles.escolhaContainer}>
        <span className="mono page-eyebrow">SIMULADO EM ANDAMENTO</span>
        <h1 style={styles.escolhaTitulo}>Você respondeu {limiteQuestoes} questões</h1>
        <p style={styles.escolhaTexto}>
          Quer continuar praticando com mais 5 questões ou analisar seu resultado até aqui?
        </p>
        <div style={styles.escolhaAcoes}>
          <button style={styles.botaoContinuar} onClick={carregarMaisQuestoes}>
            Responder mais 5 questões
          </button>
          <button style={styles.botaoAnalisar} onClick={analisarResultado}>
            Analisar resultado
          </button>
        </div>
        <p style={styles.questoesRestantes}>
          {questoes.length - limiteQuestoes} questões disponíveis neste simulado.
        </p>
      </section>
    );
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
        <span style={styles.contador}>{indice + 1} de {questoes.length} questões</span>
      </div>
      <button
        style={{ ...styles.botaoFixo, ...(!confirmada && !alternativaSelecionada ? styles.desabilitado : {}) }}
        onClick={avancarQuestao}
        disabled={!confirmada && !alternativaSelecionada}
      >
        {!confirmada
          ? "Confirmar resposta"
          : ehUltimaDoBloco
            ? temMaisQuestoes ? "Continuar" : "Ver resultado"
            : "Próxima pergunta"}
      </button>
      {indice === questoes.length - 1 && (
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
  escolhaContainer: { paddingTop: "clamp(48px, 12vh, 120px)", maxWidth: "760px" },
  escolhaTitulo: { margin: "14px 0 12px", fontSize: "clamp(28px, 5vw, 42px)" },
  escolhaTexto: { color: "var(--text-muted)", lineHeight: 1.7, margin: "0 0 28px" },
  escolhaAcoes: { display: "flex", flexWrap: "wrap", gap: "12px" },
  botaoContinuar: {
    background: "var(--gold)",
    color: "#241a05",
    border: "none",
    borderRadius: "6px",
    padding: "14px 20px",
    fontWeight: 700,
    cursor: "pointer"
  },
  botaoAnalisar: {
    background: "transparent",
    color: "var(--text)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    padding: "14px 20px",
    fontWeight: 600,
    cursor: "pointer"
  },
  questoesRestantes: { color: "var(--text-muted)", fontSize: "13px", marginTop: "20px" },
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

function embaralharQuestoes(lista) {
  const embaralhadas = [...lista];
  for (let i = embaralhadas.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [embaralhadas[i], embaralhadas[j]] = [embaralhadas[j], embaralhadas[i]];
  }
  return embaralhadas;
}
