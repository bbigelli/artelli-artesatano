import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, Sparkles } from 'lucide-react';
import { ProductList } from '../types';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import './ProductCard.css';

interface Props {
  product: ProductList;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} adicionado ao carrinho!`, {
      icon: '🌿',
      style: { fontFamily: 'var(--font-body)', fontSize: '0.88rem' },
    });
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  return (
    <Link to={`/produtos/${product.slug}`} className="product-card">
      <div className="product-card__img-wrap">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600'}
          alt={product.name}
          loading="lazy"
        />
        {product.is_featured && (
          <span className="product-card__featured">
            <Sparkles size={11} /> Destaque
          </span>
        )}
        {discount && <span className="product-card__discount">−{discount}%</span>}
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
            <span className="product-card__tag">Personalizável</span>
          )}
          <span className="product-card__tag">
            <Clock size={11} /> {product.production_days} dias
          </span>
        </div>

        <div className="product-card__footer">
          <div className="product-card__price">
            {product.original_price && (
              <span className="product-card__original">
                R$ {product.original_price.toFixed(2).replace('.', ',')}
              </span>
            )}
            <span className="product-card__current">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <button className="product-card__btn" onClick={handleAdd}>
            <ShoppingBag size={15} />
          </button>
        </div>
      </div>
    </Link>
  );
}
