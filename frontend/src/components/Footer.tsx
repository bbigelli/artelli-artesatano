import { Link } from 'react-router-dom';
import { Leaf, Instagram, MessageCircle, Heart } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <Leaf size={20} />
              <span>Artelli Artesanato</span>
            </div>
            <p>Cada peça carrega a dedicação de mãos que criam com amor. Sua decoração merece ser única.</p>
            <div className="footer__social">
              <a href="https://www.instagram.com/artelli.artesanato/" target="_blank" rel="noopener" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://wa.me/5511992216409" target="_blank" rel="noopener" aria-label="WhatsApp">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="footer__col">
            <h4>Navegação</h4>
            <Link to="/">Início</Link>
            <Link to="/produtos">Produtos</Link>
            <Link to="/sobre">Nossa História</Link>
            <Link to="/contato">Contato</Link>
          </div>

          <div className="footer__col">
            <h4>Categorias</h4>
            <Link to="/produtos?categoria=terrarios">Terrários</Link>
            <Link to="/produtos?categoria=oratorios">Oratórios</Link>
            <Link to="/produtos?categoria=decoracao">Decoração</Link>
            <Link to="/produtos?categoria=presentes">Kits Presente</Link>
          </div>

          <div className="footer__col">
            <h4>Informações</h4>
            <Link to="/login">Entrar</Link>
            <Link to="/cadastro">Criar conta</Link>
            <Link to="/carrinho">Meu carrinho</Link>
            <a href="https://wa.me/5511992216409" target="_blank" rel="noopener">Fazer encomenda</a>
          </div>
        </div>

        <hr className="divider" />

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Artelli Artesanato. Todos os direitos reservados.</p>
          <p className="footer__made">
            Feito com <Heart size={13} fill="currentColor" /> à mão e com amor
          </p>
        </div>
      </div>
    </footer>
  );
}
