import axios from 'axios';

// Em desenvolvimento: usa o proxy do Vite (relativo)
// Em produção: usa a URL do backend no Render
const BASE_URL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_URL || 'https://artelli-backend.onrender.com');

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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