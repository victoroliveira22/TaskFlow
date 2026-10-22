import React, { useState, useEffect } from "react";
import api from "../api";
import Header from "../components/Header";
import ListaTarefas from "../components/ListaTarefas";
import ModalTarefa from "../components/ModalTarefa";

function Dashboard() {
  const [tarefas, setTarefas] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todas");

  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState("afazer");

  function normalizarColuna(coluna) {
    if (coluna === "concluida" || coluna === "concluido") return "concluido";
    if (coluna === "andamento" || coluna === "em-andamento") return "andamento";
    return "afazer";
  }

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro("");

      const [respPrioridades, respTarefas, respUsuarios, respProjetos] =
        await Promise.all([
          api.get("/prioridades"),
          api.get("/tarefas"),
          api.get("/usuarios"),
          api.get("/projetos"),
        ]);

      setPrioridades(
        Array.isArray(respPrioridades.data)
          ? respPrioridades.data
          : respPrioridades.data.prioridades || respPrioridades.data.data || []
      );

      setTarefas(
        Array.isArray(respTarefas.data)
          ? respTarefas.data
          : respTarefas.data.tarefas || respTarefas.data.data || []
      );

      setUsuarios(
        Array.isArray(respUsuarios.data)
          ? respUsuarios.data
          : respUsuarios.data.usuarios || respUsuarios.data.data || []
      );

      setProjetos(
        Array.isArray(respProjetos.data)
          ? respProjetos.data
          : respProjetos.data.projetos || respProjetos.data.data || []
      );
    } catch (e) {
      setErro("Erro ao carregar dados do servidor. Verifique a conexão.");
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function salvarTarefa(dados) {
    const colunaValida = normalizarColuna(dados.coluna || colunaAtiva);

    const payload = {
      texto: dados.texto,
      coluna: colunaValida,
      idprioridade: dados.idprioridade,
      prioridade: dados.idprioridade,
      usuario_id: dados.usuario_id,
      projeto_id: dados.projeto_id,
    };

    if (dados.id) {
      await api.put(`/tarefas/${dados.id}`, payload);
    } else {
      await api.post("/tarefas", payload);
    }

    await carregarDados();
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
      const tarefaAtual = tarefas.find(
        (t) => t.id === id || t.id === Number(id)
      );
      if (!tarefaAtual) return;

      const colunaValida = normalizarColuna(novaColuna);

      const payload = {
        texto: tarefaAtual.texto,
        coluna: colunaValida,
        idprioridade: tarefaAtual.idprioridade,
        usuario_id: tarefaAtual.usuario_id,
        projeto_id: tarefaAtual.projeto_id,
      };

      await api.put(`/tarefas/${id}`, payload);
      await carregarDados();
    } catch (e) {
      console.error("Detalhes do erro no servidor:", e.response?.data);
      setErro(
        e.response?.data?.erros?.[0] ||
        e.response?.data?.erro?.mensagem ||
          "Erro ao mover tarefa. Verifique o console."
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
        {carregando && <p className="carregando">Carregando tarefas...</p>}

        {erro && <p className="erro">{erro}</p>}

        {!carregando && (
          <ListaTarefas
            tarefas={tarefas}
            prioridades={prioridades}
            usuarios={usuarios}
            projetos={projetos}
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
          prioridades={prioridades}
          usuarios={usuarios}
          projetos={projetos}
        />
      )}
    </>
  );
}

export default Dashboard;