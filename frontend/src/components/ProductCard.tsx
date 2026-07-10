import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Clock } from 'lucide-react';
import { ProductList } from '../types';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import './ProductCard.css';

interface Props { product: ProductList; }

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} adicionado ao carrinho!`, { icon: '🌿' });
  }

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null;

  return (
    <Link to={`/products/${product.slug}`} className="product-card">
      <div className="product-card__img-wrapper">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="product-card__img" loading="lazy" />
        ) : (
          <div className="product-card__img-placeholder">🌿</div>
        )}
        {discount && discount > 0 && (
          <span className="product-card__discount">-{discount}%</span>
        )}
        {product.is_featured && (
          <span className="product-card__featured"><Star size={11} fill="currentColor" /> Destaque</span>
        )}
      </div>

      <div className="product-card__body">
        {product.category && (
          <span className="product-card__category">{product.category.name}</span>
        )}
        <h3 className="product-card__name">{product.name}</h3>
        {product.short_description && (
          <p className="product-card__desc">{product.short_description}</p>
        )}
        <div className="product-card__meta">
          {product.is_customizable && (
            <span className="product-card__tag">✏️ Personalizável</span>
          )}
          <span className="product-card__tag">
            <Clock size={11} /> {product.production_days}d
          </span>
        </div>
        <div className="product-card__footer">
          <div className="product-card__pricing">
            {product.original_price && (
              <span className="product-card__original">R$ {product.original_price.toFixed(2)}</span>
            )}
            <span className="product-card__price">R$ {product.price.toFixed(2)}</span>
          </div>
          <button className="product-card__cart-btn" onClick={handleAdd} aria-label="Adicionar ao carrinho">
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
