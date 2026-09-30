import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { questoes, DOMINIOS } from "../data/questions.js";

export default function Resultado() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.respostas) {
    return <Navigate to="/" replace />;
  }

  const respostas = state.respostas;
  const acertos = questoes.filter((q) => respostas[q.id] === q.correta).length;
  const percentual = Math.round((acertos / questoes.length) * 100);

  const porDominio = {};
  for (const q of questoes) {
    if (!porDominio[q.dominio]) {
      porDominio[q.dominio] = { acertos: 0, total: 0 };
    }
    porDominio[q.dominio].total += 1;
    if (respostas[q.id] === q.correta) {
      porDominio[q.dominio].acertos += 1;
    }
  }

  return (
    <div className="container">
      <section style={styles.resumo}>
        <span className="mono" style={styles.resumoLabel}>
          Resultado do simulado
        </span>
        <h1 style={styles.score}>
          {acertos}/{questoes.length}
        </h1>
        <p style={styles.percentual}>{percentual}% de acerto</p>
      </section>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Desempenho por domínio</h2>
        <div style={styles.dominioList}>
          {Object.entries(porDominio).map(([chave, dados]) => (
            <div key={chave} style={styles.dominioRow}>
              <div style={styles.dominioHeader}>
                <span>{DOMINIOS[chave]}</span>
                <span className="mono" style={styles.dominioScore}>
                  {dados.acertos}/{dados.total}
                </span>
              </div>
              <div style={styles.track}>
                <div
                  style={{
                    ...styles.fill,
                    width: `${(dados.acertos / dados.total) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "32px" }}>
        <h2 style={styles.cardTitle}>Revisão das questões</h2>
        <div style={styles.revisaoList}>
          {questoes.map((q, i) => {
            const respondida = respostas[q.id];
            const correta = respondida === q.correta;
            return (
              <div key={q.id} style={styles.revisaoItem}>
                <div style={styles.revisaoHeader}>
                  <span className="mono" style={styles.revisaoNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      ...styles.revisaoStatus,
                      color: correta ? "var(--green)" : "var(--red)"
                    }}
                  >
                    {correta ? "Correta" : "Incorreta"}
                  </span>
                </div>
                <p style={styles.revisaoEnunciado}>{q.enunciado}</p>
                <p style={styles.revisaoExplicacao}>{q.explicacao}</p>
              </div>
            );
          })}
        </div>
      </section>

      <button style={styles.cta} onClick={() => navigate("/simulado")}>
        Refazer simulado
      </button>
    </div>
  );
}

const styles = {
  resumo: {
    textAlign: "center",
    padding: "48px 0 32px"
  },
  resumoLabel: {
    fontSize: "12px",
    color: "var(--teal)"
  },
  score: {
    fontSize: "56px",
    margin: "8px 0 4px"
  },
  percentual: {
    color: "var(--text-muted)",
    margin: 0
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "28px"
  },
  cardTitle: {
    fontSize: "17px",
    marginBottom: "20px"
  },
  dominioList: {
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  },
  dominioRow: {},
  dominioHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    marginBottom: "6px"
  },
  dominioScore: {
    color: "var(--text-muted)"
  },
  track: {
    height: "4px",
    background: "var(--surface-raised)",
    borderRadius: "2px",
    overflow: "hidden"
  },
  fill: {
    height: "100%",
    background: "var(--gold)"
  },
  revisaoList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    marginTop: "16px"
  },
  revisaoItem: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "20px"
  },
  revisaoHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px"
  },
  revisaoNum: {
    color: "var(--text-muted)",
    fontSize: "13px"
  },
  revisaoStatus: {
    fontSize: "13px",
    fontWeight: 600
  },
  revisaoEnunciado: {
    fontSize: "15px",
    margin: "0 0 10px"
  },
  revisaoExplicacao: {
    fontSize: "14px",
    color: "var(--text-muted)",
    margin: 0
  },
  cta: {
    width: "100%",
    background: "var(--gold)",
    color: "#241a05",
    border: "none",
    borderRadius: "6px",
    padding: "14px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "32px"
  }
};
