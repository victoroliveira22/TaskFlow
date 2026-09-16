import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function RotaPrivada({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RotaPrivada;