import { Link, useNavigate } from "react-router-dom";

const dominios = [
  {
    numero: "01",
    nome: "Conceitos de Nuvem",
    descricao: "Fundamentos da computação em nuvem, elasticidade e modelos de implantação."
  },
  {
    numero: "02",
    nome: "Segurança e Conformidade",
    descricao: "Responsabilidade compartilhada, IAM, proteção de dados e conformidade."
  },
  {
    numero: "03",
    nome: "Tecnologia e Serviços",
    descricao: "Serviços AWS de computação, armazenamento, rede e bancos de dados."
  },
  {
    numero: "04",
    nome: "Cobrança, Preços e Suporte",
    descricao: "Custos, ferramentas de orçamento e planos de suporte da AWS."
  }
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="container home-page">
      <section className="home-hero">
        <span className="mono home-eyebrow">AWS CERTIFIED CLOUD PRACTITIONER · CLF-C02</span>
        <h1>Prepare-se para a certificação, uma questão de cada vez.</h1>
        <p className="home-lead">
          Pratique com questões em português, confira a explicação depois de responder
          e acompanhe seu resultado por domínio.
        </p>
        <div className="home-actions">
          <button className="home-primary-action" type="button" onClick={() => navigate("/simulado/A")}>
            Começar simulado <span aria-hidden="true">→</span>
          </button>
          <Link className="home-secondary-action" to="/simulados">Ver simulados</Link>
        </div>
        <div className="home-facts" aria-label="Como funciona">
          <span><strong>10</strong> questões por tentativa</span>
          <span><strong>25</strong> questões no banco</span>
          <span>Sem cadastro</span>
        </div>
      </section>

      <section className="home-how" aria-labelledby="home-how-title">
        <div className="home-section-heading">
          <span className="mono home-eyebrow">ESTUDO PRÁTICO</span>
          <h2 id="home-how-title">Responda, confirme e aprenda</h2>
          <p>O gabarito só aparece depois que você confirma sua escolha.</p>
        </div>
        <div className="home-feature-grid">
          <article className="home-feature-card">
            <span className="home-feature-number">01</span>
            <h3>Escolha uma alternativa</h3>
            <p>Receba uma seleção aleatória de dez questões do banco de prática.</p>
          </article>
          <article className="home-feature-card">
            <span className="home-feature-number">02</span>
            <h3>Veja o resultado</h3>
            <p>Após confirmar, saiba se acertou e leia a explicação da resposta correta.</p>
          </article>
          <article className="home-feature-card">
            <span className="home-feature-number">03</span>
            <h3>Revise seu desempenho</h3>
            <p>No final, consulte sua pontuação e o resultado por domínio.</p>
          </article>
        </div>
      </section>

      <section className="home-domains" aria-labelledby="home-domains-title">
        <div className="home-section-heading">
          <span className="mono home-eyebrow">CONTEÚDO DO BANCO</span>
          <h2 id="home-domains-title">Quatro domínios para revisar</h2>
          <p>As questões de prática cobrem conceitos e serviços da certificação CLF-C02.</p>
        </div>
        <div className="home-domain-grid">
          {dominios.map((dominio) => (
            <article className="home-domain-card" key={dominio.numero}>
              <span className="mono home-domain-number">{dominio.numero}</span>
              <div>
                <h3>{dominio.nome}</h3>
                <p>{dominio.descricao}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-final-cta">
        <div>
          <span className="mono home-eyebrow">PRONTO PARA COMEÇAR?</span>
          <h2>Faça uma tentativa de 10 questões.</h2>
          <p>Você pode praticar sem criar uma conta. O progresso não é salvo entre sessões.</p>
        </div>
        <button className="home-primary-action" type="button" onClick={() => navigate("/simulado/A")}>
          Iniciar agora <span aria-hidden="true">→</span>
        </button>
      </section>

      <footer className="home-footer">
        <strong>SimulaCloud</strong>
        <p>
          Projeto educacional independente. Não possui vínculo, patrocínio ou endosso da Amazon Web Services (AWS).
        </p>
      </footer>
    </div>
  );
}
