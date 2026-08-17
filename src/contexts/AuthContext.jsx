import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [logado, setLogado] = useState(false);

  const login = () => setLogado(true);
  const logout = () => setLogado(false);

  return (
    <AuthContext.Provider value={{ logado, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}