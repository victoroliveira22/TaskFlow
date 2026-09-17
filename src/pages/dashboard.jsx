import React, { useState, useEffect } from "react";
import api from "../api";
import Header from "../components/Header";
import ListaTarefas from "../components/ListaTarefas";
import ModalTarefa from "../components/ModalTarefa";

function Dashboard() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todas");

  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState("afazer");

  function normalizarColuna(coluna) {
    if (coluna === "concluida") return "concluido";
    if (coluna === "em-andamento") return "andamento";
    return coluna;
  }

  useEffect(() => {
    async function carregarTarefas() {
      try {
        setCarregando(true);
        setErro("");
        const resposta = await api.get("/tarefas");
        setTarefas(resposta.data);
      } catch (e) {
        setErro("Erro ao carregar tarefas. Verifique a conexão.");
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }

    carregarTarefas();
  }, []);

  async function salvarTarefa(dados) {
    try {
      const colunaValida = normalizarColuna(dados.coluna || colunaAtiva);

      if (dados.id !== undefined) {
        const { data: tarefaEditada } = await api.put(`/tarefas/${dados.id}`, {
          texto: dados.texto,
          prioridade: dados.prioridade,
          cidade: dados.cidade || "",
          coluna: colunaValida,
          concluida: colunaValida === "concluido",
        });

        setTarefas((tarefasAtuais) =>
          tarefasAtuais.map((t) => (t.id === dados.id ? tarefaEditada : t))
        );
      } else {
        const { data: novaTarefa } = await api.post("/tarefas", {
          texto: dados.texto,
          prioridade: dados.prioridade,
          cidade: dados.cidade || "",
          coluna: colunaValida,
          concluida: colunaValida === "concluido",
        });

        setTarefas((tarefasAtuais) => [...tarefasAtuais, novaTarefa]);
      }
      setModalAberto(false);
    } catch (e) {
      setErro("Erro ao salvar tarefa. Tente novamente.");
      console.error(e);
    }
  }

  async function deletarTarefa(id) {
    const confirmado = window.confirm(
      "Tem certeza que deseja deletar esta tarefa?"
    );
    if (!confirmado) return;

    try {
      await api.delete(`/tarefas/${id}`);
      setTarefas((tarefasAtuais) =>
        tarefasAtuais.filter((t) => t.id !== id)
      );
    } catch (e) {
      setErro("Erro ao deletar tarefa. Tente novamente.");
      console.error(e);
    }
  }

  async function moverTarefa(id, novaColuna) {
    try {
      const tarefaAtual = tarefas.find((t) => t.id === id || t.id === Number(id));
      if (!tarefaAtual) return;

      const colunaValida = normalizarColuna(novaColuna);

      const payload = {
        texto: tarefaAtual.texto,
        prioridade: tarefaAtual.prioridade,
        cidade: tarefaAtual.cidade || "",
        coluna: colunaValida,
        concluida: colunaValida === "concluido",
      };

      const { data: tarefaMovida } = await api.put(`/tarefas/${id}`, payload);

      setTarefas((tarefasAtuais) =>
        tarefasAtuais.map((t) => (t.id === id ? tarefaMovida : t))
      );
    } catch (e) {
      console.error("Detalhes do erro no servidor:", e.response?.data);
      setErro(
        e.response?.data?.erro || "Erro ao mover tarefa. Verifique o console."
      );
    }
  }

  function abrirModalCriar(coluna) {
    setTarefaEditando(null);
    setColunaAtiva(normalizarColuna(coluna));
    setModalAberto(true);
  }

  function abrirModalEditar(tarefa) {
    setTarefaEditando(tarefa);
    setModalAberto(true);
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

        {carregando && <p className="carregando">Carregando tarefas...</p>}

        {erro && <p className="erro">{erro}</p>}

        {!carregando && (
          <ListaTarefas
            tarefas={tarefas}
            filtroStatus={filtroStatus}
            onDeletar={deletarTarefa}
            onMover={moverTarefa}
            onEditar={abrirModalEditar}
            onAbrirModalCriar={abrirModalCriar}
          />
        )}
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