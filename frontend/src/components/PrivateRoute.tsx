import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function PrivateRoute({ children, adminOnly = false }: { children: JSX.Element; adminOnly?: boolean }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return children;
}
