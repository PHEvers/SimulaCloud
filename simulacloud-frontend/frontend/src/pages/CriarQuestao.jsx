import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { api } from "../services/questions.js";
export default function CriarQuestao() {
  const { user, loading } = useAuth();
  const [items,setItems] = useState([]), [message,setMessage] = useState(""), [busy,setBusy] = useState(false);
  const permitted = ["admin", "colaborador"].includes(user?.role);
  useEffect(() => { if (!permitted) return; const controller = new AbortController(); api("/simulados", {signal: controller.signal}).then(setItems).catch(e => { if (!controller.signal.aborted) setMessage(e.message); }); return () => controller.abort(); }, [permitted]);
  async function submit(event) {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
    setBusy(true); setMessage("");
    try { await api("/questions", { method: "POST", body: JSON.stringify({ simuladoId: data.get("simuladoId"), question: data.get("question"), options: [0,1,2,3].map(i => data.get("option" + i)), correctIndex: Number(data.get("correctIndex")), domain: data.get("domain"), explanation: data.get("explanation") }) }); form.reset(); setMessage("Questão criada com sucesso."); }
    catch(e) { setMessage(e.message); } finally { setBusy(false); }
  }
  if (loading) return <p>Carregando...</p>;
  if (!permitted) return <section className="container section-page"><h1>Acesso restrito</h1><p>Somente Admin e Colaborador podem criar questões.</p><Link to="/login">Entrar</Link></section>;
  return <section className="container section-page"><h1>Criar questão</h1><form className="question-form" onSubmit={submit}>
    <label>Simulado<select name="simuladoId" required>{items.map(i => <option key={i.id} value={i.id}>{i.id} — {i.titulo}</option>)}</select></label>
    <label>Domínio<select name="domain">{["Conceitos de Nuvem","Segurança e Conformidade","Tecnologia e Serviços","Faturamento e Precificação"].map(d => <option key={d}>{d}</option>)}</select></label>
    <label>Enunciado<textarea name="question" required /></label>
    {[0,1,2,3].map(i => <label key={i}>Alternativa {i+1}<input name={"option"+i} required /></label>)}
    <label>Resposta correta<select name="correctIndex">{[0,1,2,3].map(i => <option key={i} value={i}>Alternativa {i+1}</option>)}</select></label>
    <label>Explicação<textarea name="explanation" required /></label>
    <button className="home-primary-action" disabled={busy || !items.length}>{busy ? "Salvando..." : "Salvar questão"}</button>
    {message && <p role="status">{message}</p>}
  </form></section>;
}
