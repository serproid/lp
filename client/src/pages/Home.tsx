import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  Globe2,
  Instagram,
  Linkedin,
  MapPin,
  Menu,
  Search,
  UserRound,
  X,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";

function LongArrow({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={Math.round(size * 1.75)}
      height={size}
      viewBox="0 0 35 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 10h31" />
      <path d="M24 3l7 7-7 7" />
    </svg>
  );
}

function XLogo() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

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

const modelsMenu = {
  electric: [
    { name: "BYD DOLPHIN MINI", href: "/modelos", image: "https://www.byd.com/material/byd-site/america-public/header-product-image/small-pic.png" },
    { name: "BYD DOLPHIN", href: "/modelos", image: "https://www.byd.com/material/byd-site/america-public/header-product-image/dolphin-header-update.png" },
    { name: "BYD DOLPHIN PLUS", href: "/modelos", image: "https://www.byd.com/material/byd-site/america-public/header-product-image/dolphin/dolphin-platform-a-header.png" },
    { name: "BYD DOLPHIN SE", href: "/modelos", image: "https://www.byd.com/material/byd-site/br/product/dolphin-se/menu-dolphin-se-4.png" },
    { name: "BYD HAN", href: "/modelos", image: "https://www.byd.com/material/byd-site/america-public/header-product-image/han/han-black.png" },
    { name: "BYD SEAL", href: "/modelos", image: "https://www.byd.com/material/byd-site/america-public/header-product-image/seal/seal_glacier_blue.png" },
    { name: "BYD SEALION 7", href: "/modelos", image: "https://www.byd.com/material/byd-site/br/product/sealion/imagens/header/Sealion7-header.webp" },
    { name: "BYD TAN", href: "/modelos", image: "https://www.byd.com/material/byd-site/america-public/header-product-image/new-tan-grey-header.png" },
    { name: "BYD YUAN PLUS", href: "/modelos", image: "https://www.byd.com/material/byd-site/br/product/yuan-plus-ev-br/yuanplus-2026/yuan-2026/menu_yuan-plus-2026-2.png" },
    { name: "BYD YUAN PRO", href: "/modelos", image: "https://www.byd.com/material/byd-site/america-public/header-product-image/header-yuanpro.png" },
  ],
  hybrid: [
    { name: "BYD ATTO 2 DM-i", href: "/modelos", image: "https://www.byd.com/material/byd-site/br/product/atto-2-dmi/atto2-header.webp" },
    { name: "BYD ATTO 8", href: "/modelos", image: "https://www.byd.com/material/byd-site/br/atto-8/New_Atto_8_header_2.png" },
    { name: "BYD KING DM-i", href: "/modelos", image: "https://www.byd.com/material/byd-site/br/product/king/king-Header1.png" },
    { name: "BYD SHARK", href: "/modelos", image: "https://www.byd.com/material/byd-site/america-public/header-product-image/Header-BYD-SHARK.png" },
    { name: "BYD SONG PLUS DM-i", href: "/modelos", image: "https://www.byd.com/material/byd-site/america-public/header-product-image/Header-BYD-SONG-PLUS.png" },
    { name: "BYD SONG PLUS PREMIUM DM-i", href: "/modelos", image: "https://www.byd.com/material/byd-site/america-public/header-product-image/New_Song_Plus_Header.png" },
    { name: "BYD SONG PRO DM-i FLEX", href: "/modelos", image: "https://www.byd.com/material/__CN/byd-site/br/product/songpro-flex/byd-song-pro-flex-HEADER-3.png" },
  ],
} as const;

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

const footerColumns = [
  [
    {
      title: "Modelos",
      links: [
        "BYD ATTO 8", "BYD DOLPHIN MINI", "BYD DOLPHIN", "BYD DOLPHIN PLUS", "BYD DOLPHIN SE",
        "BYD HAN", "BYD KING DM-i", "BYD SEAL", "BYD SEALION 7", "BYD SHARK", "BYD SONG PLUS DM-i",
        "BYD SONG PLUS PREMIUM DM-i", "BYD SONG PRO DM-i FLEX", "BYD TAN", "BYD YUAN PLUS", "BYD YUAN PRO",
      ],
    },
    {
      title: "Sobre a BYD",
      links: ["Sobre a BYD", "Contato", "Notícias", "Sustentabilidade", "Confidencialidade, Compliance e Proteção de Dados"],
    },
  ],
  [
    {
      title: "Tecnologia",
      links: ["BYD Super DM", "O que é NEV?", "BYD e-Platform 3.0", "BYD Bateria Blade", "BYD DiSus", "BYD Cell to Body"],
    },
    {
      title: "Vendas",
      links: ["Ofertas BYD", "Vendas PCD", "Condições comerciais", "Calculadora de Economia", "Corrida de Vantagens Taxi e Aplicativos"],
    },
    {
      title: "Test Drive",
      links: ["Agende agora"],
    },
  ],
  [
    {
      title: "Baixe o App BYD",
      links: ["Android", "Apple iOS"],
    },
    {
      title: "Atendimento ao cliente",
      links: ["Central de Relacionamento", "Perguntas frequentes CRC"],
    },
    {
      title: "Pós Vendas",
      links: ["Serviço de Manutenção", "Chave digital", "BYD Assistance", "Regulamento Raízen", "Legislação e Segurança", "Blindagem certificada", "BYD Club"],
    },
  ],
];

