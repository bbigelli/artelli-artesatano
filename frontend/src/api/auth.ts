import api from './client';
import { User, UserCreate } from '../types';

export const authService = {
  async login(username: string, password: string) {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    const res = await api.post<{ access_token: string; token_type: string }>(
      '/auth/token',
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return res.data;
  },

  async register(data: UserCreate) {
    const res = await api.post<User>('/users/register', data);
    return res.data;
  },

  async getMe() {
    const res = await api.get<User>('/auth/me');
    return res.data;
  },
};
