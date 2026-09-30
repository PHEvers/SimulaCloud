import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/simulado/:id" 
          element={<div style={{ padding: '40px', textAlign: 'center' }}>Tela do Simulado em breve</div>} 
        />
        <Route 
          path="/resultado" 
          element={<div style={{ padding: '40px', textAlign: 'center' }}>Tela de Resultado em breve</div>} 
        />
      </Routes>
    </>
  );
}