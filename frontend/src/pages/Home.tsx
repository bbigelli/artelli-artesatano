import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Heart, Package, Star, CheckCircle, ChevronDown } from 'lucide-react';
import { productService } from '../api/products';
import { ProductList } from '../types';
import ProductCard from '../components/ProductCard';
import './Home.css';

const faqs = [
  {
    q: 'Como funciona o processo de encomenda?',
    a: 'É simples: escolha os produtos que te encantaram, adicione ao carrinho e clique em "Finalizar via WhatsApp". Você será direcionado para nossa conversa com todos os detalhes do pedido já formatados.',
  },
  {
    q: 'Posso personalizar cores, tamanhos ou incluir dedicatórias?',
    a: 'Sim! A personalização é o coração do que fazemos. No WhatsApp, conte exatamente o que imagina — cores, plantas preferidas, mensagem especial — e criamos algo único para você.',
  },
  {
    q: 'Qual o prazo de produção?',
    a: 'Cada produto tem seu prazo indicado na página, geralmente entre 5 e 10 dias úteis. Peças muito personalizadas podem levar um pouco mais — sempre confirmamos antes de iniciar.',
  },
  {
    q: 'Vocês fazem entrega? Para todo o Brasil?',
    a: 'Sim! Enviamos pelos Correios e transportadoras parceiras para todo o Brasil. O frete é calculado após confirmação do endereço no WhatsApp.',
  },
  {
    q: 'Os terrários precisam de muita manutenção?',
    a: 'Terrários fechados são praticamente autossuficientes. Os abertos pedem regas esporádicas. Enviamos um guia de cuidados com cada peça para que você aproveite sem preocupações.',
  },
];

