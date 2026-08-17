
import axios from "axios";

export async function buscarCepAPI(cep) {
  if (!cep || cep.trim() === "") return null;

  const cepLimpo = cep.replace(/\D/g, "");

  if (cepLimpo.length !== 8) return null;

  try {
    const resposta = await axios.get(
      "https://viacep.com.br/ws/" + cepLimpo + "/json/",
    );

    if (resposta.data.erro) {
      return { erro: "CEP nao encontrado." };
    }

    const logradouro = resposta.data.logradouro;
    const bairro = resposta.data.bairro;
    const localidade = resposta.data.localidade;
    const uf = resposta.data.uf;

    return {
      dados: {
        logradouro: logradouro,
        bairro: bairro,
        localidade: localidade,
        uf: uf,
        textoFormatado:
         localidade + ' - RN'
      },
    };
  } catch (erro) {
    console.log("Erro na requisicao Axios:", erro.message);
    return { erro: "Erro ao buscar o CEP." };
  }
}

function TesteAxios() {
  return null;
}

export default TesteAxios;
