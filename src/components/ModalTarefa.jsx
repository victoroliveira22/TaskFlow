import { useState, useEffect } from 'react';
import styles from './ModalTarefa.module.css';
import { mensagensDeErro } from '../api';

function paraNumero(valor) {
  if (valor === '' || valor === undefined || valor === null) return null;
  const num = Number(valor);
  return Number.isNaN(num) ? null : num;
}

function ModalTarefa({
  aberto,
  onFechar,
  onSalvar,
  tarefa = null,
  coluna = 'afazer',
  prioridades = [],
  usuarios = [],
  projetos = [],
}) {
  const [texto, setTexto] = useState('');
  const [idPrioridade, setIdPrioridade] = useState('');
  const [idUsuario, setIdUsuario] = useState('');
  const [idProjeto, setIdProjeto] = useState('');
  const [erros, setErros] = useState([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (tarefa) {
      setTexto(tarefa.texto || '');
      setIdPrioridade(tarefa.idprioridade || tarefa.prioridade || '');
      setIdUsuario(tarefa.usuario_id || tarefa.usuarioId || '');
      setIdProjeto(tarefa.projeto_id || tarefa.projetoId || '');
      setErros([]);
    } else {
      setTexto('');
      setIdPrioridade('');
      setIdUsuario('');
      setIdProjeto('');
      setErros([]);
    }
  }, [tarefa, aberto]);

  async function handleSalvar() {
    setErros([]);

    if (!texto.trim()) {
      setErros(['O texto da tarefa não pode estar vazio.']);
      return;
    }

    setSalvando(true);
    try {
      await onSalvar({
        id: tarefa?.id,
        texto: texto.trim(),
        coluna: tarefa?.coluna || coluna,
        idprioridade: paraNumero(idPrioridade),
        usuario_id: paraNumero(idUsuario),
        projeto_id: paraNumero(idProjeto),
      });

      onFechar();
    } catch (err) {
      const msgServidor = err.response?.data?.erro?.mensagem || err.response?.data?.mensagem;
      if (msgServidor) {
        setErros([msgServidor]);
      } else {
        setErros(mensagensDeErro(err));
      }
    } finally {
      setSalvando(false);
    }
  }

  if (!aberto) return null;

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <h2>{tarefa ? 'Editar tarefa' : 'Nova tarefa'}</h2>

        {Array.isArray(erros) && erros.length > 0 && (
          <div className={styles.erroBox}>
            <ul>
              {erros.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <input
          placeholder="Escreva a tarefa..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />

        <label>Prioridade:</label>
        <select
          value={idPrioridade}
          onChange={(e) => setIdPrioridade(e.target.value)}
        >
          <option value="">Selecione uma prioridade</option>
          {Array.isArray(prioridades) &&
            prioridades.map((p, idx) => {
              const valor = typeof p === 'object' ? p?.id ?? '' : p;
              const textoExibicao = typeof p === 'object' ? p?.nome ?? p?.titulo ?? p?.descricao ?? '' : p;
              return (
                <option key={idx} value={valor}>
                  {textoExibicao}
                </option>
              );
            })}
        </select>

        <label>Responsável:</label>
        <select
          value={idUsuario}
          onChange={(e) => setIdUsuario(e.target.value)}
        >
          <option value="">Selecione um usuário</option>
          {Array.isArray(usuarios) &&
            usuarios.map((u, idx) => {
              const valor = typeof u === 'object' ? u?.id ?? '' : u;
              const textoExibicao = typeof u === 'object' ? u?.nome ?? u?.nome_usuario ?? '' : u;
              return (
                <option key={idx} value={valor}>
                  {textoExibicao}
                </option>
              );
            })}
        </select>

        <label>Projeto:</label>
        <select
          value={idProjeto}
          onChange={(e) => setIdProjeto(e.target.value)}
        >
          <option value="">Selecione um projeto</option>
          {Array.isArray(projetos) &&
            projetos.map((proj, idx) => {
              const valor = typeof proj === 'object' ? proj?.id ?? '' : proj;
              const textoExibicao = typeof proj === 'object' ? proj?.nome ?? proj?.descricao ?? '' : proj;
              return (
                <option key={idx} value={valor}>
                  {textoExibicao}
                </option>
              );
            })}
        </select>

        <div className={styles.botoes}>
          <button onClick={onFechar} disabled={salvando}>
            Cancelar
          </button>
          <button onClick={handleSalvar} disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalTarefa;