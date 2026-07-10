import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Heart, MessageCircle } from 'lucide-react';
import { productService } from '../api/products';
import { ProductList } from '../types';
import ProductCard from '../components/ProductCard';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState<ProductList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.featured()
      .then(setFeatured)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="home">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <p className="hero__eyebrow">Artesanato de Colecionador</p>
            <h1 className="hero__title">
              Cada peça conta<br />
              <em>a sua história.</em>
            </h1>
            <p className="hero__subtitle">
              Terrários, oratórios e decorações únicas, criados à mão com materiais selecionados.
              Peças que transformam espaços em ambientes com alma e identidade.
            </p>
            <div className="hero__actions">
              <Link to="/products" className="btn btn-primary">
                Ver catálogo <ArrowRight size={16} />
              </Link>
              <a
                href="https://wa.me/5511992216409?text=Olá%2C+Artelli!+Gostaria+de+conhecer+as+peças."
                target="_blank" rel="noopener"
                className="btn btn-outline"
              >
                <MessageCircle size={16} /> Falar no WhatsApp
              </a>
            </div>
          </div>
          <div className="hero__visual">
            <img src="/terrario_grande.png" alt="Terrário Artelli" className="hero__img" />
            <div className="hero__badge">
              <Leaf size={16} />
              <span>Feito à mão com amor</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAIS ── */}
      <section className="section differentials">
        <div className="container">
          <div className="differentials__grid">
            {[
              { icon: '✦', title: 'Exclusividade Real', desc: 'Nenhuma peça é idêntica. Você recebe algo que não existia antes.' },
              { icon: '🤝', title: 'Feito com Amor', desc: 'Cada detalhe é tocado por mãos apaixonadas. Isso aparece no resultado.' },
              { icon: '💬', title: 'Atendimento Direto', desc: 'Você fala com quem cria. Sem intermediários — só atenção real.' },
              { icon: '🎁', title: 'Presente Memorável', desc: 'Uma peça personalizada que ninguém joga fora. Dura e encanta.' },
            ].map((d) => (
              <div className="differential-item" key={d.title}>
                <span className="differential-icon">{d.icon}</span>
                <h3>{d.title}</h3>
                <p>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUTOS DESTAQUE ── */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <div>
              <p className="section__eyebrow">Nossas criações</p>
              <h2 className="section__title">Peças em <em>destaque</em></h2>
            </div>
            <Link to="/products" className="btn btn-outline">
              Ver tudo <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="products-skeleton">
              {Array(4).fill(0).map((_, i) => <div className="skeleton-card" key={i} />)}
            </div>
          ) : (
            <div className="products-grid">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA WHATSAPP ── */}
      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <div>
            <h2>Quer algo <em>único para você?</em></h2>
            <p>Encomende sua peça personalizada diretamente pelo WhatsApp. Rápido, simples e sem burocracia.</p>
          </div>
          <a
            href="https://wa.me/5511992216409?text=Olá%2C+Artelli!+Gostaria+de+fazer+uma+encomenda+personalizada."
            target="_blank" rel="noopener"
            className="btn btn-sand"
          >
            <MessageCircle size={18} /> Encomendar agora
          </a>
        </div>
      </section>
    </main>
  );
}
