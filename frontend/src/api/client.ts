import axios from 'axios';

// Pega a URL do backend das variáveis de ambiente
// No desenvolvimento: http://localhost:8000
// Em produção: https://artelli-backend.onrender.com
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('artelli_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('artelli_token');
      localStorage.removeItem('artelli_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;