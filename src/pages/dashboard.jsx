import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import ListaTarefas from "../components/ListaTarefas";
import TesteAxios from "../components/testeAxios";
import ModalTarefa from "../components/ModalTarefa";

const URL_API = "https://6a86e66570fbbd308f988242.mockapi.io/tarefas";

function Dashboard() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todas");

  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState("afazer");

  // GET — Carregar tarefas da API ao iniciar
  useEffect(() => {
    async function carregarTarefas() {
      try {
        setCarregando(true);
        setErro("");
        const resposta = await axios.get(URL_API);
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

  // POST / PUT — Criar ou editar tarefa
  async function salvarTarefa(dados) {
    try {
      if (dados.id !== undefined) {
        // EDITAR (PUT)
        const { data: tarefaEditada } = await axios.put(
          `${URL_API}/${dados.id}`,
          {
            texto: dados.texto,
            prioridade: dados.prioridade,
            cidade: dados.cidade,
            coluna: dados.coluna,
            concluida: dados.coluna === "concluida",
          }
        );

        setTarefas((tarefasAtuais) =>
          tarefasAtuais.map((t) => (t.id === dados.id ? tarefaEditada : t))
        );
      } else {
        // CRIAR (POST)
        const { data: novaTarefa } = await axios.post(URL_API, {
          texto: dados.texto,
          prioridade: dados.prioridade,
          cidade: dados.cidade,
          coluna: colunaAtiva,
          concluida: colunaAtiva === "concluida",
        });

        setTarefas((tarefasAtuais) => [...tarefasAtuais, novaTarefa]);
      }
      setModalAberto(false);
    } catch (e) {
      setErro("Erro ao salvar tarefa. Tente novamente.");
      console.error(e);
    }
  }

  // DELETE — Remover tarefa
  async function deletarTarefa(id) {
    const confirmado = window.confirm(
      "Tem certeza que deseja deletar esta tarefa?"
    );
    if (!confirmado) return;

    try {
      await axios.delete(`${URL_API}/${id}`);
      setTarefas((tarefasAtuais) =>
        tarefasAtuais.filter((t) => t.id !== id)
      );
    } catch (e) {
      setErro("Erro ao deletar tarefa. Tente novamente.");
      console.error(e);
    }
  }

  // PATCH — Mover tarefa de coluna
  async function moverTarefa(id, novaColuna) {
    try {
      const { data: tarefaMovida } = await axios.put(
        `${URL_API}/${id}`,
        {
          coluna: novaColuna,
          concluida: novaColuna === "concluida",
        }
      );

      setTarefas((tarefasAtuais) =>
        tarefasAtuais.map((t) => (t.id === id ? tarefaMovida : t))
      );
    } catch (e) {
      setErro("Erro ao mover tarefa. Tente novamente.");
      console.error(e);
    }
  }

  function abrirModalCriar(coluna) {
    setTarefaEditando(null);
    setColunaAtiva(coluna);
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