import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ⚠️ IMPORTANTE: BASE_URL já deve incluir /api
// No Render, VITE_API_URL deve ser: https://artelli-backend.onrender.com/api
const api = axios.create({
  baseURL: BASE_URL,  // ← Isso vai resolver a duplicação
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