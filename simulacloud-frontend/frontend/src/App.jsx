import CriarQuestao from "./pages/CriarQuestao.jsx";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Home from "./pages/Home.jsx";
import Simulado from "./pages/Simulado.jsx";
import Resultado from "./pages/Resultado.jsx";
import Simulados from "./pages/Simulados.jsx";
import Perfil from "./pages/Perfil.jsx";
import Login from "./pages/Login.jsx";

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
            <Route path="/login" element={<Login />} />
            <Route path="/questoes/nova" element={<CriarQuestao />} />
            <Route path="/simulado/:id" element={<Simulado />} />
            <Route path="/resultado" element={<Resultado />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
}
