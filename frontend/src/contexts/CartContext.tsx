import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, ProductList } from '../types';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: ProductList, customization?: string) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  clearCart: () => void;
  checkoutWhatsApp: (whatsappNumber: string) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('artelli_cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('artelli_cart', JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);

  function addItem(product: ProductList, customization?: string) {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1, customization: customization ?? i.customization }
            : i
        );
      }
      return [...prev, { product, quantity: 1, customization }];
    });
  }

  function removeItem(productId: number) {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }

  function updateQuantity(productId: number, qty: number) {
    if (qty <= 0) return removeItem(productId);
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
    );
  }

  function clearCart() {
    setItems([]);
  }

  function checkoutWhatsApp(whatsappNumber: string) {
    const lines = items.map((i) => {
      const customNote = i.customization ? `\n   ✏️ Personalização: ${i.customization}` : '';
      return `• ${i.product.name} × ${i.quantity} — R$ ${(i.product.price * i.quantity).toFixed(2)}${customNote}`;
    });

    const total = `\n*Total estimado: R$ ${totalPrice.toFixed(2)}*`;
    const message = encodeURIComponent(
      `Olá, Artelli! 🌿 Gostaria de fazer um pedido:\n\n${lines.join('\n')}${total}\n\nAguardo a confirmação e prazo de entrega. 😊`
    );

    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  }

  return (
    <CartContext.Provider
      value={{ items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart, checkoutWhatsApp }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
