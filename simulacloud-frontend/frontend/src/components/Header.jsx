import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-brand" aria-label="SimulaCloud — página inicial">
          <span className="site-brand-mark" aria-hidden="true">△</span>
          <span>Simula<span className="site-brand-accent">Cloud</span></span>
        </Link>
        <span className="site-header-badge">CLF-C02 <span>·</span> beta</span>
      </div>
    </header>
  );
}
