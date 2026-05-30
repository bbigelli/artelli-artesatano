import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Clock, Sparkles, ArrowLeft, MessageCircle } from 'lucide-react';
import { productService } from '../api/products';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import './ProductDetail.css';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [customization, setCustomization] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    if (!slug) return;
    productService.getBySlug(slug).then(setProduct).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="spinner" />;
  if (!product) return (
    <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
      <h2>Produto não encontrado</h2>
      <Link to="/produtos" className="btn btn-outline" style={{ marginTop: 16 }}>
        <ArrowLeft size={16} /> Voltar ao catálogo
      </Link>
    </div>
  );

  const images = [product.image_url, product.image_url_2, product.image_url_3].filter(Boolean) as string[];
  const activeImage = images[activeImg] || '/Logo.png';

  function handleAddToCart() {
    addItem(
      {
        id: product!.id,
        name: product!.name,
        slug: product!.slug,
        short_description: product!.short_description,
        price: product!.price,
        original_price: product!.original_price,
        image_url: product!.image_url,
        is_featured: product!.is_featured,
        is_active: product!.is_active,
        is_customizable: product!.is_customizable,
        production_days: product!.production_days,
        category: product!.category,
      },
      customization || undefined
    );
    toast.success('Adicionado ao carrinho!', { icon: '🌿' });
  }

  const waMessage = encodeURIComponent(
    `Olá, Artelli! 🌿 Tenho interesse no produto:\n\n*${product.name}*\nPreço: R$ ${product.price.toFixed(2)}\n${customization ? `\nPersonalização: ${customization}` : ''}\n\nPoderia me dar mais informações?`
  );

  return (
    <main className="product-detail">
      <div className="container">
        <Link to="/produtos" className="product-detail__back">
          <ArrowLeft size={16} /> Voltar ao catálogo
        </Link>

        <div className="product-detail__layout">
          {/* Gallery */}
          <div className="product-detail__gallery">
            <div className="product-detail__main-img">
              <img src={activeImage} alt={product.name} onError={(e) => { (e.target as HTMLImageElement).src = '/Logo.png'; }} />
              {product.is_featured && (
                <span className="product-card__featured">
                  <Sparkles size={11} /> Destaque
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="product-detail__thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`product-detail__thumb ${i === activeImg ? 'active' : ''}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt={`Imagem ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail__info">
            {product.category && (
              <span className="product-detail__cat">{product.category.name}</span>
            )}
            <h1 className="product-detail__name">{product.name}</h1>

            <div className="product-detail__price">
              {product.original_price && (
                <span className="product-detail__original">
                  R$ {product.original_price.toFixed(2).replace('.', ',')}
                </span>
              )}
              <span className="product-detail__current">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {product.description && (
              <p className="product-detail__desc">{product.description}</p>
            )}

            <div className="product-detail__tags">
              <span className="tag">
                <Clock size={12} /> {product.production_days} dias de produção
              </span>
              {product.is_customizable && (
                <span className="tag">✏️ Personalizável</span>
              )}
              <span className="tag">📦 Entrega para todo Brasil</span>
            </div>

            {product.is_customizable && (
              <div className="form-group">
                <label className="form-label">Personalização (opcional)</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: 100, resize: 'vertical' }}
                  placeholder="Ex: Cores preferidas, plantas desejadas, mensagem especial, tamanho..."
                  value={customization}
                  onChange={(e) => setCustomization(e.target.value)}
                />
              </div>
            )}

            <div className="product-detail__actions">
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart} style={{ flex: 1 }}>
                <ShoppingBag size={18} /> Adicionar ao carrinho
              </button>
              <a
                href={`whatsapp://send?phone=5511992216409&text=${waMessage}`}
                target="_blank"
                rel="noopener"
                className="btn btn-outline btn-lg"
              >
                <MessageCircle size={18} /> WhatsApp
              </a>
            </div>

            <div className="product-detail__guarantee">
              <span>🌿 Peça artesanal feita exclusivamente para você</span>
              <span>💚 Materiais naturais e sustentáveis</span>
              <span>🎁 Embalagem especial incluída</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
