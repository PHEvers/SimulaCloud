import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { questoes } from "../data/questions.js";
import ProgressBar from "../components/ProgressBar.jsx";
import QuestionCard from "../components/QuestionCard.jsx";

export default function Simulado() {
  const navigate = useNavigate();
  const [indice, setIndice] = useState(0);
  const questaoAtual = questoes[indice];
  const ehUltima = indice === questoes.length - 1;

  function proxima() {
    if (ehUltima) {
      setIndice(0);
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

      <p style={styles.instrucao}>
        Modo de estudo: a resposta correta e a explicação aparecem logo abaixo de cada questão.
      </p>

      <QuestionCard questao={questaoAtual} />

      <div style={styles.nav}>
        <button
          style={{ ...styles.navSecundario, ...(indice === 0 ? styles.desabilitado : {}) }}
          onClick={anterior}
          disabled={indice === 0}
        >
          Anterior
        </button>
        <span style={styles.contador}>{indice + 1} de {questoes.length}</span>
        <button style={styles.navPrimario} onClick={proxima}>
          {ehUltima ? "Recomeçar revisão" : "Próxima questão"}
        </button>
      </div>
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
