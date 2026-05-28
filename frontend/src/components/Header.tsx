import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, LogOut, Settings} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import './Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setDropdownOpen(false);
    navigate('/');
  }

  return (
    <header className="header">
      <div className="container header__inner">
        {/* Logo */}
        <Link to="/" className="header__logo">
          <img src="/Logo.png" alt="Artelli Artesanatos" className="header__logo-img" />
          <span className="header__logo-text">Artelli Artesanatos</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="header__nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'header__link active' : 'header__link'}>Início</NavLink>
          <NavLink to="/produtos" className={({ isActive }) => isActive ? 'header__link active' : 'header__link'}>Produtos</NavLink>
          <NavLink to="/sobre" className={({ isActive }) => isActive ? 'header__link active' : 'header__link'}>Nossa História</NavLink>
          <NavLink to="/contato" className={({ isActive }) => isActive ? 'header__link active' : 'header__link'}>Contato</NavLink>
        </nav>

        {/* Actions */}
        <div className="header__actions">
          {/* Cart */}
          <Link to="/carrinho" className="header__icon-btn">
            <ShoppingBag size={20} />
            {totalItems > 0 && <span className="header__cart-badge">{totalItems}</span>}
          </Link>

          {/* User dropdown */}
          {isAuthenticated ? (
            <div className="header__dropdown">
              <button
                className="header__icon-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <User size={20} />
              </button>
              {dropdownOpen && (
                <div className="header__dropdown-menu">
                  <div className="header__dropdown-user">
                    <span>{user?.name || user?.username}</span>
                    <small>{user?.email}</small>
                  </div>
                  <hr className="divider" />
                  <Link to="/perfil" className="header__dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <User size={15} /> Meu Perfil
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="header__dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <Settings size={15} /> Painel Admin
                    </Link>
                  )}
                  <button className="header__dropdown-item danger" onClick={handleLogout}>
                    <LogOut size={15} /> Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="header__auth-links">
              <Link to="/login" className="header__link">Entrar</Link>
              <Link to="/cadastro" className="btn btn-primary btn-sm">Cadastrar</Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button className="header__mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="header__mobile-menu">
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>Início</NavLink>
          <NavLink to="/produtos" onClick={() => setMenuOpen(false)}>Produtos</NavLink>
          <NavLink to="/sobre" onClick={() => setMenuOpen(false)}>Nossa História</NavLink>
          <NavLink to="/contato" onClick={() => setMenuOpen(false)}>Contato</NavLink>
          <NavLink to="/carrinho" onClick={() => setMenuOpen(false)}>Carrinho ({totalItems})</NavLink>
          {!isAuthenticated && (
            <>
              <NavLink to="/login" onClick={() => setMenuOpen(false)}>Entrar</NavLink>
              <NavLink to="/cadastro" onClick={() => setMenuOpen(false)}>Cadastrar</NavLink>
            </>
          )}
          {isAuthenticated && (
            <>
              <NavLink to="/perfil" onClick={() => setMenuOpen(false)}>Meu Perfil</NavLink>
              {isAdmin && <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</NavLink>}
              <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Sair</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
