import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { productService } from '../api/products';
import { ProductList, Category } from '../types';
import ProductCard from '../components/ProductCard';
import './Products.css';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductList[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const selectedCat = searchParams.get('categoria') || '';

  useEffect(() => {
    productService.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const catId = categories.find((c) => c.slug === selectedCat)?.id;
    productService
      .list({ category_id: catId, search: search || undefined })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [selectedCat, search, categories]);

  function setCategory(slug: string) {
    const params = new URLSearchParams(searchParams);
    if (slug) params.set('categoria', slug);
    else params.delete('categoria');
    setSearchParams(params);
  }

  return (
    <main className="products-page">
      <div className="container">
        <div className="products-page__header">
          <div>
            <span className="section-label">Catálogo</span>
            <h1>Nossas peças</h1>
            <p>{products.length} peça{products.length !== 1 ? 's' : ''} encontrada{products.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="products-page__layout">
          {/* Sidebar filters */}
          <aside className="products-page__sidebar">
            <div className="filter-section">
              <h4><SlidersHorizontal size={15} /> Filtros</h4>
              <div className="form-group">
                <label className="form-label">Buscar</label>
                <div className="search-input-wrap">
                  <Search size={16} className="search-input-icon" />
                  <input
                    className="form-input"
                    style={{ paddingLeft: 36 }}
                    placeholder="Nome do produto..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Categoria</label>
                <div className="category-filters">
                  <button
                    className={`category-btn ${!selectedCat ? 'active' : ''}`}
                    onClick={() => setCategory('')}
                  >
                    Todas
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      className={`category-btn ${selectedCat === c.slug ? 'active' : ''}`}
                      onClick={() => setCategory(c.slug)}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="products-page__content">
            {loading ? (
              <div className="spinner" />
            ) : products.length === 0 ? (
              <div className="empty-state">
                <p>Nenhuma peça encontrada com esses filtros.</p>
                <button className="btn btn-outline" onClick={() => { setSearch(''); setCategory(''); }}>
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
