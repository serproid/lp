import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  Globe2,
  MapPin,
  Menu,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

const heroSlides = [
  {
    name: "BYD SONG PRO DM-i FLEX",
    eyebrow: "O SUV híbrido plug-in que combina liberdade e eficiência",
    image:
      "https://www.byd.com/material/__CN/byd-site/br/home/home-2026/kv-banner-home-campanha-DESK.webp",
    href: "/modelos",
    campaign: true,
  },
  {
    name: "BYD ATTO 2 DM-i FLEX",
    eyebrow: "Tecnologia híbrida para todos os caminhos",
    image:
      "https://www.byd.com/material/byd-site/br/product/atto-2-dmi/kv-banner-home-pc2.webp",
    href: "/modelos",
    campaign: false,
  },
  {
    name: "Manifesto BYD",
    eyebrow: "A nova energia em movimento",
    image:
      "https://www.byd.com/material/__CN/byd-site/br/home/home-2026/kv-banner-home-campanha-DESK.webp",
    video:
      "https://www.byd.com/material/byd-site/br/home/home-2026/byd-manifesto-website-v2.mp4",
    href: "/tecnologia",
    campaign: true,
  },
  {
    name: "BYD SEALION 7",
    eyebrow: "Potência, design e inovação em movimento",
    image:
      "https://www.byd.com/material/byd-site/br/product/atto-2-dmi/kv-banner-home-pc2.webp",
    href: "/modelos",
    campaign: false,
  },
];

const modelLinks = [
  "BYD SONG PRO DM-i FLEX",
  "BYD ATTO 2 DM-i FLEX",
  "BYD SEALION 7",
  "BYD DOLPHIN SE",
  "BYD SONG PLUS",
  "BYD ATTO 8",
  "BYD DOLPHIN MINI",
  "BYD KING",
  "BYD SHARK",
];

const menuColumns = [
  {
    title: "Descubra a BYD",
    links: ["Modelos", "Tecnologia", "Ofertas", "Test Drive", "BYD por assinatura"],
  },
  {
    title: "Precisa de ajuda?",
    links: ["Concessionários", "Assistência técnica", "Fale conosco", "Perguntas frequentes"],
  },
  {
    title: "Mundo BYD",
    links: ["Sobre a BYD", "BYD Design", "Metaverso BYD", "Sustentabilidade"],
  },
];

