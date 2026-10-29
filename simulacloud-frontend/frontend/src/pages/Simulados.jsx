import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { api } from "../services/questions.js";
const labels = { public: "Público — inclusive visitantes", members: "Colaborador e Básico", admin: "Somente Admin" };
export default function Simulados() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState([]), [error, setError] = useState(""), [busy, setBusy] = useState(true), [saving, setSaving] = useState(false);
  useEffect(() => {
    if (loading) return;
    const controller = new AbortController();
    setBusy(true); setError(""); setItems([]);
    api("/simulados", { signal: controller.signal }).then(setItems).catch(e => { if (!controller.signal.aborted) setError(e.message); }).finally(() => { if (!controller.signal.aborted) setBusy(false); });
    return () => controller.abort();
  }, [user, loading]);
  async function change(item, access) {
    setSaving(true); setError("");
    try { await api("/simulados", { method: "POST", body: JSON.stringify({ id: item.id, access }) }); setItems(items.map(i => i.id === item.id ? { ...i, access } : i)); }
    catch(e) { setError(e.message); } finally { setSaving(false); }
  }
  return <section className="container section-page"><h1>Simulados</h1><p className="page-intro">Simulados disponíveis para {user ? ({admin:"Admin", colaborador:"Colaborador", basico:"Básico"}[user.role]) : "visitantes"}.</p>
    {error && <p role="alert">{error}</p>}{(busy || loading) && <p>Carregando...</p>}
    <div className="simulados-page-list">{items.map(item => <article className="simulado-page-card" key={item.id}><h2>Simulado {item.id} — {item.titulo}</h2><p>{labels[item.access]}</p>
      {user?.role === "admin" && <label>Acesso <select disabled={saving} value={item.access} onChange={e => change(item, e.target.value)}>{Object.entries(labels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>}
      <div className="simulado-page-card-bottom"><Link className="simulado-page-action" to={"/simulado/" + item.id}>Estudar →</Link></div></article>)}</div>
    {!busy && !items.length && !error && <p>Nenhum simulado disponível.</p>}
    {!user && <Link to="/login">Entre para acessar os simulados para cadastrados.</Link>}
  </section>;
}
