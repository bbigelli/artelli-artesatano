import { useEffect, useState } from 'react';
import { Package, Users, Plus, Pencil, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { productService } from '../../api/products';
import { userService } from '../../api/users';
import { Product, User, Category, ProductCreate } from '../../types';
import toast from 'react-hot-toast';
import './AdminPanel.css';

type Tab = 'products' | 'users';

const EMPTY_PRODUCT: ProductCreate = {
  name: '', slug: '', description: '', short_description: '',
  price: 0, original_price: undefined, image_url: '', image_url_2: '', image_url_3: '',
  is_featured: false, is_active: true, is_customizable: false,
  production_days: 7, category_id: undefined,
};

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState<ProductCreate | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [prods, cats, usrs] = await Promise.all([
        productService.adminList(),
        productService.categories(),
        userService.list(),
      ]);
      setProducts(prods as any);
      setCategories(cats);
      setUsers(usrs);
    } catch { toast.error('Erro ao carregar dados'); }
    finally { setLoading(false); }
  }

  function openNew() { setEditProduct({ ...EMPTY_PRODUCT }); setEditId(null); setShowForm(true); }
  function openEdit(p: Product) {
    setEditProduct({
      name: p.name, slug: p.slug, description: p.description || '',
      short_description: p.short_description || '', price: p.price,
      original_price: p.original_price || undefined, image_url: p.image_url || '',
      image_url_2: p.image_url_2 || '', image_url_3: p.image_url_3 || '',
      is_featured: p.is_featured, is_active: p.is_active,
      is_customizable: p.is_customizable, production_days: p.production_days,
      category_id: p.category?.id,
    });
    setEditId(p.id);
    setShowForm(true);
  }

  function setField(field: string, value: any) {
    setEditProduct((prev) => prev ? { ...prev, [field]: value } : prev);
  }

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editProduct) return;
    try {
      if (editId) { await productService.update(editId, editProduct); toast.success('Produto atualizado!'); }
      else { await productService.create(editProduct); toast.success('Produto criado! 🌿'); }
      setShowForm(false); setEditProduct(null); setEditId(null);
      await loadAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Erro ao salvar');
    }
  }

  async function deleteProduct(id: number) {
    if (!confirm('Desativar este produto?')) return;
    try { await productService.remove(id); toast.success('Produto desativado'); await loadAll(); }
    catch { toast.error('Erro ao desativar'); }
  }

  async function toggleAdmin(u: User) {
    try {
      await userService.adminUpdate(u.id, { is_admin: !u.is_admin });
      toast.success('Usuário atualizado');
      await loadAll();
    } catch { toast.error('Erro ao atualizar'); }
  }

  return (
    <main className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Painel <em>Admin</em></h1>
            <p>Gerencie produtos e usuários da Artelli.</p>
          </div>
          <div className="admin-stats">
            <div className="admin-stat"><span>{products.length}</span><label>Produtos</label></div>
            <div className="admin-stat"><span>{users.length}</span><label>Usuários</label></div>
          </div>
        </div>

        <div className="admin-tabs">
          <button className={`admin-tab ${tab === 'products' ? 'admin-tab--active' : ''}`} onClick={() => setTab('products')}><Package size={16} /> Produtos</button>
          <button className={`admin-tab ${tab === 'users' ? 'admin-tab--active' : ''}`} onClick={() => setTab('users')}><Users size={16} /> Usuários</button>
        </div>

        {/* ── PRODUTOS ── */}
        {tab === 'products' && (
          <div className="admin-section">
            <div className="admin-section__header">
              <h2>Produtos</h2>
              <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Novo produto</button>
            </div>

            {/* Formulário */}
            {showForm && editProduct && (
              <form className="admin-form" onSubmit={saveProduct}>
                <div className="admin-form__header">
                  <h3>{editId ? 'Editar produto' : 'Novo produto'}</h3>
                  <button type="button" onClick={() => setShowForm(false)} className="admin-form__close">✕</button>
                </div>
                <div className="admin-form__grid">
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Nome *</label>
                    <input className="form-input" required value={editProduct.name} onChange={(e) => setField('name', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Slug *</label>
                    <input className="form-input" required value={editProduct.slug} onChange={(e) => setField('slug', e.target.value)} placeholder="ex: terrario-vidro-grande" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Categoria</label>
                    <select className="form-input" value={editProduct.category_id || ''} onChange={(e) => setField('category_id', e.target.value ? Number(e.target.value) : undefined)}>
                      <option value="">Sem categoria</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preço (R$) *</label>
                    <input className="form-input" type="number" step="0.01" min="0" required value={editProduct.price} onChange={(e) => setField('price', parseFloat(e.target.value))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preço original (R$)</label>
                    <input className="form-input" type="number" step="0.01" min="0" value={editProduct.original_price || ''} onChange={(e) => setField('original_price', e.target.value ? parseFloat(e.target.value) : undefined)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dias de produção</label>
                    <input className="form-input" type="number" min="1" value={editProduct.production_days} onChange={(e) => setField('production_days', parseInt(e.target.value))} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Descrição curta</label>
                    <input className="form-input" value={editProduct.short_description || ''} onChange={(e) => setField('short_description', e.target.value)} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Descrição completa</label>
                    <textarea className="form-input" rows={4} value={editProduct.description || ''} onChange={(e) => setField('description', e.target.value)} style={{ resize: 'vertical' }} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">URL da imagem principal</label>
                    <input className="form-input" value={editProduct.image_url || ''} onChange={(e) => setField('image_url', e.target.value)} placeholder="/terrario_grande.png ou https://..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Imagem 2 (opcional)</label>
                    <input className="form-input" value={editProduct.image_url_2 || ''} onChange={(e) => setField('image_url_2', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Imagem 3 (opcional)</label>
                    <input className="form-input" value={editProduct.image_url_3 || ''} onChange={(e) => setField('image_url_3', e.target.value)} />
                  </div>
                  <div className="admin-checkboxes">
                    {[
                      { key: 'is_featured', label: '⭐ Destaque' },
                      { key: 'is_active', label: '✅ Ativo' },
                      { key: 'is_customizable', label: '✏️ Personalizável' },
                    ].map(({ key, label }) => (
                      <label key={key} className="admin-checkbox">
                        <input type="checkbox" checked={!!(editProduct as any)[key]} onChange={(e) => setField(key, e.target.checked)} />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="admin-form__actions">
                  <button type="submit" className="btn btn-primary">{editId ? 'Salvar alterações' : 'Criar produto'}</button>
                  <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
                </div>
              </form>
            )}

            {/* Tabela */}
            {loading ? <div className="admin-loading">Carregando...</div> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Status</th><th>Ações</th></tr></thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className={!p.is_active ? 'row-inactive' : ''}>
                        <td>
                          <div className="table-product">
                            {p.image_url && <img src={p.image_url} alt={p.name} className="table-thumb" />}
                            <div>
                              <strong>{p.name}</strong>
                              {p.is_featured && <span className="table-badge table-badge--gold">Destaque</span>}
                            </div>
                          </div>
                        </td>
                        <td>{p.category?.name || '—'}</td>
                        <td>
                          <div>R$ {p.price.toFixed(2)}</div>
                          {p.original_price && <small style={{ color: 'var(--text-400)', textDecoration: 'line-through' }}>R$ {p.original_price.toFixed(2)}</small>}
                        </td>
                        <td>
                          <span className={`table-badge ${p.is_active ? 'table-badge--green' : 'table-badge--gray'}`}>
                            {p.is_active ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="table-btn" onClick={() => openEdit(p)} title="Editar"><Pencil size={15} /></button>
                            <button className="table-btn table-btn--danger" onClick={() => deleteProduct(p.id)} title="Desativar"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── USUÁRIOS ── */}
        {tab === 'users' && (
          <div className="admin-section">
            <div className="admin-section__header"><h2>Usuários</h2></div>
            {loading ? <div className="admin-loading">Carregando...</div> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Usuário</th><th>Email</th><th>Membro desde</th><th>Status</th><th>Admin</th></tr></thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td><strong>@{u.username}</strong><br /><small style={{ color: 'var(--text-500)' }}>{u.full_name || '—'}</small></td>
                        <td>{u.email}</td>
                        <td>{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                        <td><span className={`table-badge ${u.is_active ? 'table-badge--green' : 'table-badge--gray'}`}>{u.is_active ? 'Ativo' : 'Inativo'}</span></td>
                        <td>
                          <button className={`table-btn ${u.is_admin ? 'table-btn--active' : ''}`} onClick={() => toggleAdmin(u)} title="Toggle admin">
                            {u.is_admin ? <Eye size={15} /> : <EyeOff size={15} />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
