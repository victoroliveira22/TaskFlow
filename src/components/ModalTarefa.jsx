import { useState, useEffect } from 'react';
import styles from './ModalTarefa.module.css';
import axios from 'axios';

function ModalTarefa({ aberto, onFechar, onSalvar, tarefa = null, coluna = 'afazer' }) {
  const [texto, setTexto] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [prioridade, setPrioridade] = useState('media');
  const [erroCep, setErroCep] = useState('');
  const [carregandoCep, setCarregandoCep] = useState(false);

  useEffect(() => {
    if (tarefa) {
      setTexto(tarefa.texto || '');
      setCidade(tarefa.cidade || tarefa.salvei0cep || '');
      setCep(tarefa.cep || '');
      setPrioridade(tarefa.prioridade || 'media');
      setErroCep('');
    } else {
      setTexto('');
      setCep('');
      setCidade('');
      setPrioridade('media');
      setErroCep('');
    }
  }, [tarefa, aberto]);

  async function consultarCidade(cepDigitado) {
    setErroCep('');
    const cepApenasNumeros = cepDigitado.replace(/\D/g, '');

    if (cepApenasNumeros.length === 0) {
      setCidade('');
      return '';
    }

    if (cepApenasNumeros.length !== 8) {
      setCidade('');
      setErroCep('O CEP deve conter 8 números');
      return '';
    }

    setCarregandoCep(true);
    try {
      const { data } = await axios.get(
        `https://viacep.com.br/ws/${cepApenasNumeros}/json/`
      );

      if (data.erro) {
        setCidade('');
        setErroCep('CEP não encontrado');
        return '';
      } else {
        const nomeCidade = `${data.localidade}/${data.uf}`;
        setCidade(nomeCidade);
        setErroCep('');
        return nomeCidade;
      }
    } catch (e) {
      setCidade('');
      setErroCep('Erro ao consultar CEP');
      return '';
    } finally {
      setCarregandoCep(false);
    }
  }

  async function handleSalvar() {
    if (!texto.trim()) return;

    let cidadeFinal = cidade;
    const cepNumeros = cep.replace(/\D/g, '');

    // Se o CEP tem 8 dígitos mas a cidade ainda não foi carregada, busca antes de salvar
    if (cepNumeros.length === 8 && !cidadeFinal) {
      cidadeFinal = await consultarCidade(cep);
      if (!cidadeFinal) return; // Interrompe se o CEP for inválido
    }

    onSalvar({
      id: tarefa?.id,
      texto,
      cep,
      cidade: cidadeFinal,
      prioridade,
      coluna: tarefa?.coluna || coluna,
    });

    onFechar();
  }

  if (!aberto) return null;

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <h2>{tarefa ? 'Editar tarefa' : 'Nova tarefa'}</h2>

        <input
          placeholder="Escreva a tarefa..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />

        <input
          placeholder="CEP (opcional)"
          value={cep}
          maxLength={9}
          onChange={(e) => {
            setCep(e.target.value);
            consultarCidade(e.target.value);
          }}
        />

        {carregandoCep && <p className={styles.cidade}>Buscando CEP...</p>}
        {!carregandoCep && cidade && <p className={styles.cidade}>{cidade}</p>}
        {erroCep && <p className={styles.erro}>{erroCep}</p>}

        <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>

        <div className={styles.botoes}>
          <button onClick={onFechar}>Cancelar</button>
          <button onClick={handleSalvar} disabled={carregandoCep}>
            {carregandoCep ? 'Buscando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalTarefa;