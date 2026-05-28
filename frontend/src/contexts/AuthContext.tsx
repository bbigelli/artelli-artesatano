import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserCreate } from '../types';
import { authService } from '../api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: UserCreate) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('artelli_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('artelli_token')
  );

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.is_admin ?? false;

  useEffect(() => {
    if (token && !user) refreshUser();
  }, []);

  async function login(username: string, password: string) {
    const data = await authService.login(username, password);
    localStorage.setItem('artelli_token', data.access_token);
    setToken(data.access_token);
    const me = await authService.getMe();
    localStorage.setItem('artelli_user', JSON.stringify(me));
    setUser(me);
  }

  async function register(data: UserCreate) {
    await authService.register(data);
    await login(data.username, data.password);
  }

  function logout() {
    localStorage.removeItem('artelli_token');
    localStorage.removeItem('artelli_user');
    setToken(null);
    setUser(null);
  }

  async function refreshUser() {
    try {
      const me = await authService.getMe();
      localStorage.setItem('artelli_user', JSON.stringify(me));
      setUser(me);
    } catch {
      logout();
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, isAdmin, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
