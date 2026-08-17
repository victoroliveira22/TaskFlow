import TarefaItem from "./TarefaItem.jsx";

function ListaTarefas({
  tarefas = [],
  filtroStatus = "todas",
  onDeletar,
  onMover,
  onEditar,
  onAbrirModalCriar,
}) {
  const tarefasFiltradas = tarefas.filter((t) => {
    if (filtroStatus === "pendentes") return !t.concluida;
    if (filtroStatus === "concluidas") return t.concluida;
    return true;
  });

  const afazer = tarefasFiltradas.filter(
    (t) => t.coluna === "afazer" || !t.coluna
  );
  const andamento = tarefasFiltradas.filter((t) => t.coluna === "andamento");
  const concluidas = tarefasFiltradas.filter((t) => t.coluna === "concluida");

  return (
    <section id="lista-section">
      <div className="kanban-container">
        {/* Coluna 1: A Fazer */}
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
                    prioridade={t.prioridade}
                    concluida={t.concluida}
                    salvei0cep={t.salvei0cep || t.cep || t.cidade}
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

        {/* Coluna 2: Em Andamento */}
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
                    prioridade={t.prioridade}
                    concluida={t.concluida}
                    salvei0cep={t.salvei0cep || t.cep || t.cidade}
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
                      onClick={() => onMover && onMover(t.id, "concluida")}
                    >
                      Mover →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Coluna 3: Concluidas */}
        <div className="coluna concluidas">
          <div className="coluna-header">
            <h2>Concluidas</h2>
            {onAbrirModalCriar && (
              <button
                className="btnMover"
                onClick={() => onAbrirModalCriar("concluida")}
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
                    prioridade={t.prioridade}
                    concluida={t.concluida}
                    salvei0cep={t.salvei0cep || t.cep || t.cidade}
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