const fallbackImages = {
  hero: heroSlides[0].image,
  technology:
    "https://www.byd.com/material/__CN/byd-site/br/product/songpro-flex/kv-banner-home.webp",
  greenFuture: "/futuro-verde.jpg",
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [modelsOpen, setModelsOpen] = useState(false);
  const [modelsTab, setModelsTab] = useState<"electric" | "hybrid">("electric");
  const modelsCloseTimer = useRef<number | null>(null);

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

  const openModels = () => {
    if (modelsCloseTimer.current) window.clearTimeout(modelsCloseTimer.current);
    setModelsOpen(true);
  };
  const closeModels = () => {
    if (modelsCloseTimer.current) window.clearTimeout(modelsCloseTimer.current);
    modelsCloseTimer.current = window.setTimeout(() => setModelsOpen(false), 140);
  };

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
          <a className="brand-mark byd-logo" href="#top" aria-label="BYD Brasil"><img src="https://www.byd.com/material/byd-site/br/public-icon/logo-old.svg" alt="BYD" /></a>
          <nav className="desktop-nav byd-primary-nav" aria-label="Navegação principal">
            <a
              href="#models"
              className={`byd-nav-models ${modelsOpen ? "is-open" : ""}`}
              onMouseEnter={openModels}
              onMouseLeave={closeModels}
              onFocus={openModels}
            >Modelos</a><a href="#technology">Tecnologia</a><a href="/ofertas">Ofertas</a><a href="/test-drive">Test Drive</a><a href="/aluguel-byd-mais">Aluguel BYD Mais</a>
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

      {modelsOpen && (
        <div
          className="byd-models-menu"
          onMouseEnter={openModels}
          onMouseLeave={closeModels}
          role="dialog"
          aria-label="Modelos BYD"
        >
          <div className="byd-models-menu-inner">
            <div className="byd-models-tabs">
              <button
                className={`byd-models-tab ${modelsTab === "electric" ? "is-active" : ""}`}
                onMouseEnter={() => setModelsTab("electric")}
                onFocus={() => setModelsTab("electric")}
                onClick={() => setModelsTab("electric")}
              >Veículos Elétricos</button>
              <button
                className={`byd-models-tab ${modelsTab === "hybrid" ? "is-active" : ""}`}
                onMouseEnter={() => setModelsTab("hybrid")}
                onFocus={() => setModelsTab("hybrid")}
                onClick={() => setModelsTab("hybrid")}
              >Veículos Híbridos</button>
            </div>
            <div className="byd-models-grid">
              {modelsMenu[modelsTab].map((car) => (
                <div className="byd-car-card" key={car.name}>
                  <h3>{car.name}</h3>
                  <a className="byd-car-card-image" href={car.href}>
                    <img src={car.image} alt={car.name} loading="lazy" />
                  </a>
                  <div className="byd-car-card-links">
                    <a href={car.href}>Saiba mais</a>
                    <a href="/test-drive">Test drive</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
            <a className="byd-text-link" href="/modelos">Ver todos os modelos <LongArrow size={15} /></a>
          </div>
          <div className="byd-model-strip">
            {modelLinks.slice(0, 5).map((model, index) => (
              <a className={`byd-model-tile ${index === activeSlide ? "is-featured" : ""}`} href="/modelos" key={model}>
                <span className="model-number">0{index + 1}</span>
                <span>{model}</span>
                <LongArrow size={15} />
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

      <section id="contact" className="byd-green-future" style={{ backgroundImage: `url(${fallbackImages.greenFuture})` }}>
        <div className="byd-green-future-overlay" />
        <div className="container byd-green-future-content">
          <h2>Tecnologia para o futuro verde</h2>
        </div>
      </section>

      <footer className="site-footer byd-footer">
        <div className="container byd-footer-columns">
          {footerColumns.map((groups, columnIndex) => (
            <div className="byd-footer-col" key={columnIndex}>
              {groups.map((group) => (
                <div className="byd-footer-group" key={group.title}>
                  <h3>{group.title}</h3>
                  <ul>
                    {group.links.map((link) => (
                      <li key={link}><a href="#">{link}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="container byd-footer-legal">
          <nav className="byd-footer-legal-links" aria-label="Links legais">
            <a href="#">Política da Privacidade</a>
            <a href="#">Política de Cookies</a>
            <a href="#">Termos de uso</a>
            <a href="#">Mapa do Site</a>
          </nav>
          <div className="byd-footer-social">
            <span>Siga a BYD</span>
            <a href="#" aria-label="X (Twitter)"><XLogo /></a>
            <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
            <a href="#" aria-label="YouTube"><Youtube size={20} /></a>
          </div>
        </div>

        <div className="container byd-footer-copyright">
          <p>© 2026 BYD Brasil - Todos os direitos reservados.</p>
          <p>BYD do Brasil Ltda, com sede em Avenida Antonio Buscato, 230, Terminal Intermodal de Cargas (TIC) em Campinas/SP, 13.069-119, inscrita no CNPJ/MF sob o nº 17.140.820/0002-62.</p>
          <p>Desacelere. Seu bem maior é a vida.</p>
        </div>
      </footer>

      <a className="byd-whatsapp" href="https://wa.me/551140028922" target="_blank" rel="noreferrer" aria-label="Fale conosco no WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </main>
  );
}
