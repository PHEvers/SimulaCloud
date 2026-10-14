import { DOMINIOS } from "../data/questions.js";

export default function QuestionCard({ questao }) {
  const alternativaCorreta = questao.alternativas.find(
    (alternativa) => alternativa.id === questao.correta
  );

  return (
    <div style={styles.card}>
      <span style={styles.dominio}>{DOMINIOS[questao.dominio]}</span>
      <h2 style={styles.enunciado}>{questao.enunciado}</h2>

      <div style={styles.alternativas}>
        {questao.alternativas.map((alt) => {
          const correta = alt.id === questao.correta;
          return (
            <div
              key={alt.id}
              style={{
                ...styles.alternativa,
                ...(correta ? styles.alternativaCorreta : {})
              }}
            >
              <span style={{ ...styles.letra, ...(correta ? styles.letraCorreta : {}) }}>
                {alt.id.toUpperCase()}
              </span>
              <span style={styles.textoAlternativa}>{alt.texto}</span>
              {correta && <span style={styles.seloCorreta}>Resposta correta</span>}
            </div>
          );
        })}
      </div>

      <section style={styles.resposta} aria-label="Resposta e explicação">
        <p style={styles.tituloResposta}>Resposta</p>
        <p style={styles.textoResposta}>
          <strong>{alternativaCorreta?.id.toUpperCase()}.</strong> {alternativaCorreta?.texto}
        </p>
        <p style={styles.tituloExplicacao}>Por que essa é a resposta?</p>
        <p style={styles.explicacao}>{questao.explicacao}</p>
      </section>
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
    fontSize: "15px"
  },
  alternativaCorreta: {
    borderColor: "var(--green, #22c55e)",
    background: "rgba(34, 197, 94, 0.09)"
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
  letraCorreta: {
    borderColor: "var(--green, #22c55e)",
    color: "var(--green, #22c55e)"
  },
  textoAlternativa: {
    flex: 1
  },
  seloCorreta: {
    color: "var(--green, #22c55e)",
    fontSize: "12px",
    fontWeight: 600,
    whiteSpace: "nowrap"
  },
  resposta: {
    marginTop: "24px",
    padding: "20px",
    borderRadius: "6px",
    background: "var(--surface-raised)",
    border: "1px solid var(--border)"
  },
  tituloResposta: {
    margin: "0 0 8px",
    color: "var(--green, #22c55e)",
    fontWeight: 700,
    fontSize: "14px"
  },
  textoResposta: {
    margin: "0 0 18px",
    color: "var(--text)",
    lineHeight: 1.6
  },
  tituloExplicacao: {
    margin: "0 0 8px",
    color: "var(--text)",
    fontWeight: 600,
    fontSize: "14px"
  },
  explicacao: {
    margin: 0,
    color: "var(--text-muted)",
    lineHeight: 1.7,
    fontSize: "14px"
  }
};
