import { useState, useEffect } from "react";
import Header from "./components/Header";
import FormularioTarefa from "./components/FormularioTarefa";
import ListaTarefas from "./components/ListaTarefas";
import axios from "axios";

function App() {
  const [tarefas, setTarefas] = useState(() => {
    const salvo = localStorage.getItem("taskflow-tarefas");
    return salvo ? JSON.parse(salvo) : [];
  });

  const [filtroStatus, setFiltroStatus] = useState("todas");

  useEffect(() => {
    localStorage.setItem("taskflow-tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  function adicionarTarefa(texto, prioridade) {
    const novaTarefa = {
      id: crypto.randomUUID(),
      texto,
      prioridade,
      concluida: false,
      coluna: "afazer",
    };

    setTarefas((prev) => [...prev, novaTarefa]);
  }

  function deletarTarefa(id) {
    setTarefas((prev) => prev.filter((t) => t.id !== id));
  }

  function concluirTarefa(id) {
    setTarefas((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const proximoStatus = !t.concluida;
          return {
            ...t,
            concluida: proximoStatus,
            // Se for marcada como concluída, vai para a coluna 'concluida', senão volta para 'afazer'
            coluna: proximoStatus ? "concluida" : "afazer",
          };
        }
        return t;
      })
    );
  }

  function moverTarefa(id, novaColuna) {
    setTarefas((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            coluna: novaColuna,
            // Atualiza o booleano 'concluida' de acordo com a coluna de destino
            concluida: novaColuna === "concluida",
          };
        }
        return t;
      })
    );
  }

  return (
    <div id="app">
      <Header
        titulo="TaskFlow"
        subtitulo="Gerencie suas tarefas"
        tarefas={tarefas}
        filtroAtual={filtroStatus}
        onMudarFiltro={setFiltroStatus}
      />

      <main className="container">
        <FormularioTarefa onAdicionarTarefa={adicionarTarefa} />

        <ListaTarefas
          tarefas={tarefas}
          filtroStatus={filtroStatus}
          onDeletar={deletarTarefa}
          onConcluir={concluirTarefa}
          onMover={moverTarefa}
        />
      </main>

      <footer>
        <p>TaskFlow 2026 - Victor</p>
      </footer>
    </div>
  );
}

export default App;