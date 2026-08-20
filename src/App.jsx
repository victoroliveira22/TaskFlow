import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import RotaPrivada from "./components/RotaPrivada";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Sobre from "./pages/sobre";

function App() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="app-conteudo">
        <Routes>
          <Route
            path="/"
            element={
              <RotaPrivada>
                <Dashboard />
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