export default function Home() {
  const [featured, setFeatured] = useState<ProductList[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    productService.featured().then(setFeatured).finally(() => setLoading(false));
  }, []);

  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__blob hero__blob--1" />
          <div className="hero__blob hero__blob--2" />
        </div>
        <div className="container hero__inner">
          <div className="hero__content fade-up">
            <span className="section-label">Artesanato Premium · Feito à Mão</span>
            <h1 className="hero__headline">
              Decoração que conta<br />
              <em>a sua história.</em>
            </h1>
            <p className="hero__sub">
              Terrários, oratórios e peças únicas criadas com dedicação artesanal.
              Cada encomenda é tratada como uma obra de arte — porque para nós, é.
            </p>
            <div className="hero__ctas">
              <Link to="/produtos" className="btn btn-primary btn-lg">
                Explorar peças <ArrowRight size={18} />
              </Link>
              <a href="whatsapp://send?phone=5511992216409" target="_blank" rel="noopener" className="btn btn-outline btn-lg">
                Fazer encomenda
              </a>
            </div>
            <div className="hero__trust">
              <span><CheckCircle size={15} /> Feito à mão</span>
              <span><CheckCircle size={15} /> 100% personalizado</span>
              <span><CheckCircle size={15} /> Entrega para todo Brasil</span>
            </div>
          </div>
          <div className="hero__visual fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="hero__img-frame">
              <img
                src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=700"
                alt="Terrário Artelli - decoração artesanal"
              />
              <div className="hero__img-badge">
                <Leaf size={16} />
                <span>Feito com amor</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="trust-strip">
        <div className="container trust-strip__inner">
          <div className="trust-strip__item">
            <span className="trust-strip__number">200+</span>
            <span className="trust-strip__label">Peças entregues</span>
          </div>
          <div className="trust-strip__divider" />
          <div className="trust-strip__item">
            <span className="trust-strip__number">98%</span>
            <span className="trust-strip__label">Clientes satisfeitos</span>
          </div>
          <div className="trust-strip__divider" />
          <div className="trust-strip__item">
            <span className="trust-strip__number">5★</span>
            <span className="trust-strip__label">Avaliação média</span>
          </div>
          <div className="trust-strip__divider" />
          <div className="trust-strip__item">
            <span className="trust-strip__number">100%</span>
            <span className="trust-strip__label">Artesanal</span>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-label">Peças em destaque</span>
              <h2 className="section-title">Criações que encantam</h2>
            </div>
            <Link to="/produtos" className="btn btn-outline">
              Ver todos <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : (
            <div className="products-grid">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* About / Story */}
      <section className="about-section">
        <div className="container about-section__inner">
          <div className="about-section__img-col">
            <div className="about-section__img-stack">
              <img
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500"
                alt="Processo artesanal"
                className="about-section__img about-section__img--main"
              />
              <img
                src="https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=300"
                alt="Detalhe artesanato"
                className="about-section__img about-section__img--accent"
              />
            </div>
          </div>
          <div className="about-section__content">
            <span className="section-label">Nossa história</span>
            <h2>Artesanato nascido <em>da paixão.</em></h2>
            <p>
              A Artelli nasceu da vontade de transformar espaços com beleza feita por mãos humanas.
              Cada terrário plantado, cada oratório entalhado, cada peça criada carrega a intenção
              de quem ama o que faz.
            </p>
            <p>
              Não trabalhamos com estoque pronto. Trabalhamos com a sua ideia — e a transformamos
              em algo que vai ter lugar especial na sua casa.
            </p>
            <div className="about-section__values">
              <div className="about-section__value">
                <Heart size={20} className="about-section__value-icon" />
                <div>
                  <strong>Feito com amor</strong>
                  <span>Cada peça recebe atenção individual do início ao acabamento</span>
                </div>
              </div>
              <div className="about-section__value">
                <Leaf size={20} className="about-section__value-icon" />
                <div>
                  <strong>Materiais naturais</strong>
                  <span>Madeiras, plantas e pedras selecionadas com critério</span>
                </div>
              </div>
              <div className="about-section__value">
                <Package size={20} className="about-section__value-icon" />
                <div>
                  <strong>Embalagem especial</strong>
                  <span>Cada entrega é cuidadosamente embalada para proteger e surpreender</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section benefits-section">
        <div className="container">
          <div className="section-header centered">
            <span className="section-label">Por que Artelli</span>
            <h2 className="section-title">O que torna cada peça especial</h2>
          </div>
          <div className="benefits-grid">
            {[
              { icon: '🌿', title: 'Personalização real', desc: 'Não há dois iguais. Sua peça é criada do zero com base no que você imagina.' },
              { icon: '🤝', title: 'Atendimento próximo', desc: 'Conversamos pelo WhatsApp do início ao fim. Você acompanha cada etapa da criação.' },
              { icon: '📦', title: 'Envio seguro', desc: 'Embalagem reforçada e rastreamento em tempo real. Sua encomenda chega íntegra.' },
              { icon: '💚', title: 'Sustentável', desc: 'Priorizamos materiais naturais, biodegradáveis e de procedência responsável.' },
              { icon: '⏱️', title: 'Prazos claros', desc: 'Informamos o prazo de produção antes de iniciar. Sem surpresas desagradáveis.' },
              { icon: '🎁', title: 'Perfeito para presentes', desc: 'Adicione dedicatória personalizada e embalagem de presente sem custo extra.' },
            ].map((b) => (
              <div key={b.title} className="benefit-card">
                <span className="benefit-card__icon">{b.icon}</span>
                <h4>{b.title}</h4>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header centered">
            <span className="section-label">Depoimentos</span>
            <h2 className="section-title">Quem já tem Artelli em casa</h2>
          </div>
          <div className="testimonials-grid">
            {[
              { name: 'Mariana S.', city: 'São Paulo, SP', rating: 5, text: 'Encomendei um terrário personalizado e superou todas as expectativas. A atenção aos detalhes é impressionante. Já indiquei para cinco amigas!' },
              { name: 'Lucas R.', city: 'Curitiba, PR', rating: 5, text: 'Comprei um oratório para minha mãe de aniversário. Ela ficou emocionada. A qualidade da madeira e o acabamento são dignos de loja de luxo.' },
              { name: 'Camila F.', city: 'Rio de Janeiro, RJ', rating: 5, text: 'O kit presente foi um sucesso absoluto! Embalagem linda, terrário perfeito, e a dedicatória escrita à mão foi o toque que emocionou quem recebeu.' },
            ].map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="testimonial-card__stars">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="testimonial-card__text">"{t.text}"</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <div>
            <h2>Sua encomenda começa<br /><em>com uma mensagem.</em></h2>
            <p>Descreva o que você imagina. Nós transformamos em realidade.</p>
          </div>
          <a
            href="whatsapp://send?phone=5511992216409&text=Olá,%20Artelli!%20Gostaria%20de%20fazer%20uma%20encomenda%20personalizada."
            target="_blank"
            rel="noopener"
            className="btn btn-sand btn-lg"
          >
            Conversar no WhatsApp <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container faq-container">
          <div className="section-header centered">
            <span className="section-label">Dúvidas frequentes</span>
            <h2 className="section-title">Tudo que você precisa saber</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                <button className="faq-item__q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <ChevronDown size={18} className="faq-item__chevron" />
                </button>
                {openFaq === i && <p className="faq-item__a">{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
