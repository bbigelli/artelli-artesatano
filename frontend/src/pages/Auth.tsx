import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Leaf } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../api/auth';
import toast from 'react-hot-toast';
import './Auth.css';

type Mode = 'login' | 'register';

export default function Auth() {
  const [mode, setMode] = useState<Mode>('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '', username: '', full_name: '', password: '', confirm: '',
  });

  function set(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email || form.username, form.password);
        toast.success('Bem-vinda de volta! 🌿');
        navigate('/');
      } else {
        if (form.password !== form.confirm) {
          toast.error('As senhas não conferem');
          return;
        }
        await authService.register({
          email: form.email,
          username: form.username,
          full_name: form.full_name,
          password: form.password,
        });
        await login(form.username, form.password);
        toast.success('Conta criada com sucesso! 🌿');
        navigate('/');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Erro ao processar solicitação';
      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <Leaf size={28} />
          <span>Artelli</span>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`} onClick={() => setMode('login')}>Entrar</button>
          <button className={`auth-tab ${mode === 'register' ? 'auth-tab--active' : ''}`} onClick={() => setMode('register')}>Criar conta</button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Nome completo</label>
                <input className="form-input" type="text" placeholder="Maria Silva" value={form.full_name} onChange={(e) => set('full_name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Username *</label>
                <input className="form-input" type="text" placeholder="mariasilva" required value={form.username} onChange={(e) => set('username', e.target.value)} />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">{mode === 'login' ? 'Email ou username *' : 'Email *'}</label>
            <input className="form-input" type={mode === 'register' ? 'email' : 'text'} placeholder={mode === 'login' ? 'seu@email.com ou @username' : 'seu@email.com'} required value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Senha *</label>
            <div className="form-input-icon">
              <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="••••••••" required minLength={6} value={form.password} onChange={(e) => set('password', e.target.value)} />
              <button type="button" onClick={() => setShowPass((s) => !s)}>{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Confirmar senha *</label>
              <input className="form-input" type="password" placeholder="••••••••" required value={form.confirm} onChange={(e) => set('confirm', e.target.value)} />
            </div>
          )}

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <p className="auth-footer">
          {mode === 'login'
            ? <>Não tem conta? <button onClick={() => setMode('register')}>Criar agora</button></>
            : <>Já tem conta? <button onClick={() => setMode('login')}>Entrar</button></>
          }
        </p>
      </div>
    </main>
  );
}
