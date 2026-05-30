import axios from 'axios';

// FIX: VITE_API_URL é baked no build pelo Vite (via ARG no Dockerfile).
// Em dev usa o proxy do vite.config.ts. Em prod usa a URL do Render.
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

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
