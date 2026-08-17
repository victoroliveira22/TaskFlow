import { useState } from "react";
import { buscarCepAPI } from "./testeAxios";
import axios from "axios";

function FormularioTarefa({ onAdicionarTarefa }) {
  const [texto, setTexto] = useState("");
  const [prioridade, setPrioridade] = useState("media");
  const [cep, setCep] = useState("");
  const [enderecoInfo, setEnderecoInfo] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erroCep, setErroCep] = useState("");

  async function handleCepChange(valorCep) {
    setCep(valorCep);
    const cepLimpo = valorCep.replace(/\D/g, "");

    setErroCep("");

    if (cepLimpo.length === 8) {
      setCarregando(true);

      const resultado = await buscarCepAPI(cepLimpo);

      setCarregando(false);

      if (resultado && resultado.erro) {
        setErroCep(resultado.erro);
        setEnderecoInfo("");
      } else if (resultado && resultado.dados) {
        setEnderecoInfo(resultado.dados.textoFormatado);
      }
    } else {
      setEnderecoInfo("");
    }
  }

  function handleSubmit() {
    if (texto.trim() === "") return;

    if (carregando) return;

    const cepLimpo = cep.replace(/\D/g, "");

    if (cep.trim() !== "" && cepLimpo.length !== 8) {
      setErroCep("Adicione um CEP valido");
      return;
    }

    if (erroCep || (cep.trim() !== "" && !enderecoInfo)) {
      setErroCep("Adicione um CEP valido");
      return;
    }

    let localizacaoFinal = "";

    if (enderecoInfo) {
      localizacaoFinal = enderecoInfo;
    }

    onAdicionarTarefa(texto.trim(), prioridade, localizacaoFinal);

    setTexto("");
    setPrioridade("media");
    setCep("");
    setEnderecoInfo("");
    setErroCep("");
  }

  return (
    <section id="formulario">
      <div className="campo-linha">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Nova tarefa..."
        />

        <input
          className="input-cep"
          type="text"
          value={cep}
          onChange={(e) => handleCepChange(e.target.value)}
          placeholder="Digite o CEP"
          maxLength={9}
        />

        <select
          value={prioridade}
          onChange={(e) => setPrioridade(e.target.value)}
        >
          <option value="baixa">Baixa</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>

        <button onClick={handleSubmit}>Adicionar</button>
      </div>

      <div className="feedback-cep">
        {carregando && <span className="texto-carregando"></span>}
        {erroCep && <span className="texto-erro">{erroCep}</span>}
        {enderecoInfo && <span className="texto-sucesso">{enderecoInfo}</span>}
      </div>
    </section>
  );
}

export default FormularioTarefa;
