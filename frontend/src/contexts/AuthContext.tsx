import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('artelli_token'));

  useEffect(() => {
    if (token) loadUser();
  }, []);

  async function loadUser() {
    try {
      const me = await authService.getMe();
      setUser(me);
    } catch {
      logout();
    }
  }

  async function login(username: string, password: string) {
    const data = await authService.login(username, password);
    localStorage.setItem('artelli_token', data.access_token);
    setToken(data.access_token);
    const me = await authService.getMe();
    setUser(me);
  }

  function logout() {
    localStorage.removeItem('artelli_token');
    setToken(null);
    setUser(null);
  }

  async function refreshUser() {
    await loadUser();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isAdmin: !!user?.is_admin,
        login,
        logout,
        refreshUser,
      }}
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