const fallbackImages = {
  hero: heroSlides[0].image,
  technology:
    "https://www.byd.com/material/__CN/byd-site/br/product/songpro-flex/kv-banner-home.webp",
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const slide = heroSlides[activeSlide];
  const nextSlide = () => setActiveSlide((current) => (current + 1) % heroSlides.length);
  const previousSlide = () =>
    setActiveSlide((current) => (current + heroSlides.length - 1) % heroSlides.length);

  const closeMenu = () => setMenuOpen(false);
  const showSoon = (message: string) => toast(message);

  return (
    <main className="site-shell byd-home">
      <header className={`site-header byd-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="byd-utility-bar">
          <div className="byd-utility-inner">
            <button aria-label="Buscar" onClick={() => showSoon("A busca será disponibilizada em breve.")}><Search size={16} /></button>
            <span className="byd-utility-divider" />
            <button className="byd-global-link" onClick={() => showSoon("Seletor global em breve.")}><Grid2X2 size={14} /> Global <ChevronDown size={12} /></button>
          </div>
        </div>
        <div className="byd-main-bar">
          <a className="brand-mark byd-logo" href="#top" aria-label="BYD Brasil"><img src="/manus-storage/byd-header-logo_57003a69.png" alt="BYD" /></a>
          <nav className="desktop-nav byd-primary-nav" aria-label="Navegação principal">
            <a href="#models">Modelos</a><a href="#technology">Tecnologia</a><a href="/ofertas">Ofertas</a><a href="/test-drive">Test Drive</a><a href="/aluguel-byd-mais">Aluguel BYD Mais</a>
          </nav>
          <div className="byd-main-actions">
            <button className="byd-menu-word" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? "Fechar" : "Menu"}</button>
            <a className="byd-metaverse" href="#technology">Metaverso BYD</a>
            <a className="byd-main-utility" href="#dealers"><MapPin size={18} /> Concessionários</a>
            <button className="byd-main-icon" aria-label="Minha conta" onClick={() => showSoon("Área do cliente em breve.")}><UserRound size={20} /></button>
            <button className="byd-main-icon" aria-label="Idioma" onClick={() => showSoon("Seletor de idioma em breve.")}><Globe2 size={21} /></button>
            <button className="menu-toggle byd-menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>{menuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="byd-menu-panel" role="dialog" aria-label="Menu principal">
          <div className="container byd-menu-inner">
            <div className="byd-menu-heading">
              <span className="menu-kicker">Menu</span>
              <h2>Explore a BYD</h2>
              <p>Descubra uma nova experiência em mobilidade, tecnologia e design.</p>
            </div>
            <div className="byd-menu-columns">
              {menuColumns.map((column) => (
                <div className="byd-menu-column" key={column.title}>
                  <span>{column.title}</span>
                  {column.links.map((link) => (
                    <a href={link === "Modelos" ? "#models" : link === "Tecnologia" ? "#technology" : link === "Ofertas" ? "/ofertas" : link === "Test Drive" ? "/test-drive" : "#contact"} onClick={closeMenu} key={link}>
                      {link}<ArrowRight size={16} />
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <section id="top" className={`byd-hero ${slide.campaign ? "has-campaign-art" : ""} ${slide.video ? "has-video" : ""}`} style={{ backgroundImage: `url(${slide.image})` }}>
        {slide.video && <video className="byd-hero-video" src={slide.video} autoPlay muted loop playsInline preload="auto" aria-label="Vídeo manifesto BYD" />}
        <div className="byd-hero-overlay" />
        <div className="container byd-hero-content">
          <p className="byd-overline">BYD Brasil <span /> {String(activeSlide + 1).padStart(2, "0")} / {String(heroSlides.length).padStart(2, "0")}</p>
          <div className="byd-hero-copy">
            <p>{slide.eyebrow}</p>
            <h1>{slide.name}</h1>
            <div className="byd-hero-actions">
              <a className="byd-button byd-button-light" href={slide.href}>Saiba mais <ArrowRight size={17} /></a>
              <a className="byd-button byd-button-ghost" href="/test-drive">Test drive <ArrowRight size={17} /></a>
            </div>
          </div>
          <div className="byd-hero-controls">
            <button aria-label="Slide anterior" onClick={previousSlide}><ChevronLeft /></button>
            <div className="byd-slider-progress"><span style={{ width: `${((activeSlide + 1) / heroSlides.length) * 100}%` }} /></div>
            <button aria-label="Próximo slide" onClick={nextSlide}><ChevronRight /></button>
          </div>
        </div>
      </section>

      <section id="models" className="byd-models-section">
        <div className="container">
          <div className="byd-section-title">
            <div><p className="byd-overline dark">Conheça a linha BYD</p><h2>Escolha o seu próximo <strong>BYD</strong></h2></div>
            <a className="byd-text-link" href="/modelos">Ver todos os modelos <ArrowRight size={17} /></a>
          </div>
          <div className="byd-model-strip">
            {modelLinks.slice(0, 5).map((model, index) => (
              <a className={`byd-model-tile ${index === activeSlide ? "is-featured" : ""}`} href="/modelos" key={model}>
                <span className="model-number">0{index + 1}</span>
                <span>{model}</span>
                <ArrowRight size={16} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="technology" className="byd-tech-banner" style={{ backgroundImage: `url(${fallbackImages.technology})` }}>
        <div className="byd-tech-overlay" />
        <div className="container byd-tech-content">
          <p className="byd-overline">Tecnologia BYD</p>
          <h2>Inovação que<br /><strong>move o futuro.</strong></h2>
          <p>A Blade Battery, a e-Platform 3.0 e um ecossistema inteligente transformam cada viagem.</p>
          <a className="byd-button byd-button-light" href="/tecnologia">Conheça a tecnologia <ArrowRight size={17} /></a>
        </div>
      </section>

      <section id="dealers" className="byd-dealer-section">
        <div className="container byd-dealer-grid">
          <div><p className="byd-overline dark">Encontre a BYD mais próxima</p><h2>Viva essa experiência de perto.</h2></div>
          <div><p>Visite uma concessionária, conheça nossos modelos e agende um test drive.</p><a className="byd-button byd-button-dark" href="#contact">Encontrar concessionária <ArrowRight size={17} /></a></div>
        </div>
      </section>

      <section id="contact" className="byd-contact-bar">
        <div className="container"><span>Fale com a BYD</span><a href="/test-drive">Agende seu test drive <ArrowRight size={17} /></a></div>
      </section>

      <footer className="site-footer byd-footer">
        <div className="container footer-main"><div className="footer-brand"><span className="brand-word">BYD</span><p>Build Your Dreams.</p></div><div className="footer-links"><div><span>Institucional</span><a href="#models">Modelos</a><a href="#technology">Tecnologia</a><a href="/ofertas">Ofertas</a></div><div><span>Atendimento</span><a href="#dealers">Concessionários</a><a href="/test-drive">Test Drive</a><a href="#contact">Fale conosco</a></div></div></div>
        <div className="container footer-bottom"><span>© 2026 BYD Brasil - Todos os direitos reservados.</span><span>Privacidade&nbsp;&nbsp;&nbsp; Termos de uso</span></div>
      </footer>
    </main>
  );
}
