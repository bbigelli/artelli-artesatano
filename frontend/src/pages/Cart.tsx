import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import api from '../api/client';
import { useEffect, useState } from 'react';
import './Cart.css';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, checkoutWhatsApp } = useCart();
  const [waNumber, setWaNumber] = useState('5511999999999');

  useEffect(() => {
    api.get<{ number: string }>('/config/whatsapp')
      .then((r) => setWaNumber(r.data.number))
      .catch(() => {});
  }, []);

  if (items.length === 0) return (
    <main className="cart-empty">
      <ShoppingBag size={64} strokeWidth={1} />
      <h2>Seu carrinho está vazio</h2>
      <p>Explore nossas peças e encontre algo especial.</p>
      <Link to="/products" className="btn btn-primary">Ver catálogo</Link>
    </main>
  );

  return (
    <main className="cart-page">
      <div className="container">
        <h1 className="cart-title">Seu <em>carrinho</em></h1>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map(({ product, quantity, customization }) => (
              <div className="cart-item" key={product.id}>
                <div className="cart-item__img">
                  {product.image_url
                    ? <img src={product.image_url} alt={product.name} />
                    : <span>🌿</span>
                  }
                </div>
                <div className="cart-item__info">
                  <h3>{product.name}</h3>
                  {product.category && <span className="cart-item__cat">{product.category.name}</span>}
                  {customization && <p className="cart-item__custom">✏️ {customization}</p>}
                  <div className="cart-item__qty">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)}><Minus size={14} /></button>
                    <span>{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)}><Plus size={14} /></button>
                  </div>
                </div>
                <div className="cart-item__right">
                  <span className="cart-item__price">R$ {(product.price * quantity).toFixed(2)}</span>
                  <button className="cart-item__remove" onClick={() => removeItem(product.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Resumo</h3>
            <div className="cart-summary__row">
              <span>{items.reduce((a, i) => a + i.quantity, 0)} itens</span>
              <span>R$ {totalPrice.toFixed(2)}</span>
            </div>
            <div className="cart-summary__note">
              🌿 O preço final é confirmado via WhatsApp com prazo e frete.
            </div>
            <button className="btn btn-sand cart-summary__cta" onClick={() => checkoutWhatsApp(waNumber)}>
              <MessageCircle size={18} /> Finalizar pelo WhatsApp
            </button>
            <button className="cart-clear" onClick={clearCart}>Limpar carrinho</button>
          </div>
        </div>
      </div>
    </main>
  );
}
