import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export function mensagensDeErro(erro) {
  const data = erro.response?.data?.erro;
  if (!data) {
    return ['Ocorreu um erro inesperado no servidor.'];
  }
  if (Array.isArray(data.detalhes) && data.detalhes.length > 0) {
    return data.detalhes;
  }
  return [data.mensagem || 'Erro ao processar requisição.'];
}

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  resposta => resposta,
  erro => {
    const isLogin = erro.config?.url?.includes('/auth/login');
    if (erro.response?.status === 401 && !isLogin) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(erro);
  }
);

export default api;