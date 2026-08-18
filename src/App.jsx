import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import RotaPrivada from "./components/RotaPrivada";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login.jsx";
import Sobre from "./pages/sobre.jsx";

function App() {
  const [tarefas, setTarefas] = useState(() => {
    const salvo = localStorage.getItem("taskflow-tarefas");
    return salvo ? JSON.parse(salvo) : [];
  });

  const [filtroStatus, setFiltroStatus] = useState("todas");

  useEffect(() => {
    localStorage.setItem("taskflow-tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  function deletarTarefa(id) {
    setTarefas((prev) => prev.filter((t) => t.id !== id));
  }

  function moverTarefa(id, novaColuna) {
    setTarefas((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            coluna: novaColuna,
            concluida: novaColuna === "concluida",
          };
        }
        return t;
      })
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="app-conteudo">
        <Routes>
          <Route
            path="/"
            element={
              <RotaPrivada>
                <Dashboard
                  tarefas={tarefas}
                  setTarefas={setTarefas}
                  filtroStatus={filtroStatus}
                  setFiltroStatus={setFiltroStatus}
                  deletarTarefa={deletarTarefa}
                  moverTarefa={moverTarefa}
                />
              </RotaPrivada>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/sobre" element={<Sobre />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;