import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Home from "./pages/Home.jsx";
import Simulado from "./pages/Simulado.jsx";
import Resultado from "./pages/Resultado.jsx";
import Simulados from "./pages/Simulados.jsx";
import Perfil from "./pages/Perfil.jsx";

export default function App() {
  return (
    <>
      <Header />
      <div className="app-shell">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulados" element={<Simulados />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/simulado/A" element={<Simulado />} />
            <Route
              path="/simulado/:id"
              element={
                <div className="container unavailable-page">
                  <span className="mono unavailable-eyebrow">EM PREPARAÇÃO</span>
                  <h1>Este simulado ainda está sendo preparado</h1>
                  <p>Por enquanto, o Simulado A está disponível com questões de prática.</p>
                  <a href="/">Voltar para a página inicial</a>
                </div>
              }
            />
            <Route path="/resultado" element={<Resultado />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
}
