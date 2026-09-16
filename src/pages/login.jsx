import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [shake, setShake] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin() {
    setErro("");
    try {
      const resposta = await api.post("/auth/login", {
        email,
        senha,
      });
      const { token, usuario } = resposta.data;
      login(usuario, token);
      navigate("/");
    } catch (err) {
      setErro(err.response?.data?.erro || "Erro ao fazer login");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div className="login-container">
      <div className={`login-card ${shake ? "shake" : ""}`}>
        <h1 className="login-logo">TaskFlow</h1>
        <p className="login-subtitulo">Faça login para continuar</p>

        <input
          className="login-input"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        {erro && <p className="login-erro">{erro}</p>}

        <button className="login-btn" onClick={handleLogin}>
          Entrar
        </button>
      </div>
    </div>
  );
}

export default Login;