import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, MessageCircle, Clock, ArrowLeft, CheckCircle } from 'lucide-react';
import { productService } from '../api/products';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import './ProductDetail.css';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [customization, setCustomization] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    productService.getBySlug(slug)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="detail-loading"><div className="spinner" /></div>;
  if (!product) return (
    <div className="detail-not-found">
      <h2>Produto não encontrado</h2>
      <Link to="/products" className="btn btn-primary">Ver catálogo</Link>
    </div>
  );

  const images = [product.image_url, product.image_url_2, product.image_url_3].filter(Boolean) as string[];
  const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : null;

  function handleAdd() {
    addItem(product!, customization || undefined);
    toast.success('Adicionado ao carrinho! 🌿');
  }

  function handleWhatsApp() {
    const msg = encodeURIComponent(
      `Olá, Artelli! 🌿 Tenho interesse no produto:\n*${product!.name}*\nR$ ${product!.price.toFixed(2)}`
      + (customization ? `\n\nPersonalização desejada: ${customization}` : '')
    );
    window.open(`https://wa.me/5511992216409?text=${msg}`, '_blank');
  }

  return (
    <main className="product-detail">
      <div className="container">
        <Link to="/products" className="detail-back"><ArrowLeft size={16} /> Voltar ao catálogo</Link>

        <div className="detail-grid">
          {/* Galeria */}
          <div className="detail-gallery">
            <div className="detail-gallery__main">
              {images[activeImg]
                ? <img src={images[activeImg]} alt={product.name} />
                : <div className="detail-gallery__placeholder">🌿</div>
              }
              {discount && <span className="detail-discount">-{discount}%</span>}
            </div>
            {images.length > 1 && (
              <div className="detail-gallery__thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`detail-thumb ${i === activeImg ? 'detail-thumb--active' : ''}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info">
            {product.category && <span className="detail-category">{product.category.name}</span>}
            <h1 className="detail-name">{product.name}</h1>

            <div className="detail-pricing">
              {product.original_price && (
                <span className="detail-original">R$ {product.original_price.toFixed(2)}</span>
              )}
              <span className="detail-price">R$ {product.price.toFixed(2)}</span>
            </div>

            {product.short_description && (
              <p className="detail-short-desc">{product.short_description}</p>
            )}

            <div className="detail-badges">
              <span className="detail-badge"><Clock size={13} /> {product.production_days} dias úteis</span>
              {product.is_customizable && <span className="detail-badge detail-badge--sand">✏️ Personalizável</span>}
              <span className="detail-badge"><CheckCircle size={13} /> Feito à mão</span>
            </div>

            {product.is_customizable && (
              <div className="detail-custom">
                <label className="detail-custom__label">Personalização (opcional)</label>
                <textarea
                  className="detail-custom__input"
                  placeholder="Descreva a personalização que você deseja..."
                  value={customization}
                  onChange={(e) => setCustomization(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            <div className="detail-actions">
              <button className="btn btn-primary" onClick={handleAdd}>
                <ShoppingCart size={17} /> Adicionar ao carrinho
              </button>
              <button className="btn btn-outline" onClick={handleWhatsApp}>
                <MessageCircle size={17} /> Pedir pelo WhatsApp
              </button>
            </div>

            {product.description && (
              <div className="detail-description">
                <h3>Sobre esta peça</h3>
                <p>{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
