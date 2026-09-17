import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./sidebar.module.css";

function Sidebar() {
  const auth = useAuth();
  
  const estaAutenticado = Boolean(auth?.logado || auth?.token || auth?.usuario);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (auth?.logout) auth.logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.ativo}` : styles.link;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1>TaskFlow</h1>
      </div>

      <nav className={styles.nav}>
        {!estaAutenticado && (
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
        )}

        {estaAutenticado && (
          <NavLink to="/" className={linkClass}>
            Dashboard
          </NavLink>
        )}

        <NavLink to="/sobre" className={linkClass}>
          Sobre
        </NavLink>
      </nav>

      {estaAutenticado && (
        <button className={styles.btnLogout} onClick={handleLogout}>
          Sair
        </button>
      )}
    </aside>
  );
}

export default Sidebar;