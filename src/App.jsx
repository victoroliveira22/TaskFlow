import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { RotaPrivada } from './components/RotaPrivada';
import Sidebar from './components/sidebar';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Sobre from './pages/sobre';

function App() {
  const { token } = useAuth();

  return (
    <div style={{ display: 'flex' }}>
      {token && <Sidebar />}
      <div style={{ marginLeft: token ? '220px' : '0', width: '100%' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <RotaPrivada>
                <Dashboard />
              </RotaPrivada>
            }
          />

          {/* Rota da página Sobre */}
          <Route path="/sobre" element={<Sobre />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;