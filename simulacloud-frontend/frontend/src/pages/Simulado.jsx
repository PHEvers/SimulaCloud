import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { questoes } from "../data/questions.js";
import ProgressBar from "../components/ProgressBar.jsx";
import QuestionCard from "../components/QuestionCard.jsx";

export default function Simulado() {
  const navigate = useNavigate();
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState({});

  const questaoAtual = questoes[indice];
  const ehUltima = indice === questoes.length - 1;

  function selecionar(alternativaId) {
    setRespostas((prev) => ({ ...prev, [questaoAtual.id]: alternativaId }));
  }

  function proxima() {
    if (ehUltima) {
      navigate("/resultado", { state: { respostas } });
    } else {
      setIndice((i) => i + 1);
    }
  }

  function anterior() {
    setIndice((i) => Math.max(0, i - 1));
  }

  return (
    <div className="container">
      <div style={{ marginTop: "32px", marginBottom: "24px" }}>
        <ProgressBar atual={indice + 1} total={questoes.length} />
      </div>

      <QuestionCard
        questao={questaoAtual}
        respostaSelecionada={respostas[questaoAtual.id]}
        onSelecionar={selecionar}
      />

      <div style={styles.nav}>
        <button
          style={styles.navSecundario}
          onClick={anterior}
          disabled={indice === 0}
        >
          Anterior
        </button>
        <button
          style={styles.navPrimario}
          onClick={proxima}
          disabled={!respostas[questaoAtual.id]}
        >
          {ehUltima ? "Ver resultado" : "Próxima"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px"
  },
  navPrimario: {
    background: "var(--gold)",
    color: "#241a05",
    border: "none",
    borderRadius: "6px",
    padding: "12px 24px",
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
  }
};
