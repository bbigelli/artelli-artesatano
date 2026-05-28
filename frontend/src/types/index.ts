export interface User {
  id: number;
  email: string;
  username: string;
  name: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface UserCreate {
  email: string;
  username: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  password: string;
}

export interface UserUpdate {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  image_url_2: string | null;
  image_url_3: string | null;
  is_featured: boolean;
  is_active: boolean;
  is_customizable: boolean;
  production_days: number;
  category: Category | null;
  category_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProductList {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  is_customizable: boolean;
  production_days: number;
  category: Category | null;
}

export interface ProductCreate {
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  image_url_2?: string;
  image_url_3?: string;
  is_featured?: boolean;
  is_active?: boolean;
  is_customizable?: boolean;
  production_days?: number;
  category_id?: number;
}

export interface CartItem {
  product: ProductList;
  quantity: number;
  customization?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
