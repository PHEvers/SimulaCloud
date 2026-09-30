import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  // Referência para rolar suavemente até os simulados
  const simuladosRef = useRef(null);

  // Lista de simulados para a certificação AWS CLF-C02
  const simulados = [
    {
      id: 'A',
      title: 'Simulado A — Fundamentos Cloud',
      desc: 'Conceitos gerais de computação em nuvem, economia e modelo de responsabilidade compartilhada.',
      questionsCount: 20,
      level: 'Iniciante',
      time: '25 min',
    },
    {
      id: 'B',
      title: 'Simulado B — Serviços Principais AWS',
      desc: 'Foco em EC2, S3, RDS, VPC, IAM e serviços essenciais da infraestrutura AWS.',
      questionsCount: 25,
      level: 'Intermediário',
      time: '30 min',
    },
    {
      id: 'C',
      title: 'Simulado C — Prova Completa CLF-C02',
      desc: 'Simulação real com amostragem abrangente cobrindo todos os 4 domínios da prova oficial.',
      questionsCount: 65,
      level: 'Avançado',
      time: '90 min',
    },
  ];

  // Domínios Oficiais da Certificação AWS Certified Cloud Practitioner
  const dominios = [
    {
      codigo: 'Domínio 1',
      nome: 'Conceitos de Nuvem',
      peso: '24%',
      desc: 'Definição da Nuvem AWS, economia e conceitos de arquitetura.',
      cor: '#3182ce',
    },
    {
      codigo: 'Domínio 2',
      nome: 'Segurança e Conformidade',
      peso: '30%',
      desc: 'Modelo de responsabilidade compartilhada, IAM e gestão de acessos.',
      cor: '#e53e3e',
    },
    {
      codigo: 'Domínio 3',
      nome: 'Tecnologia e Serviços',
      peso: '34%',
      desc: 'Principais serviços de computação, rede, banco de dados e armazenamento.',
      cor: '#dd6b20',
    },
    {
      codigo: 'Domínio 4',
      nome: 'Cobrança, Preços e Suporte',
      peso: '12%',
      desc: 'Modelos de preços AWS, AWS Budgets, Cost Explorer e planos de suporte.',
      cor: '#38a169',
    },
  ];

  // Handler do login visual demonstrativo
  const handleVisualLogin = (e) => {
    e.preventDefault();
    setLoginMessage('Login demonstrativo enviado! Autenticação real em breve na próxima versão.');
    setTimeout(() => {
      setLoginMessage('');
      setShowLoginModal(false);
      setEmail('');
      setPassword('');
    }, 2200);
  };

  const handleStartSimulado = (id) => {
    // Concatenação simples de URL para máxima compatibilidade no Vite
    navigate('/simulado/' + id);
  };

  const handleVisitanteClick = () => {
    if (simuladosRef.current) {
      simuladosRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={styles.container}>
      {/* 1. SEÇÃO HERO */}
      <section style={styles.hero}>
        <div style={styles.heroBadge}>☁️ Preparatório AWS Certified Cloud Practitioner (CLF-C02)</div>
        <h1 style={styles.heroTitle}>Acelere sua Aprovação na Certificação Cloud</h1>
        <p style={styles.heroSubtitle}>
          Pratique com questões simuladas, acompanhe suas explicações detalhadas e teste seus conhecimentos nos 4 domínios oficiais da prova — totalmente gratuito e sem necessidade de cadastro!
        </p>

        {/* Botões de Ação Principal */}
        <div style={styles.heroActions}>
          <button 
            style={styles.visitorBtn}
            onClick={handleVisitanteClick}
          >
            🚀 Entrar como Visitante
          </button>
          <button 
            style={styles.loginBtn}
            onClick={() => setShowLoginModal(true)}
          >
            🔑 Fazer Login (Visual)
          </button>
        </div>
      </section>

      {/* 2. DIFERENCIAIS / RECURSOS */}
      <section style={styles.featuresSection}>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>⚡</div>
          <h4 style={styles.featureTitle}>Acesso Imediato</h4>
          <p style={styles.featureDesc}>Comece a responder as questões direto como visitante, sem perder tempo com formulários.</p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>💡</div>
          <h4 style={styles.featureTitle}>Gabarito Comentado</h4>
          <p style={styles.featureDesc}>Entenda o motivo de cada resposta correta com explicações técnicas fundamentadas.</p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🎯</div>
          <h4 style={styles.featureTitle}>Alinhado ao CLF-C02</h4>
          <p style={styles.featureDesc}>Conteúdo atualizado abrangendo os principais serviços e conceitos exigidos no exame.</p>
        </div>
      </section>

      {/* 3. SELEÇÃO DE SIMULADOS (A, B e C) */}
      <section ref={simuladosRef} style={styles.simuladosSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Escolha a Prova para Iniciar</h2>
          <p style={styles.sectionSubtitle}>
            Selecione o simulado ideal para o seu nível atual de preparação:
          </p>
        </div>

        <div style={styles.grid}>
          {simulados.map((item) => (
            <div key={item.id} style={styles.card}>
              <div>
                <div style={styles.cardHeader}>
                  <span style={styles.badge}>{item.level}</span>
                  <div style={styles.timeBadge}>⏱️ {item.time}</div>
                </div>
                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.cardDesc}>{item.desc}</p>
              </div>

              <div>
                <div style={styles.cardFooterInfo}>
                  <span><strong>{item.questionsCount}</strong> Questões</span>
                  <span>Opções A-D</span>
                </div>
                <button 
                  style={styles.startBtn} 
                  onClick={() => handleStartSimulado(item.id)}
                >
                  Iniciar Simulado {item.id} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DOMÍNIOS DO EXAME AWS CLF-C02 */}
      <section style={styles.domainsSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Domínios Cobertos no Exame AWS</h2>
          <p style={styles.sectionSubtitle}>
            Nossos simulados cobrem a proporção exata exigida pelo guia oficial da AWS:
          </p>
        </div>

        <div style={styles.domainsGrid}>
          {dominios.map((dom, index) => (
            <div key={index} style={{ ...styles.domainCard, borderLeft: '4px solid ' + dom.cor }}>
              <div style={styles.domainHeader}>
                <span style={{ ...styles.domainCode, backgroundColor: dom.cor + '15', color: dom.cor }}>
                  {dom.codigo}
                </span>
                <span style={styles.domainPeso}>Peso na Prova: <strong>{dom.peso}</strong></span>
              </div>
              <h3 style={styles.domainTitle}>{dom.nome}</h3>
              <p style={styles.domainDesc}>{dom.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MODAL DE LOGIN VISUAL */}
      {showLoginModal && (
        <div style={styles.modalOverlay} onClick={() => setShowLoginModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#2d3748' }}>
                Área do Usuário (Modo Visual)
              </h3>
              <button 
                style={styles.closeBtn} 
                onClick={() => setShowLoginModal(false)}
              >
                ✕
              </button>
            </div>

            {loginMessage ? (
              <div style={styles.alertBox}>{loginMessage}</div>
            ) : (
              <form onSubmit={handleVisualLogin} style={styles.form}>
                <p style={{ fontSize: '13px', color: '#718096', marginBottom: '8px' }}>
                  A autenticação via banco de dados será liberada na próxima fase. Teste a interface abaixo:
                </p>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>E-mail</label>
                  <input 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Senha</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>
                <button type="submit" style={styles.submitBtn}>
                  Entrar (Simulação)
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 6. RODAPÉ (FOOTER) */}
      <footer style={styles.footer}>
        <div style={styles.footerBrand}>☁️ SimulaCloud</div>
        <p style={styles.footerDisclaimer}>
          O SimulaCloud é um projeto educacional independente voltado para a preparação de exames de tecnologia. 
          Não possui vínculo, patrocínio ou endosso da Amazon Web Services (AWS).
        </p>
        <div style={styles.footerCopy}>
          © {new Date().getFullYear()} SimulaCloud — Desenvolvido com React + Vite.
        </div>
      </footer>
    </div>
  );
}

// ESTILOS INLINE PADRONIZADOS
const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#1a202c',
  },
  hero: {
    textAlign: 'center',
    padding: '48px 24px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
    marginBottom: '32px',
  },
  heroBadge: {
    display: 'inline-block',
    backgroundColor: '#ebf8ff',
    color: '#2b6cb0',
    fontSize: '13px',
    fontWeight: '700',
    padding: '6px 14px',
    borderRadius: '20px',
    marginBottom: '16px',
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: '800',
    marginBottom: '16px',
    color: '#2d3748',
    letterSpacing: '-0.5px',
  },
  heroSubtitle: {
    fontSize: '17px',
    color: '#4a5568',
    maxWidth: '720px',
    margin: '0 auto 32px',
    lineHeight: '1.6',
  },
  heroActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  visitorBtn: {
    padding: '14px 28px',
    backgroundColor: '#2b6cb0',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(43, 108, 176, 0.25)',
  },
  loginBtn: {
    padding: '14px 28px',
    backgroundColor: '#ffffff',
    color: '#2b6cb0',
    border: '2px solid #2b6cb0',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
  },
  featuresSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '48px',
  },
  featureCard: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #edf2f7',
    textAlign: 'center',
  },
  featureIcon: {
    fontSize: '28px',
    marginBottom: '10px',
  },
  featureTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '6px',
  },
  featureDesc: {
    fontSize: '14px',
    color: '#718096',
    lineHeight: '1.4',
  },
  simuladosSection: {
    marginBottom: '56px',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#2d3748',
    marginBottom: '8px',
  },
  sectionSubtitle: {
    fontSize: '16px',
    color: '#718096',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  badge: {
    backgroundColor: '#ebf8ff',
    color: '#2b6cb0',
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  timeBadge: {
    fontSize: '12px',
    color: '#718096',
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: '19px',
    fontWeight: '700',
    marginBottom: '10px',
    color: '#1a202c',
  },
  cardDesc: {
    fontSize: '14px',
    color: '#718096',
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  cardFooterInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#4a5568',
    marginBottom: '12px',
  },
  startBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2b6cb0',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
  },
  domainsSection: {
    marginBottom: '56px',
    backgroundColor: '#f7fafc',
    padding: '36px 24px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
  },
  domainsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
  },
  domainCard: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
  },
  domainHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  domainCode: {
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  domainPeso: {
    fontSize: '12px',
    color: '#718096',
  },
  domainTitle: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '6px',
    color: '#2d3748',
  },
  domainDesc: {
    fontSize: '13px',
    color: '#718096',
    lineHeight: '1.4',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: '28px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#a0aec0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#4a5568',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e0',
    fontSize: '14px',
  },
  submitBtn: {
    padding: '12px',
    backgroundColor: '#319795',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  alertBox: {
    backgroundColor: '#e6fffa',
    color: '#234e52',
    padding: '16px',
    borderRadius: '6px',
    fontSize: '14px',
    textAlign: 'center',
  },
  footer: {
    borderTop: '1px solid #e2e8f0',
    paddingTop: '32px',
    paddingBottom: '24px',
    textAlign: 'center',
  },
  footerBrand: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2b6cb0',
    marginBottom: '12px',
  },
  footerDisclaimer: {
    fontSize: '12px',
    color: '#a0aec0',
    maxWidth: '650px',
    margin: '0 auto 16px',
    lineHeight: '1.5',
  },
  footerCopy: {
    fontSize: '13px',
    color: '#718096',
  },
};
