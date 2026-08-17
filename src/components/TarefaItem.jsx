import styles from "./TarefaItem.module.css";

function TarefaItem({
  texto,
  concluida,
  prioridade = "media",
  onDeletar,
  onEditar,
  salvei0cep,
}) {
  const classeItem = `${styles.tarefa} ${concluida ? styles.concluida : ""} ${
    styles[prioridade] || ""
  }`;

  const classeTexto = `${styles.textoTarefa} ${
    concluida ? styles["texto-tarefa"] : ""
  }`;

  const classePrioridade = `${styles["badge-prioridade"]} ${
    styles["badge-" + prioridade] || ""
  }`;

  return (
    <div className={classeItem}>
      <div className={styles.conteudoTopo}>
        {/* O checkbox de concluir foi removido daqui */}

        <span
          className={classeTexto}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onEditar && onEditar();
          }}
          title="Clique duplo para editar"
        >
          {texto}
        </span>

        <span className={classePrioridade}>{prioridade}</span>

        <button
          className={styles.btnDeletar}
          onClick={(e) => {
            e.stopPropagation();
            onDeletar();
          }}
        >
          ✕
        </button>
      </div>

      {salvei0cep && (
        <div className={styles.enderecoContainer}>
          {salvei0cep}
        </div>
      )}
    </div>
  );
}

export default TarefaItem;