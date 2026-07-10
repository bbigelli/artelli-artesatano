import { useEffect, useState } from 'react';
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

  const categorySlug = searchParams.get('category') || '';
  const selectedCat = categories.find((c) => c.slug === categorySlug);

  useEffect(() => {
    productService.categories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    productService
      .list({ category_id: selectedCat?.id, search: search || undefined })
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categorySlug, selectedCat?.id, search]);

  return (
    <main className="products-page">
      <div className="products-page__hero">
        <div className="container">
          <p className="section__eyebrow">Catálogo</p>
          <h1 className="products-page__title">Nossas <em>criações</em></h1>
          <p className="products-page__sub">Peças feitas à mão, com amor e atenção a cada detalhe.</p>
        </div>
      </div>

      <div className="container products-page__content">
        {/* Filtros */}
        <aside className="products-filters">
          <div className="filter-search">
            <Search size={16} />
            <input
              type="text" placeholder="Buscar peças..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-section">
            <h4><SlidersHorizontal size={14} /> Categoria</h4>
            <button
              className={`filter-btn ${!categorySlug ? 'filter-btn--active' : ''}`}
              onClick={() => setSearchParams({})}
            >
              Todas
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                className={`filter-btn ${categorySlug === c.slug ? 'filter-btn--active' : ''}`}
                onClick={() => setSearchParams({ category: c.slug })}
              >
                {c.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Grid */}
        <div className="products-results">
          <p className="products-count">
            {loading ? 'Carregando...' : `${products.length} peça${products.length !== 1 ? 's' : ''} encontrada${products.length !== 1 ? 's' : ''}`}
          </p>
          {loading ? (
            <div className="products-grid">
              {Array(6).fill(0).map((_, i) => <div className="skeleton-card" key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="products-empty">
              <span>🌿</span>
              <h3>Nenhuma peça encontrada</h3>
              <p>Tente outro filtro ou busca.</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
