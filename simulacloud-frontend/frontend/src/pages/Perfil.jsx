import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Perfil() {
  const { user, loading, cognitoConfigured } = useAuth();

  if (loading) {
    return <section className="container section-page"><p className="auth-loading">Carregando seu perfil…</p></section>;
  }

  if (!user) {
    return (
      <section className="container section-page">
        <span className="mono page-eyebrow">SUA ÁREA</span>
        <h1>Perfil</h1>
        <p className="page-intro">Entre ou crie uma conta para acessar sua área pessoal. Você pode continuar estudando sem login.</p>
        <article className="profile-placeholder-card profile-auth-card">
          <div className="profile-avatar" aria-hidden="true">◉</div>
          <div>
            <h2>{cognitoConfigured ? "Seu perfil começa aqui" : "Login em configuração"}</h2>
            <p>
              {cognitoConfigured
                ? "A conta será usada para identificar seu perfil. O salvamento do histórico de simulados será uma próxima etapa, com uma API protegida."
                : "A conexão com o Cognito ainda não está configurada neste ambiente. As questões públicas seguem disponíveis."}
            </p>
            {cognitoConfigured && <Link className="auth-inline-link" to="/login">Entrar ou criar conta <span aria-hidden="true">→</span></Link>}
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="container section-page">
      <span className="mono page-eyebrow">SUA ÁREA</span>
      <h1>Perfil</h1>
      <p className="page-intro">Esta área vai reunir suas informações e seu progresso de estudos.</p>

      <article className="profile-placeholder-card">
          <div className="profile-avatar" aria-hidden="true">{(user.email || user.username).charAt(0).toUpperCase()}</div>
        <div>
          <h2>Seu perfil</h2>
            <p>Sua conta está autenticada pelo Amazon Cognito. O histórico de simulados ainda não é salvo; essa será uma próxima etapa da API.</p>
            <span className="profile-status">{user.email || user.username}</span>
        </div>
      </article>
    </section>
  );
}
