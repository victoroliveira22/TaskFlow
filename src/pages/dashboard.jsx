import React, { useState } from "react";
import Header from "../components/Header";
import ListaTarefas from "../components/ListaTarefas";
import TesteAxios from "../components/testeAxios";
import ModalTarefa from "../components/ModalTarefa";

function Dashboard({
  tarefas,
  setTarefas,
  filtroStatus,
  setFiltroStatus,
  deletarTarefa,
  moverTarefa,
}) {
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState("afazer");

  function abrirModalCriar(coluna) {
    setTarefaEditando(null);
    setColunaAtiva(coluna);
    setModalAberto(true);
  }

  function abrirModalEditar(tarefa) {
    setTarefaEditando(tarefa);
    setModalAberto(true);
  }

  function salvarTarefa(dados) {
    if (dados.id) {
      setTarefas((prev) =>
        prev.map((t) => (t.id === dados.id ? { ...t, ...dados } : t))
      );
    } else {
      const novaTarefa = {
        ...dados,
        id: crypto.randomUUID(),
        concluida: false,
        coluna: colunaAtiva,
      };
      setTarefas((prev) => [...prev, novaTarefa]);
    }
    setModalAberto(false);
  }

  return (
    <>
      <Header
        titulo="TaskFlow"
        subtitulo="Gerencie suas tarefas"
        tarefas={tarefas}
        filtroAtual={filtroStatus}
        onMudarFiltro={setFiltroStatus}
      />

      <div className="container">
        <TesteAxios />
        <ListaTarefas
          tarefas={tarefas}
          filtroStatus={filtroStatus}
          onDeletar={deletarTarefa}
          onMover={moverTarefa}
          onEditar={abrirModalEditar}
          onAbrirModalCriar={abrirModalCriar}
        />
      </div>

      {modalAberto && (
        <ModalTarefa
          aberto={modalAberto}
          onFechar={() => setModalAberto(false)}
          onSalvar={salvarTarefa}
          tarefa={tarefaEditando}
          coluna={colunaAtiva}
        />
      )}
    </>
  );
}

export default Dashboard;