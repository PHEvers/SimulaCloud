// Banco de questões mockado para o simulado AWS Certified Cloud
// Practitioner (CLF-C02). Em produção isso viria da API/backend.
// Domínios seguem a divisão oficial do exame.

export const DOMINIOS = {
  conceitos: "Conceitos de Nuvem",
  seguranca: "Segurança e Conformidade",
  tecnologia: "Tecnologia e Serviços",
  financeiro: "Faturamento e Precificação"
};

export const questoes = [
  {
    id: "q1",
    dominio: "conceitos",
    enunciado:
      "Uma empresa deseja parar de investir em servidores físicos e pagar apenas pelos recursos de computação que realmente utiliza, ajustando a capacidade conforme a demanda. Qual princípio da computação em nuvem descreve melhor esse benefício?",
    alternativas: [
      { id: "a", texto: "Elasticidade e modelo de pagamento sob demanda" },
      { id: "b", texto: "Redundância geográfica obrigatória" },
      { id: "c", texto: "Virtualização de rede privada" },
      { id: "d", texto: "Replicação síncrona multi-região" }
    ],
    correta: "a",
    explicacao:
      "A elasticidade permite escalar recursos para cima ou para baixo conforme a demanda, e o modelo de pagamento sob demanda elimina a necessidade de investimento antecipado em hardware (CAPEX vira OPEX)."
  },
  {
    id: "q2",
    dominio: "conceitos",
    enunciado:
      "Qual das opções a seguir é um exemplo de benefício econômico de migrar para a nuvem, segundo o modelo de responsabilidade de custos da AWS?",
    alternativas: [
      { id: "a", texto: "Eliminação total de custos operacionais" },
      { id: "b", texto: "Troca de despesas de capital (CAPEX) por despesas variáveis (OPEX)" },
      { id: "c", texto: "Garantia de preços fixos por contrato de 10 anos" },
      { id: "d", texto: "Isenção de custos de rede" }
    ],
    correta: "b",
    explicacao:
      "Um dos seis benefícios de nuvem da AWS é trocar despesa de capital por despesa variável, pagando apenas pelo que consome, sem grandes investimentos iniciais em infraestrutura."
  },
  {
    id: "q3",
    dominio: "seguranca",
    enunciado:
      "De acordo com o Modelo de Responsabilidade Compartilhada da AWS, quem é responsável pela segurança 'DA nuvem' (ex: infraestrutura física dos data centers)?",
    alternativas: [
      { id: "a", texto: "O cliente" },
      { id: "b", texto: "A AWS" },
      { id: "c", texto: "Ambos, em partes iguais sempre" },
      { id: "d", texto: "Um auditor terceirizado" }
    ],
    correta: "b",
    explicacao:
      "A AWS é responsável pela segurança 'da' nuvem — hardware, software, rede e instalações que executam os serviços AWS. O cliente é responsável pela segurança 'na' nuvem, como configuração de dados e acesso."
  },
  {
    id: "q4",
    dominio: "seguranca",
    enunciado:
      "Qual serviço da AWS deve ser usado para gerenciar usuários, grupos, funções (roles) e permissões de acesso aos recursos da conta?",
    alternativas: [
      { id: "a", texto: "Amazon GuardDuty" },
      { id: "b", texto: "AWS IAM" },
      { id: "c", texto: "Amazon Inspector" },
      { id: "d", texto: "AWS Shield" }
    ],
    correta: "b",
    explicacao:
      "O AWS Identity and Access Management (IAM) permite criar e controlar usuários, grupos, papéis (roles) e políticas de permissão para acesso a recursos da AWS."
  },
  {
    id: "q5",
    dominio: "seguranca",
    enunciado:
      "Qual prática é recomendada pela AWS para proteger a conta root de um ambiente AWS?",
    alternativas: [
      { id: "a", texto: "Usar a conta root no dia a dia para todas as tarefas" },
      { id: "b", texto: "Compartilhar as credenciais root com toda a equipe" },
      { id: "c", texto: "Ativar MFA e usar a conta root apenas para tarefas essenciais" },
      { id: "d", texto: "Desativar o MFA para agilizar o acesso" }
    ],
    correta: "c",
    explicacao:
      "A AWS recomenda ativar autenticação multifator (MFA) na conta root e reservá-la apenas para tarefas que exigem privilégios de root, usando usuários IAM para operações do dia a dia."
  },
  {
    id: "q6",
    dominio: "tecnologia",
    enunciado:
      "Qual serviço da AWS fornece capacidade de computação redimensionável na nuvem, permitindo executar servidores virtuais (instâncias)?",
    alternativas: [
      { id: "a", texto: "Amazon S3" },
      { id: "b", texto: "Amazon EC2" },
      { id: "c", texto: "Amazon RDS" },
      { id: "d", texto: "AWS Lambda" }
    ],
    correta: "b",
    explicacao:
      "O Amazon Elastic Compute Cloud (EC2) fornece capacidade de computação redimensionável na forma de instâncias (servidores virtuais)."
  },
  {
    id: "q7",
    dominio: "tecnologia",
    enunciado:
      "Uma aplicação precisa executar código sem que a empresa precise provisionar ou gerenciar servidores. Qual serviço é mais adequado?",
    alternativas: [
      { id: "a", texto: "Amazon EC2" },
      { id: "b", texto: "AWS Lambda" },
      { id: "c", texto: "Amazon EBS" },
      { id: "d", texto: "AWS Direct Connect" }
    ],
    correta: "b",
    explicacao:
      "O AWS Lambda é um serviço de computação serverless que executa código em resposta a eventos, sem necessidade de provisionar ou gerenciar servidores."
  },
  {
    id: "q8",
    dominio: "tecnologia",
    enunciado:
      "Qual serviço da AWS é um armazenamento de objetos altamente durável, usado para backups, sites estáticos e data lakes?",
    alternativas: [
      { id: "a", texto: "Amazon S3" },
      { id: "b", texto: "Amazon EFS" },
      { id: "c", texto: "Amazon EBS" },
      { id: "d", texto: "AWS Storage Gateway" }
    ],
    correta: "a",
    explicacao:
      "O Amazon Simple Storage Service (S3) é um serviço de armazenamento de objetos com alta durabilidade, usado para backups, hospedagem de sites estáticos, data lakes e muito mais."
  },
  {
    id: "q9",
    dominio: "tecnologia",
    enunciado:
      "Qual componente da rede AWS permite isolar logicamente os recursos em uma seção definida pelo cliente, semelhante a uma rede tradicional?",
    alternativas: [
      { id: "a", texto: "Amazon VPC" },
      { id: "b", texto: "AWS Direct Connect" },
      { id: "c", texto: "Amazon Route 53" },
      { id: "d", texto: "AWS Transit Gateway" }
    ],
    correta: "a",
    explicacao:
      "A Amazon Virtual Private Cloud (VPC) permite provisionar uma seção logicamente isolada da nuvem AWS, com controle total sobre sub-redes, roteamento e gateways."
  },
  {
    id: "q10",
    dominio: "financeiro",
    enunciado:
      "Qual ferramenta da AWS permite estimar o custo mensal de uma arquitetura antes de implantá-la?",
    alternativas: [
      { id: "a", texto: "AWS Cost Explorer" },
      { id: "b", texto: "AWS Pricing Calculator" },
      { id: "c", texto: "AWS Budgets" },
      { id: "d", texto: "AWS Trusted Advisor" }
    ],
    correta: "b",
    explicacao:
      "A AWS Pricing Calculator permite estimar o custo de serviços AWS antes de utilizá-los, montando uma arquitetura hipotética e vendo o custo mensal estimado."
  },
  {
    id: "q11",
    dominio: "financeiro",
    enunciado:
      "Qual ferramenta permite configurar alertas para ser notificado quando os custos ultrapassarem um limite definido?",
    alternativas: [
      { id: "a", texto: "AWS Budgets" },
      { id: "b", texto: "Amazon CloudWatch Logs" },
      { id: "c", texto: "AWS Config" },
      { id: "d", texto: "AWS Organizations" }
    ],
    correta: "a",
    explicacao:
      "O AWS Budgets permite definir orçamentos customizados e receber alertas quando o custo real ou previsto ultrapassa o limite configurado."
  },
  {
    id: "q12",
    dominio: "financeiro",
    enunciado:
      "Qual plano de suporte da AWS é o único que inclui um Gerente de Conta Técnico (TAM) dedicado?",
    alternativas: [
      { id: "a", texto: "Basic" },
      { id: "b", texto: "Developer" },
      { id: "c", texto: "Business" },
      { id: "d", texto: "Enterprise" }
    ],
    correta: "d",
    explicacao:
      "O plano Enterprise Support é o único que inclui um Technical Account Manager (TAM) dedicado, além de suporte 24/7 com tempo de resposta mais rápido para casos críticos."
  }
];

export function questoesPorDominio() {
  const grupos = {};
  for (const q of questoes) {
    grupos[q.dominio] = (grupos[q.dominio] || 0) + 1;
  }
  return grupos;
}
