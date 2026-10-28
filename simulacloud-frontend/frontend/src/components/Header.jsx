import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Header() {
  const navigate = useNavigate();
  const { user, loading, signOut, cognitoConfigured } = useAuth();

  async function handleSignOut() {
    try {
      await signOut();
      navigate("/", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-brand" aria-label="SimulaCloud — página inicial">
          <span className="site-brand-mark" aria-hidden="true">△</span>
          <span>Simula<span className="site-brand-accent">Cloud</span></span>
        </Link>
        <div className="site-header-actions">
          <span className="site-header-badge">CLF-C02 <span>·</span> beta</span>
          {!loading && user ? (
            <>
              <Link className="site-account-link" to="/perfil" title={user.email || user.username}>
                <span className="site-account-dot" aria-hidden="true" />
                <span>Minha conta</span>
              </Link>
              <button className="site-auth-button site-auth-button-quiet" type="button" onClick={handleSignOut}>
                Sair
              </button>
            </>
          ) : cognitoConfigured ? (
            <Link className="site-auth-button" to="/login">Entrar</Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
