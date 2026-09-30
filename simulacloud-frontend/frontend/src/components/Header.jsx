import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={styles.header}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.brand}>
          <span style={styles.brandMark}>△</span>
          <span>
            Simula<span style={{ color: "var(--gold)" }}>Cloud</span>
          </span>
        </Link>
        <span style={styles.badge}>CLF-C02 · beta</span>
      </div>
    </header>
  );
}

const styles = {
  header: {
    borderBottom: "1px solid var(--border)",
    padding: "20px 0"
  },
  inner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    color: "var(--text)",
    fontFamily: "var(--font-display)",
    fontSize: "20px",
    fontWeight: 600
  },
  brandMark: {
    color: "var(--teal)",
    fontSize: "16px"
  },
  badge: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    color: "var(--text-muted)",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    padding: "4px 8px"
  }
};
