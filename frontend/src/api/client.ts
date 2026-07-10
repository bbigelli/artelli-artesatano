import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Injeta token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('artelli_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redireciona para login em 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('artelli_token');
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
