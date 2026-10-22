import TarefaItem from "./TarefaItem.jsx";

function ListaTarefas({
  tarefas = [],
  prioridades = [],
  usuarios = [],
  projetos = [],
  filtroStatus = "todas",
  onDeletar,
  onMover,
  onEditar,
  onAbrirModalCriar,
}) {
  const eConcluida = (t) =>
    t.coluna === "concluido" || t.coluna === "concluida" || t.concluida === true;

  const tarefasFiltradas = tarefas.filter((t) => {
    if (filtroStatus === "pendentes") return !eConcluida(t);
    if (filtroStatus === "concluidas") return eConcluida(t);
    return true;
  });

  const afazer = tarefasFiltradas.filter(
    (t) => (t.coluna === "afazer" || !t.coluna) && !eConcluida(t)
  );

  const andamento = tarefasFiltradas.filter(
    (t) => (t.coluna === "andamento" || t.coluna === "em-andamento") && !eConcluida(t)
  );

  const concluidas = tarefasFiltradas.filter((t) => eConcluida(t));

  return (
    <section id="lista-section">
      <div className="kanban-container">
        <div className="coluna afazer">
          <div className="coluna-header">
            <h2>A Fazer</h2>
            {onAbrirModalCriar && (
              <button
                className="btnMover"
                onClick={() => onAbrirModalCriar("afazer")}
              >
                +
              </button>
            )}
          </div>
          <div className="lista-cards">
            {afazer.length === 0 ? (
              <p className="msg-vazia">Nenhuma tarefa</p>
            ) : (
              afazer.map((t) => (
                <div key={t.id} className="card-wrapper">
                  <TarefaItem
                    texto={t.texto}
                    idprioridade={t.idprioridade || t.prioridade}
                    prioridades={prioridades}
                    usuarioId={t.usuario_id || t.usuarioId}
                    usuarios={usuarios}
                    projetoId={t.projeto_id || t.projetoId}
                    projetos={projetos}
                    concluida={false}
                    onDeletar={() => onDeletar(t.id)}
                    onEditar={() => onEditar && onEditar(t)}
                  />
                  <div className="acoes-mover">
                    <button
                      className="btnMover"
                      onClick={() => onMover && onMover(t.id, "andamento")}
                    >
                      Mover →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="coluna andamento">
          <div className="coluna-header">
            <h2>Em Andamento</h2>
            {onAbrirModalCriar && (
              <button
                className="btnMover"
                onClick={() => onAbrirModalCriar("andamento")}
              >
                +
              </button>
            )}
          </div>
          <div className="lista-cards">
            {andamento.length === 0 ? (
              <p className="msg-vazia">Nenhuma tarefa</p>
            ) : (
              andamento.map((t) => (
                <div key={t.id} className="card-wrapper">
                  <TarefaItem
                    texto={t.texto}
                    idprioridade={t.idprioridade || t.prioridade}
                    prioridades={prioridades}
                    usuarioId={t.usuario_id || t.usuarioId}
                    usuarios={usuarios}
                    projetoId={t.projeto_id || t.projetoId}
                    projetos={projetos}
                    concluida={false}
                    onDeletar={() => onDeletar(t.id)}
                    onEditar={() => onEditar && onEditar(t)}
                  />
                  <div className="acoes-mover">
                    <button
                      className="btnMover"
                      onClick={() => onMover && onMover(t.id, "afazer")}
                    >
                      ← Voltar
                    </button>
                    <button
                      className="btnMover"
                      onClick={() => onMover && onMover(t.id, "concluido")}
                    >
                      Mover →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="coluna concluidas">
          <div className="coluna-header">
            <h2>Concluidas</h2>
            {onAbrirModalCriar && (
              <button
                className="btnMover"
                onClick={() => onAbrirModalCriar("concluido")}
              >
                +
              </button>
            )}
          </div>
          <div className="lista-cards">
            {concluidas.length === 0 ? (
              <p className="msg-vazia">Nenhuma tarefa</p>
            ) : (
              concluidas.map((t) => (
                <div key={t.id} className="card-wrapper">
                  <TarefaItem
                    texto={t.texto}
                    idprioridade={t.idprioridade || t.prioridade}
                    prioridades={prioridades}
                    usuarioId={t.usuario_id || t.usuarioId}
                    usuarios={usuarios}
                    projetoId={t.projeto_id || t.projetoId}
                    projetos={projetos}
                    concluida={true}
                    onDeletar={() => onDeletar(t.id)}
                    onEditar={() => onEditar && onEditar(t)}
                  />
                  <div className="acoes-mover">
                    <button
                      className="btnMover"
                      onClick={() => onMover && onMover(t.id, "andamento")}
                    >
                      ← Voltar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ListaTarefas;