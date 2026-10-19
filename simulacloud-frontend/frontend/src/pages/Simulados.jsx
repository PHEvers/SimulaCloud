import { Link } from "react-router-dom";

const simulados = [
  {
    id: "A",
    titulo: "Simulado A — AWS Cloud Practitioner",
    descricao: "Pratique com questões aleatórias em português e escolha se quer continuar após cada bloco.",
    quantidade: "5 questões por etapa",
    status: "Disponível",
    disponivel: true,
  },
  {
    id: "B",
    titulo: "Simulado B — Serviços AWS",
    descricao: "Uma seleção temática sobre serviços de computação, armazenamento, rede e bancos de dados.",
    quantidade: "Em preparação",
    status: "Em breve",
    disponivel: false,
  },
  {
    id: "C",
    titulo: "Simulado C — Revisão completa",
    descricao: "Questões distribuídas pelos domínios da certificação CLF-C02.",
    quantidade: "Em preparação",
    status: "Em breve",
    disponivel: false,
  },
];

export default function Simulados() {
  return (
    <section className="container section-page">
      <span className="mono page-eyebrow">AWS CERTIFIED CLOUD PRACTITIONER</span>
      <h1>Simulados</h1>
      <p className="page-intro">Escolha um simulado para estudar os conceitos e serviços da AWS.</p>

      <div className="simulados-page-list">
        {simulados.map((simulado) => (
          <article className="simulado-page-card" key={simulado.id}>
            <div className="simulado-page-card-top">
              <span className="simulado-page-letter">{simulado.id}</span>
              <span className={`simulado-page-status ${simulado.disponivel ? "is-available" : ""}`}>
                {simulado.status}
              </span>
            </div>
            <h2>{simulado.titulo}</h2>
            <p>{simulado.descricao}</p>
            <div className="simulado-page-card-bottom">
              <span>{simulado.quantidade}</span>
              {simulado.disponivel ? (
                <Link className="simulado-page-action" to={`/simulado/${simulado.id}`}>Estudar <span aria-hidden="true">→</span></Link>
              ) : (
                <span className="simulado-page-disabled">Indisponível</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
