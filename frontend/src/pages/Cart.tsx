import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, MessageCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import './Cart.css';

export default function Cart() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart, checkoutWhatsApp } = useCart();
  const [whatsapp, setWhatsapp] = useState('5511999999999');

  useEffect(() => {
    fetch('/api/config/whatsapp')
      .then((r) => r.json())
      .then((d) => setWhatsapp(d.number))
      .catch(() => {});
  }, []);

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <div className="container cart-empty">
          <ShoppingBag size={56} className="cart-empty__icon" />
          <h2>Seu carrinho está vazio</h2>
          <p>Explore nossas peças únicas e adicione o que encantar você.</p>
          <Link to="/produtos" className="btn btn-primary btn-lg">
            <ArrowLeft size={18} /> Explorar produtos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="container">
        <div className="cart-page__header">
          <h1>Meu carrinho</h1>
          <button className="btn btn-outline btn-sm" onClick={clearCart}>
            <Trash2 size={14} /> Limpar tudo
          </button>
        </div>

        <div className="cart-page__layout">
          {/* Items */}
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.product.id} className="cart-item">
                <div className="cart-item__img">
                  <img
                    src={item.product.image_url || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200'}
                    alt={item.product.name}
                  />
                </div>
                <div className="cart-item__info">
                  <span className="cart-item__category">{item.product.category?.name}</span>
                  <h3 className="cart-item__name">{item.product.name}</h3>
                  {item.customization && (
                    <p className="cart-item__custom">✏️ {item.customization}</p>
                  )}
                  <span className="cart-item__price">
                    R$ {item.product.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="cart-item__controls">
                  <div className="cart-item__qty">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="cart-item__subtotal">
                    R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                  <button className="cart-item__remove" onClick={() => removeItem(item.product.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3>Resumo do pedido</h3>
            <div className="cart-summary__row">
              <span>{totalItems} ite{totalItems !== 1 ? 'ns' : 'm'}</span>
              <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="cart-summary__row">
              <span>Frete</span>
              <span className="cart-summary__shipping">A combinar</span>
            </div>
            <hr className="divider" />
            <div className="cart-summary__total">
              <span>Estimativa</span>
              <strong>R$ {totalPrice.toFixed(2).replace('.', ',')}</strong>
            </div>
            <button className="btn btn-primary btn-lg cart-summary__checkout" onClick={() => checkoutWhatsApp(whatsapp)}>
              <MessageCircle size={18} /> Finalizar via WhatsApp
            </button>
            <p className="cart-summary__note">
              Você será redirecionado ao WhatsApp com todos os detalhes do pedido já formatados.
            </p>
            <Link to="/produtos" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              <ArrowLeft size={16} /> Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
