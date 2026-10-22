import styles from "./TarefaItem.module.css";

function TarefaItem({
  texto,
  concluida,
  idprioridade,
  prioridade,
  prioridades = [],
  usuarioId,
  usuarios = [],
  projetoId,
  projetos = [],
  onDeletar,
  onEditar,
}) {
  const valorPrio = idprioridade ?? prioridade;

  const prioEncontrada = prioridades.find((p) => {
    if (typeof p === "object" && p !== null) {
      const pId = p.id ?? p.idprioridade ?? p.id_prioridade;
      return Number(pId) === Number(valorPrio);
    }
    return String(p).toLowerCase() === String(valorPrio).toLowerCase();
  });

  const rotuloPrioridade = prioEncontrada
    ? (typeof prioEncontrada === "object" ? prioEncontrada.nome : prioEncontrada)
    : (typeof valorPrio === "string" && valorPrio.trim() !== "" ? valorPrio : "media");

  const prioridadeNome = String(rotuloPrioridade)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const usuarioObj = usuarios.find((u) => u.id === Number(usuarioId));
  const projetoObj = projetos.find((p) => p.id === Number(projetoId));

  return (
    <div className={`${styles.tarefa} ${concluida ? styles.concluida : ""} ${styles[prioridadeNome] || ""}`}>
      <div className={styles.conteudoTopo}>
        <span
          className={styles.textoTarefa}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onEditar && onEditar();
          }}
        >
          {texto}
        </span>

        <span className={`${styles["badge-prioridade"]} ${styles["badge-" + prioridadeNome] || ""}`}>
          {rotuloPrioridade}
        </span>

        <button
          className={styles.btnDeletar}
          onClick={(e) => {
            e.stopPropagation();
            onDeletar && onDeletar();
          }}
        >
          ✕
        </button>
      </div>

      {(usuarioObj || projetoObj) && (
        <div className={styles.enderecoContainer}>
          {usuarioObj && <div><strong>Resp:</strong> {usuarioObj.nome}</div>}
          {projetoObj && <div><strong>Projeto:</strong> {projetoObj.nome}</div>}
        </div>
      )}
    </div>
  );
}

export default TarefaItem;