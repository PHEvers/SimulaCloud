export default function ProgressBar({ atual, total }) {
  const pct = Math.round((atual / total) * 100);
  return (
    <div>
      <div style={styles.labelRow}>
        <span className="mono" style={styles.label}>
          Questão {atual} de {total}
        </span>
        <span className="mono" style={styles.label}>
          {pct}%
        </span>
      </div>
      <div style={styles.track}>
        <div style={{ ...styles.fill, width: `${pct}%` }} />
      </div>
    </div>
  );
}

const styles = {
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px"
  },
  label: {
    fontSize: "12px",
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
    background: "var(--teal)",
    transition: "width 0.25s ease"
  }
};
