import { Link } from 'react-router-dom';
import { Instagram, Heart } from 'lucide-react';
import './Footer.css';

const WA = import.meta.env.VITE_API_URL ? '' : '5511992216409';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <img src="/Logo.png" alt="Artelli" className="footer__logo" />
          <p className="footer__tagline">
            Peças únicas feitas à mão com amor.<br />Para quem coleciona o que é belo.
          </p>
          <div className="footer__socials">
            <a href="https://instagram.com/artelliartesanato" target="_blank" rel="noopener" aria-label="Instagram">
              <Instagram size={18} />
            </a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Catálogo</h4>
          <ul>
            <li><Link to="/products">Todos os produtos</Link></li>
            <li><Link to="/products?category=terrarios">Terrários</Link></li>
            <li><Link to="/products?category=oratorios">Oratórios</Link></li>
            <li><Link to="/products?category=decoracao">Decoração</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Informações</h4>
          <ul>
            <li><Link to="/about">Sobre nós</Link></li>
            <li><Link to="/about#contato">Contato</Link></li>
            <li><Link to="/auth">Minha conta</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Contato</h4>
          <ul>
            <li>
              <a href="https://wa.me/5511992216409" target="_blank" rel="noopener">
                WhatsApp
              </a>
            </li>
            <li><a href="mailto:contato@artelli.com.br">contato@artelli.com.br</a></li>
            <li>São Paulo, SP</li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>© {new Date().getFullYear()} Artelli Artesanato. Todos os direitos reservados.</span>
          <span className="footer__made">
            Feito com <Heart size={12} fill="currentColor" /> e amor artesanal
          </span>
        </div>
      </div>
    </footer>
  );
}
