import { MessageCircle, MapPin, Clock, Heart, Leaf, Award } from 'lucide-react';
import './AboutContact.css';

export function About() {
  return (
    <main className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="container about-hero__inner">
          <div>
            <span className="section-label">Nossa história</span>
            <h1>Feito à mão,<br /><em>com propósito.</em></h1>
            <p>
              A Artelli nasceu de um sonho simples: criar peças que transformem ambientes
              e toquem as pessoas. Não por serem bonitas — mas por serem únicas,
              intencionais e feitas com cuidado real.
            </p>
          </div>
          <div className="about-hero__img">
            <img src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600" alt="Artesanato Artelli" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <div className="section-header centered">
            <span className="section-label">Nossos valores</span>
            <h2 className="section-title">O que guia cada peça que criamos</h2>
          </div>
          <div className="about-values">
            {[
              { icon: <Heart size={28} />, title: 'Amor pelo ofício', desc: 'Cada entalhe, cada planta é feito com atenção e intenção. Não produzimos em escala — produzimos com alma.' },
              { icon: <Leaf size={28} />, title: 'Respeito à natureza', desc: 'Usamos madeiras de reflorestamento, plantas nativas e materiais naturais. Beleza que não cobra da terra mais do que ela pode dar.' },
              { icon: <Award size={28} />, title: 'Excelência artesanal', desc: 'Cada peça passa por inspeção cuidadosa antes de ser embalada. Se não está no nosso padrão, não sai daqui.' },
            ].map((v) => (
              <div key={v.title} className="about-value-card">
                <div className="about-value-card__icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section" style={{ background: 'var(--cream-200)', padding: '80px 0' }}>
        <div className="container">
          <div className="section-header centered">
            <span className="section-label">Trajetória</span>
            <h2 className="section-title">Do primeiro terrário até hoje</h2>
          </div>
          <div className="timeline">
            {[
              { year: '2019', title: 'O primeiro terrário', desc: 'Tudo começou com um pote de vidro, um punhado de terra e uma suculenta. O resultado encantou quem viu — e não parou mais.' },
              { year: '2021', title: 'Primeiras encomendas', desc: 'Amigos, depois amigos de amigos. A palavra foi passando e as encomendas chegando. Cada pedido, uma nova história.' },
              { year: '2023', title: 'Expansão do catálogo', desc: 'Terrários, oratórios, vasos de cimento... A Artelli cresceu respeitando sua essência: feito à mão, com amor.' },
              { year: '2026', title: 'Para todo o Brasil', desc: 'Hoje as peças Artelli chegam a todos os estados. A mesma qualidade, a mesma atenção, independente de onde você esteja.' },
            ].map((t, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-item__year">{t.year}</div>
                <div className="timeline-item__content">
                  <h4>{t.title}</h4>
                  <p>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function Contact() {
  return (
    <main className="contact-page">
      <div className="container">
        <div className="contact-header">
          <span className="section-label">Fale conosco</span>
          <h1>Vamos conversar?</h1>
          <p>O WhatsApp é nossa principal forma de comunicação. Respondemos rapidinho.</p>
        </div>

        <div className="contact-layout">
          <div className="contact-info">
            <div className="contact-info-card">
              <div className="contact-info-item">
                <MessageCircle size={22} className="contact-info-icon" />
                <div>
                  <strong>WhatsApp</strong>
                  <span>Seg–Sex, 9h às 18h</span>
                  <a
                    href="https://wa.me/5511992216409?text=Olá,%20Artelli!%20Gostaria%20de%20saber%20mais%20sobre%20as%20peças."
                    target="_blank"
                    rel="noopener"
                    className="btn btn-primary"
                    style={{ marginTop: 12 }}
                  >
                    <MessageCircle size={16} /> Iniciar conversa
                  </a>
                </div>
              </div>
              <hr className="divider" />
              <div className="contact-info-item">
                <MapPin size={22} className="contact-info-icon" />
                <div>
                  <strong>Localização</strong>
                  <span>São Paulo, SP — Brasil</span>
                </div>
              </div>
              <hr className="divider" />
              <div className="contact-info-item">
                <Clock size={22} className="contact-info-icon" />
                <div>
                  <strong>Horário de atendimento</strong>
                  <span>Segunda a Sexta</span>
                  <span>9h às 18h</span>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-faq">
            <h3>Antes de entrar em contato</h3>
            <p>Confira se sua dúvida está entre as mais comuns:</p>
            <ul className="contact-faq-list">
              <li>✅ Fazemos entregas para todo o Brasil (exeto terrários)</li>
              <li>✅ Todas as peças são 100% personalizáveis</li>
              <li>✅ Prazo de produção: 5 a 10 dias úteis</li>
              <li>✅ Embalagem especial incluída sem custo extra</li>
              <li>✅ Aceitamos Pix, cartão e transferência</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
