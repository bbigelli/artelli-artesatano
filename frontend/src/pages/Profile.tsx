import { useState } from 'react';
import { User, Save, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../api/users';
import toast from 'react-hot-toast';
import './Profile.css';

export default function Profile() {
  const { user, refreshUser, logout } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zip_code: user?.zip_code || '',
  });
  const [loading, setLoading] = useState(false);

  function setField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.updateMe(form);
      await refreshUser();
      toast.success('Perfil atualizado com sucesso!');
    } catch {
      toast.error('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="profile-page">
      <div className="container">
        <div className="profile-page__header">
          <div className="profile-avatar">
            <User size={32} />
          </div>
          <div>
            <h1>{user?.name || user?.username}</h1>
            <p>{user?.email}</p>
            {user?.is_admin && <span className="badge badge-green">Administrador</span>}
          </div>
        </div>

        <div className="profile-page__layout">
          <div className="profile-card">
            <h3>Informações pessoais</h3>
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="profile-form__grid">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Nome completo</label>
                  <input className="form-input" value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="Seu nome completo" />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefone / WhatsApp</label>
                  <input className="form-input" value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="(11) 99999-9999" />
                </div>
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
              <div className="profile-form__actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <Save size={16} /> {loading ? 'Salvando...' : 'Salvar alterações'}
                </button>
                <button type="button" className="btn btn-outline" onClick={logout}>
                  <LogOut size={16} /> Sair da conta
                </button>
              </div>
            </form>
          </div>

          <div className="profile-info-card">
            <h4>Informações da conta</h4>
            <div className="profile-info-row">
              <span>Usuário</span>
              <strong>@{user?.username}</strong>
            </div>
            <div className="profile-info-row">
              <span>E-mail</span>
              <strong>{user?.email}</strong>
            </div>
            <div className="profile-info-row">
              <span>Membro desde</span>
              <strong>{user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '—'}</strong>
            </div>
            <div className="profile-info-row">
              <span>Status</span>
              <span className={`badge ${user?.is_active ? 'badge-green' : 'badge-sand'}`}>
                {user?.is_active ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <hr className="divider" style={{ margin: '16px 0' }} />
            <p className="profile-info-note">
              🌿 Para fazer encomendas, acesse nosso catálogo e finalize via WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
