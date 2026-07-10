import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Leaf } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import './Header.css';

export default function Header() {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setMenuOpen(false);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <Link to="/" className="header__logo" onClick={close}>
          <img src="/Logo.png" alt="Artelli Artesanato" className="header__logo-img" />
          <span className="header__logo-text">Artelli</span>
        </Link>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
          <NavLink to="/"         className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`} onClick={close}>Início</NavLink>
          <NavLink to="/products" className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`} onClick={close}>Catálogo</NavLink>
          <NavLink to="/about"    className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`} onClick={close}>Sobre</NavLink>
          {isAdmin && (
            <NavLink to="/admin"  className={({ isActive }) => `header__link header__link--admin ${isActive ? 'header__link--active' : ''}`} onClick={close}>
              <Leaf size={14} /> Admin
            </NavLink>
          )}
        </nav>

        <div className="header__actions">
          <button
            className="header__icon-btn"
            onClick={() => { navigate('/cart'); close(); }}
            aria-label="Carrinho"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && <span className="header__badge">{totalItems}</span>}
          </button>

          <button
            className="header__icon-btn"
            onClick={() => { navigate(isAuthenticated ? '/profile' : '/auth'); close(); }}
            aria-label="Conta"
          >
            <User size={20} />
            {isAuthenticated && <span className="header__user-dot" title={user?.username} />}
          </button>

          <button
            className="header__menu-btn"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && <div className="header__overlay" onClick={close} />}
    </header>
  );
}
