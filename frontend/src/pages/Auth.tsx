import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      toast.success('Bem-vindo de volta! 🌿');
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Usuário ou senha incorretos';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <Link to="/" className="auth-card__logo">
            <Leaf size={20} /> Artelli
          </Link>
          <h1>Entrar na sua conta</h1>
          <p>Bem-vindo de volta. Acesse para acompanhar seus pedidos.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Usuário ou e-mail</label>
            <input
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="seu@email.com"
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Senha</label>
            <div className="auth-pw-wrap">
              <input
                className="form-input"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="auth-card__footer">
          Ainda não tem conta? <Link to="/cadastro">Cadastrar gratuitamente</Link>
        </p>
      </div>
      <div className="auth-visual">
        <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800" alt="Artesanato" />
        <div className="auth-visual__overlay">
          <blockquote>"Cada peça carrega a alma de quem a criou."</blockquote>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  // FIX: campo renomeado de "name" para "full_name" para alinhar com o backend
  const [form, setForm] = useState({
    email: '', username: '', full_name: '', phone: '',
    address: '', city: '', state: '', zip_code: '', password: '', confirm: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  function setField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('As senhas não coincidem');
      return;
    }
    if (form.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      await register({
        email: form.email,
        username: form.username,
        full_name: form.full_name || undefined,  // FIX: era "name:"
        phone: form.phone || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        zip_code: form.zip_code || undefined,
        password: form.password,
      });
      toast.success('Conta criada! Bem-vindo à Artelli 🌿');
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Erro ao criar conta';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page auth-page--register">
      <div className="auth-card auth-card--wide">
        <div className="auth-card__header">
          <Link to="/" className="auth-card__logo"><Leaf size={20} /> Artelli</Link>
          <h1>Criar conta</h1>
          <p>Cadastre-se para fazer encomendas personalizadas com facilidade.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__grid">
            <div className="form-group">
              <label className="form-label">E-mail *</label>
              <input className="form-input" type="email" required value={form.email} onChange={(e) => setField('email', e.target.value)} placeholder="seu@email.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Usuário *</label>
              <input className="form-input" required value={form.username} onChange={(e) => setField('username', e.target.value)} placeholder="nome.usuario" />
            </div>
            <div className="form-group">
              <label className="form-label">Nome completo</label>
              {/* FIX: campo "name" → "full_name" */}
              <input className="form-input" value={form.full_name} onChange={(e) => setField('full_name', e.target.value)} placeholder="Maria Silva" />
            </div>
            <div className="form-group">
              <label className="form-label">Telefone / WhatsApp</label>
              <input className="form-input" value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="(11) 99999-9999" />
            </div>
          </div>
          <div className="auth-form__section-title">Endereço de entrega</div>
          <div className="auth-form__grid">
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Endereço</label>
              <input className="form-input" value={form.address} onChange={(e) => setField('address', e.target.value)} placeholder="Rua, número, complemento" />
            </div>
            <div className="form-group">
              <label className="form-label">Cidade</label>
              <input className="form-input" value={form.city} onChange={(e) => setField('city', e.target.value)} placeholder="São Paulo" />
            </div>
            <div className="form-group">
              <label className="form-label">Estado</label>
              <input className="form-input" maxLength={2} value={form.state} onChange={(e) => setField('state', e.target.value.toUpperCase())} placeholder="SP" />
            </div>
            <div className="form-group">
              <label className="form-label">CEP</label>
              <input className="form-input" value={form.zip_code} onChange={(e) => setField('zip_code', e.target.value)} placeholder="00000-000" />
            </div>
          </div>
          <div className="auth-form__section-title">Senha</div>
          <div className="auth-form__grid">
            <div className="form-group">
              <label className="form-label">Senha *</label>
              <div className="auth-pw-wrap">
                <input className="form-input" type={showPw ? 'text' : 'password'} required value={form.password} onChange={(e) => setField('password', e.target.value)} placeholder="Mínimo 6 caracteres" />
                <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar senha *</label>
              <input className="form-input" type="password" required value={form.confirm} onChange={(e) => setField('confirm', e.target.value)} placeholder="Repita a senha" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar minha conta'}
          </button>
        </form>
        <p className="auth-card__footer">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
