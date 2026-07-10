import { MessageCircle, Instagram, Mail, MapPin, Clock, Leaf } from 'lucide-react';
import './AboutContact.css';

export default function AboutContact() {
  return (
    <main className="about-page">

      {/* Hero */}
      <section className="about-hero">
        <div className="container about-hero__inner">
          <div className="about-hero__text">
            <p className="section__eyebrow">Nossa história</p>
            <h1>Arte que nasce<br /><em>do coração.</em></h1>
            <p>
              A Artelli nasceu da crença de que um ambiente bem decorado tem o poder de
              transformar como você sente e vive cada espaço. Não somos uma fábrica.
              Somos artesãos.
            </p>
          </div>
          <div className="about-hero__visual">
            <img src="/oratorio_argamassa.png" alt="Oratório Artelli" />
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="section about-values">
        <div className="container">
          <div className="about-values__grid">
            {[
              { icon: <Leaf size={28} />, title: 'Feito à Mão', desc: 'Cada peça é criada manualmente, com materiais selecionados e técnicas artesanais refinadas.' },
              { icon: '✦', title: 'Exclusividade', desc: 'Nenhuma peça é idêntica à outra. Você recebe algo que não existia antes.' },
              { icon: '🤍', title: 'Com Amor', desc: 'Fazemos isso por paixão. Esse cuidado aparece em cada detalhe do produto final.' },
            ].map((v) => (
              <div className="about-value-card" key={v.title}>
                <div className="about-value-card__icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="section about-process">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="section__eyebrow">Processo simplificado</p>
            <h2 className="section__title">Da ideia à sua <em>casa</em></h2>
          </div>
          <div className="process-steps">
            {[
              { n: '1', title: 'Fale Conosco', desc: 'Nos chame no WhatsApp e conte o que você imagina. Sem formulários complicados.' },
              { n: '2', title: 'Criamos Juntos', desc: 'Definimos materiais, tamanho e estilo. Você aprova cada detalhe antes da produção.' },
              { n: '3', title: 'Produção', desc: 'Sua peça é criada com cuidado, no tempo certo. Qualidade que não pode ser apressada.' },
              { n: '4', title: 'Entrega', desc: 'Embalagem especial e entrega combinada. Sua peça chega pronta para encantar.' },
            ].map((s) => (
              <div className="process-step" key={s.n}>
                <div className="process-step__num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contato */}
      <section className="section about-contact" id="contato">
        <div className="container">
          <div className="about-contact__grid">
            <div>
              <p className="section__eyebrow">Entre em contato</p>
              <h2 className="section__title">Vamos criar algo <em>único juntos.</em></h2>
              <p className="about-contact__desc">
                A forma mais rápida de fazer uma encomenda ou tirar dúvidas é pelo WhatsApp.
                Respondemos em até 24 horas.
              </p>
              <div className="contact-links">
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener" className="contact-link contact-link--wa">
                  <MessageCircle size={20} />
                  <div>
                    <strong>WhatsApp</strong>
                    <span>(11) 99999-9999</span>
                  </div>
                </a>
                <a href="https://instagram.com/artelliartesanato" target="_blank" rel="noopener" className="contact-link">
                  <Instagram size={20} />
                  <div>
                    <strong>Instagram</strong>
                    <span>@artelliartesanato</span>
                  </div>
                </a>
                <a href="mailto:contato@artelli.com.br" className="contact-link">
                  <Mail size={20} />
                  <div>
                    <strong>E-mail</strong>
                    <span>contato@artelli.com.br</span>
                  </div>
                </a>
                <div className="contact-link">
                  <MapPin size={20} />
                  <div>
                    <strong>Localização</strong>
                    <span>São Paulo, SP</span>
                  </div>
                </div>
                <div className="contact-link">
                  <Clock size={20} />
                  <div>
                    <strong>Horário</strong>
                    <span>Seg–Sáb, 9h–18h</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-cta-card">
              <h3>Pronta para encomendar?</h3>
              <p>Clique abaixo e fale diretamente com a gente. Resposta rápida garantida.</p>
              <a
                href="https://wa.me/5511999999999?text=Olá%2C+Artelli!+Gostaria+de+fazer+uma+encomenda."
                target="_blank" rel="noopener"
                className="btn btn-sand"
                style={{ width: '100%', justifyContent: 'center', fontSize: '1rem' }}
              >
                <MessageCircle size={20} /> Encomendar pelo WhatsApp
              </a>
              <p className="contact-cta-note">🌿 Feito à mão com amor, para você.</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
