import { DOMINIOS } from "../data/questions.js";

export default function QuestionCard({ questao, respostaSelecionada, onSelecionar }) {
  return (
    <div style={styles.card}>
      <span style={styles.dominio}>{DOMINIOS[questao.dominio]}</span>
      <h2 style={styles.enunciado}>{questao.enunciado}</h2>

      <div style={styles.alternativas}>
        {questao.alternativas.map((alt) => {
          const selecionada = respostaSelecionada === alt.id;
          return (
            <button
              key={alt.id}
              onClick={() => onSelecionar(alt.id)}
              style={{
                ...styles.alternativa,
                ...(selecionada ? styles.alternativaSelecionada : {})
              }}
            >
              <span
                style={{
                  ...styles.letra,
                  ...(selecionada ? styles.letraSelecionada : {})
                }}
              >
                {alt.id.toUpperCase()}
              </span>
              <span>{alt.texto}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "28px",
    borderLeft: "3px solid var(--teal)"
  },
  dominio: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    color: "var(--teal)",
    textTransform: "none"
  },
  enunciado: {
    fontSize: "19px",
    fontWeight: 500,
    fontFamily: "var(--font-body)",
    margin: "12px 0 24px",
    lineHeight: 1.5
  },
  alternativas: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  alternativa: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    textAlign: "left",
    background: "var(--surface-raised)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    padding: "14px 16px",
    color: "var(--text)",
    cursor: "pointer",
    fontSize: "15px"
  },
  alternativaSelecionada: {
    borderColor: "var(--gold)",
    background: "rgba(240, 180, 41, 0.08)"
  },
  letra: {
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
    width: "26px",
    height: "26px",
    minWidth: "26px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    border: "1px solid var(--border)",
    color: "var(--text-muted)"
  },
  letraSelecionada: {
    borderColor: "var(--gold)",
    color: "var(--gold)"
  }
};
