import api from './client';
import { User, UserUpdate } from '../types';

export const userService = {
  async updateMe(data: UserUpdate) {
    const res = await api.put<User>('/users/me', data);
    return res.data;
  },

  async list() {
    const res = await api.get<User[]>('/users/');
    return res.data;
  },

  async adminUpdate(id: number, data: Partial<User>) {
    const res = await api.put<User>(`/users/${id}`, data);
    return res.data;
  },

  async remove(id: number) {
    await api.delete(`/users/${id}`);
  },
};
