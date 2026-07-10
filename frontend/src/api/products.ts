import api from './client';
import { Product, ProductList, ProductCreate, Category } from '../types';

export const productService = {
  async list(params?: { category_id?: number; featured?: boolean; search?: string }) {
    const res = await api.get<ProductList[]>('/products/', { params });
    return res.data;
  },

  async featured() {
    const res = await api.get<ProductList[]>('/products/featured');
    return res.data;
  },

  async getById(id: number) {
    const res = await api.get<Product>(`/products/${id}`);
    return res.data;
  },

  async getBySlug(slug: string) {
    const res = await api.get<Product>(`/products/slug/${slug}`);
    return res.data;
  },

  async categories() {
    const res = await api.get<Category[]>('/products/categories');
    return res.data;
  },

  // Admin
  async adminList() {
    const res = await api.get<ProductList[]>('/products/admin/all');
    return res.data;
  },

  async create(data: ProductCreate) {
    const res = await api.post<Product>('/products/', data);
    return res.data;
  },

  async update(id: number, data: Partial<ProductCreate>) {
    const res = await api.put<Product>(`/products/${id}`, data);
    return res.data;
  },

  async remove(id: number) {
    await api.delete(`/products/${id}`);
  },
};
