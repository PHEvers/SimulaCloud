import { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
import { useAuth } from "../contexts/AuthContext.jsx";

function LoginRedirect() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    let ativo = true;
    refreshUser().finally(() => {
      if (ativo) navigate("/perfil", { replace: true });
    });
    return () => {
      ativo = false;
    };
  }, [navigate, refreshUser]);

  return <p className="auth-loading">Login concluído. Abrindo seu perfil…</p>;
}

export default function Login() {
  const { user, loading, cognitoConfigured } = useAuth();

  if (!cognitoConfigured) {
    return (
      <section className="container auth-page">
        <div className="auth-card">
          <span className="mono page-eyebrow">CONTA SIMULACLOUD</span>
          <h1>Configure a conexão com o Cognito</h1>
          <p>
            O frontend ainda não recebeu os IDs do User Pool e do app client. Configure as
            variáveis Vite no arquivo local e no ambiente de publicação para ativar cadastro e login.
          </p>
          <Link className="auth-back-link" to="/">Voltar para as questões públicas</Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return <section className="container auth-page"><p className="auth-loading">Verificando sua sessão…</p></section>;
  }

  if (user) return <Navigate to="/perfil" replace />;

  return (
    <section className="container auth-page">
      <div className="auth-heading">
        <span className="mono page-eyebrow">CONTA SIMULACLOUD</span>
        <h1>Entre ou crie sua conta</h1>
        <p>As questões continuam abertas. A conta prepara seu perfil para o progresso de estudos.</p>
      </div>
      <div className="auth-card auth-form-card">
        <Authenticator
          loginMechanisms={["email"]}
          signUpAttributes={["email"]}
          components={{
            Header() {
              return <h2 className="auth-form-title">Acesse sua conta</h2>;
            },
          }}
        >
          {() => <LoginRedirect />}
        </Authenticator>
      </div>
      <Link className="auth-back-link" to="/">Continuar sem entrar</Link>
    </section>
  );
}
