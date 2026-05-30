import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Package, Users, LayoutDashboard, X, Check } from 'lucide-react';
import { productService } from '../../api/products';
import { userService } from '../../api/users';
import { ProductList, Category, User, ProductCreate } from '../../types';
import toast from 'react-hot-toast';
import './AdminPanel.css';

type Tab = 'dashboard' | 'products' | 'users' | 'categories';

const emptyProduct: ProductCreate = {
  name: '', slug: '', description: '', short_description: '',
  price: 0, original_price: undefined, image_url: '', image_url_2: '', image_url_3: '',
  is_featured: false, is_active: true, is_customizable: true, production_days: 7,
  category_id: undefined,
};

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [products, setProducts] = useState<ProductList[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductList | null>(null);
  const [form, setForm] = useState<ProductCreate>(emptyProduct);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    try {
      const [p, c, u] = await Promise.all([
        productService.adminListAll(),
        productService.getCategories(),
        userService.list(),
      ]);
      setProducts(p);
      setCategories(c);
      setUsers(u);
    } catch {
      toast.error('Erro ao carregar dados');
    }
  }

  function openCreate() {
    setEditingProduct(null);
    setForm(emptyProduct);
    setShowModal(true);
  }

  function openEdit(p: ProductList) {
    setEditingProduct(p);
    setForm({
      name: p.name, slug: p.slug, description: '',
      short_description: p.short_description || '',
      price: p.price, original_price: p.original_price ?? undefined,
      image_url: p.image_url || '', image_url_2: '', image_url_3: '',
      is_featured: p.is_featured, is_active: p.is_active,
      is_customizable: p.is_customizable, production_days: p.production_days,
      category_id: p.category?.id,
    });
    setShowModal(true);
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, form);
        toast.success('Produto atualizado!');
      } else {
        await productService.create(form);
        toast.success('Produto criado!');
      }
      setShowModal(false);
      loadAll();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Erro ao salvar produto';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProduct(id: number, name: string) {
    if (!confirm(`Excluir "${name}"?`)) return;
    try {
      await productService.remove(id);
      toast.success('Produto excluído');
      loadAll();
    } catch { toast.error('Erro ao excluir'); }
  }

  async function handleToggleAdmin(user: User) {
    try {
      await userService.adminUpdate(user.id, { is_admin: !user.is_admin } as Partial<User>);
      toast.success('Usuário atualizado');
      loadAll();
    } catch { toast.error('Erro'); }
  }

  async function handleDeleteUser(id: number) {
    if (!confirm('Excluir este usuário?')) return;
    try {
      await userService.remove(id);
      toast.success('Usuário excluído');
      loadAll();
    } catch { toast.error('Erro ao excluir'); }
  }

  function slugify(text: string) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  return (
    <div className="admin">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span>🌿 Admin</span>
        </div>
        <nav className="admin-sidebar__nav">
          {([
            ['dashboard', 'Dashboard', <LayoutDashboard size={18} />],
            ['products', 'Produtos', <Package size={18} />],
            ['users', 'Usuários', <Users size={18} />],
          ] as [Tab, string, React.ReactNode][]).map(([id, label, icon]) => (
            <button
              key={id}
              className={`admin-sidebar__link ${tab === id ? 'active' : ''}`}
              onClick={() => setTab(id)}
            >
              {icon} {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {/* Dashboard */}
        {tab === 'dashboard' && (
          <div className="admin-section fade-up">
            <h2>Dashboard</h2>
            <div className="admin-stats">
              <div className="admin-stat">
                <span className="admin-stat__num">{products.length}</span>
                <span className="admin-stat__label">Produtos</span>
              </div>
              <div className="admin-stat">
                <span className="admin-stat__num">{products.filter(p => p.is_active).length}</span>
                <span className="admin-stat__label">Produtos ativos</span>
              </div>
              <div className="admin-stat">
                <span className="admin-stat__num">{users.length}</span>
                <span className="admin-stat__label">Usuários</span>
              </div>
              <div className="admin-stat">
                <span className="admin-stat__num">{categories.length}</span>
                <span className="admin-stat__label">Categorias</span>
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        {tab === 'products' && (
          <div className="admin-section fade-up">
            <div className="admin-section__header">
              <h2>Produtos</h2>
              <button className="btn btn-primary btn-sm" onClick={openCreate}>
                <Plus size={15} /> Novo produto
              </button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Categoria</th>
                    <th>Preço</th>
                    <th>Status</th>
                    <th>Destaque</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="admin-table__product">
                          <img src={p.image_url || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=60'} alt={p.name} />
                          <div>
                            <strong>{p.name}</strong>
                            <small>{p.slug}</small>
                          </div>
                        </div>
                      </td>
                      <td>{p.category?.name || '—'}</td>
                      <td>R$ {p.price.toFixed(2)}</td>
                      <td>
                        <span className={`admin-badge ${p.is_active ? 'admin-badge--green' : 'admin-badge--gray'}`}>
                          {p.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        {p.is_featured ? <Check size={16} color="var(--green-700)" /> : '—'}
                      </td>
                      <td>
                        <div className="admin-table__actions">
                          <button className="admin-icon-btn" onClick={() => openEdit(p)} title="Editar">
                            <Edit2 size={15} />
                          </button>
                          <button className="admin-icon-btn danger" onClick={() => handleDeleteProduct(p.id, p.name)} title="Excluir">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="admin-section fade-up">
            <div className="admin-section__header">
              <h2>Usuários</h2>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Usuário</th>
                    <th>E-mail</th>
                    <th>Admin</th>
                    <th>Status</th>
                    <th>Cadastro</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td><strong>{u.username}</strong><br /><small>{u.full_name}</small></td>
                      <td>{u.email}</td>
                      <td>
                        <button
                          className={`admin-badge ${u.is_admin ? 'admin-badge--green' : 'admin-badge--gray'}`}
                          onClick={() => handleToggleAdmin(u)}
                          title="Alternar admin"
                          style={{ cursor: 'pointer', border: 'none' }}
                        >
                          {u.is_admin ? 'Admin' : 'Usuário'}
                        </button>
                      </td>
                      <td>
                        <span className={`admin-badge ${u.is_active ? 'admin-badge--green' : 'admin-badge--gray'}`}>
                          {u.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                      <td>
                        <button className="admin-icon-btn danger" onClick={() => handleDeleteUser(u.id)}>
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Product Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3>{editingProduct ? 'Editar produto' : 'Novo produto'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="admin-modal__form">
              <div className="admin-form-grid">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Nome *</label>
                  <input
                    className="form-input" required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Slug *</label>
                  <input className="form-input" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Categoria</label>
                  <select
                    className="form-input"
                    value={form.category_id || ''}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value ? Number(e.target.value) : undefined })}
                  >
                    <option value="">Sem categoria</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Preço *</label>
                  <input className="form-input" type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Preço original (opcional)</label>
                  <input className="form-input" type="number" step="0.01" value={form.original_price || ''} onChange={(e) => setForm({ ...form, original_price: e.target.value ? Number(e.target.value) : undefined })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Dias de produção</label>
                  <input className="form-input" type="number" value={form.production_days} onChange={(e) => setForm({ ...form, production_days: Number(e.target.value) })} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Descrição curta</label>
                  <input className="form-input" value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Descrição completa</label>
                  <textarea className="form-input" rows={4} style={{ resize: 'vertical' }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">URL da imagem principal</label>
                  <input className="form-input" type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">URL da imagem 2</label>
                  <input className="form-input" type="url" value={form.image_url_2} onChange={(e) => setForm({ ...form, image_url_2: e.target.value })} placeholder="https://..." />
                </div>
                <div className="admin-checkboxes">
                  <label className="admin-checkbox">
                    <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
                    Destaque
                  </label>
                  <label className="admin-checkbox">
                    <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                    Ativo
                  </label>
                  <label className="admin-checkbox">
                    <input type="checkbox" checked={form.is_customizable} onChange={(e) => setForm({ ...form, is_customizable: e.target.checked })} />
                    Personalizável
                  </label>
                </div>
              </div>
              <div className="admin-modal__actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Salvando...' : (editingProduct ? 'Salvar alterações' : 'Criar produto')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
