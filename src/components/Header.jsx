import styles from "./Header.module.css";

function Header({
  tarefas = [],
  filtroAtual = "todas",
  onMudarFiltro,
  titulo = "TaskFlow",
  subtitulo = "Gerencie suas tarefas",
}) {
  const total = tarefas.length;
  const concluidas = tarefas.filter((t) => t.concluida).length;
  const pendentes = total - concluidas;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>{titulo}</h1>
          <p>{subtitulo}</p>
        </div>

        <div className={styles.contadores}>
          <button
            className={`${styles.btnContador} ${styles.total} ${
              filtroAtual === "todas" ? styles.ativoTodas : ""
            }`}
            onClick={() => onMudarFiltro && onMudarFiltro("todas")}
          >
            {total} tarefas
          </button>

          <span className={styles.separador}>·</span>

          <button
            className={`${styles.btnContador} ${styles.pendentes} ${
              filtroAtual === "pendentes" ? styles.ativoPendentes : ""
            }`}
            onClick={() => onMudarFiltro && onMudarFiltro("pendentes")}
          >
            {pendentes} pendentes
          </button>

          <span className={styles.separador}>·</span>

          <button
            className={`${styles.btnContador} ${styles.concluidas} ${
              filtroAtual === "concluidas" ? styles.ativoConcluidas : ""
            }`}
            onClick={() => onMudarFiltro && onMudarFiltro("concluidas")}
          >
            {concluidas} concluídas
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;     