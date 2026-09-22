import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Grid2X2, Globe2, MapPin, Menu, Search, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import LongArrow from "./LongArrow";

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

const techMenu = [
  { name: "BYD Super DM", href: "/tecnologia", image: "https://www.byd.com/material/byd-site/br/tecnologia/Super_DM-i-1.jpg" },
  { name: "O que é NEV?", href: "/tecnologia", image: "https://www.byd.com/material/byd-site/br/tecnologia/e-platform_3_02.jpg" },
  { name: "BYD e-Plataform 3.0", href: "/tecnologia", image: "https://www.byd.com/material/byd-site/br/tecnologia/BYD-e-platform-3-nav3.png" },
  { name: "BYD Bateria Blade", href: "/tecnologia", image: "https://www.byd.com/material/byd-site/br/tecnologia/Blade_battery-1.jpg" },
  { name: "BYD DiSus", href: "/tecnologia", image: "https://www.byd.com/material/byd-site/br/tecnologia/e4-platform-1.png" },
  { name: "BYD Cell to Body", href: "/tecnologia", image: "https://www.byd.com/material/byd-site/br/tecnologia/ICON_CTB-byd2.jpg" },
];

const menuColumns = [
  { title: "A empresa", links: ["Sobre a BYD", "Notícias", "Sustentabilidade"] },
  { title: "Atendimento ao cliente", links: ["Central de Relacionamento com Cliente", "Perguntas Frequentes (CRC)"] },
  { title: "Vendas", links: ["Ofertas", "Vendas PCD", "Condições Comerciais", "Calculadora de Economia", "BYD DiLink"] },
  { title: "Pós-vendas", links: ["Serviço de Manutenção", "Chave digital", "BYD Assistance", "Regulamento Raízen", "Legislação e Segurança", "Blindagem certificada"] },
];

const menuSolutions = {
  title: "Mais soluções",
  links: ["Energia Solar", "Caminhões", "Carregadores Veiculares", "Chassis de Ônibus", "Empilhadeiras"],
};

export default function BydHeader({ isHome = false }: { isHome?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [utilityHidden, setUtilityHidden] = useState(false);
  const [modelsOpen, setModelsOpen] = useState(false);
  const [modelsTab, setModelsTab] = useState<"electric" | "hybrid">("electric");
  const [techOpen, setTechOpen] = useState(false);
  const modelsCloseTimer = useRef<number | null>(null);
  const techCloseTimer = useRef<number | null>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (y < 40) {
        setUtilityHidden(false);
      } else if (Math.abs(y - lastY) > 4) {
        setUtilityHidden(y > lastY);
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showSoon = (message: string) => toast(message);
  const closeMenu = () => setMenuOpen(false);

  const openModels = () => {
    if (modelsCloseTimer.current) window.clearTimeout(modelsCloseTimer.current);
    if (techCloseTimer.current) window.clearTimeout(techCloseTimer.current);
    setTechOpen(false);
    setModelsOpen(true);
  };
  const closeModels = () => {
    if (modelsCloseTimer.current) window.clearTimeout(modelsCloseTimer.current);
    modelsCloseTimer.current = window.setTimeout(() => setModelsOpen(false), 140);
  };
  const openTech = () => {
    if (techCloseTimer.current) window.clearTimeout(techCloseTimer.current);
    if (modelsCloseTimer.current) window.clearTimeout(modelsCloseTimer.current);
    setModelsOpen(false);
    setTechOpen(true);
  };
  const closeTech = () => {
    if (techCloseTimer.current) window.clearTimeout(techCloseTimer.current);
    techCloseTimer.current = window.setTimeout(() => setTechOpen(false), 140);
  };

  const modelsHref = isHome ? "#models" : "/modelos";
  const techHref = isHome ? "#technology" : "/tecnologia";
  const logoHref = isHome ? "#top" : "/";
  const menuLinkHref = (link: string) => {
    if (link === "Modelos") return modelsHref;
    if (link === "Tecnologia") return techHref;
    if (link === "Ofertas") return "/ofertas";
    if (link === "Test Drive") return "/test-drive";
    return isHome ? "#contact" : "/";
  };

  return (
    <>
      <header className={`site-header byd-header ${scrolled ? "is-scrolled" : ""} ${utilityHidden ? "is-utility-hidden" : ""}`}>
        <div className="byd-utility-bar">
          <div className="byd-utility-inner">
            <button aria-label="Buscar" onClick={() => showSoon("A busca será disponibilizada em breve.")}><Search size={16} /></button>
            <span className="byd-utility-divider" />
            <button className="byd-global-link" onClick={() => showSoon("Seletor global em breve.")}><Grid2X2 size={14} /> Global <ChevronDown size={12} /></button>
          </div>
        </div>
        <div className="byd-main-bar">
          <a className="brand-mark byd-logo" href={logoHref} aria-label="BYD Brasil"><img src="https://www.byd.com/material/byd-site/br/public-icon/logo-old.svg" alt="BYD" /></a>
          <nav className="desktop-nav byd-primary-nav" aria-label="Navegação principal">
            <a
              href={modelsHref}
              className={`byd-nav-models ${modelsOpen ? "is-open" : ""}`}
              onMouseEnter={openModels}
              onMouseLeave={closeModels}
              onFocus={openModels}
            >Modelos</a><a
              href={techHref}
              className={`byd-nav-tech ${techOpen ? "is-open" : ""}`}
              onMouseEnter={openTech}
              onMouseLeave={closeTech}
              onFocus={openTech}
            >Tecnologia</a><a href="/ofertas">Ofertas</a><a href="/test-drive">Test Drive</a><a href="/aluguel-byd-mais">Aluguel BYD Mais</a>
          </nav>
          <div className="byd-main-actions">
            <button className="byd-menu-word" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? "Fechar" : "Menu"}</button>
            <a className="byd-metaverse" href={techHref}>Metaverso BYD</a>
            <a className="byd-main-utility" href={isHome ? "#dealers" : "/"}><MapPin size={18} /> Concessionários</a>
            <button className="byd-main-icon" aria-label="Minha conta" onClick={() => showSoon("Área do cliente em breve.")}><UserRound size={20} /></button>
            <button className="byd-main-icon" aria-label="Idioma" onClick={() => showSoon("Seletor de idioma em breve.")}><Globe2 size={21} /></button>
            <button className="menu-toggle byd-menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>{menuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
      </header>

      {modelsOpen && (
        <div
          className={`byd-models-menu ${utilityHidden ? "is-utility-hidden" : ""}`}
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

      {techOpen && (
        <div
          className={`byd-tech-menu ${utilityHidden ? "is-utility-hidden" : ""}`}
          onMouseEnter={openTech}
          onMouseLeave={closeTech}
          role="dialog"
          aria-label="Tecnologia BYD"
        >
          <div className="byd-tech-menu-inner">
            <div className="byd-tech-grid">
              {techMenu.map((item) => (
                <div className="byd-tech-card" key={item.name}>
                  <h3>{item.name}</h3>
                  <a className="byd-tech-card-image" href={item.href}>
                    <img src={item.image} alt={item.name} loading="lazy" />
                  </a>
                  <a className="byd-tech-card-link" href={item.href}>Saiba mais <LongArrow size={13} /></a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className={`byd-menu-panel ${utilityHidden ? "is-utility-hidden" : ""}`} role="dialog" aria-label="Menu principal">
          <div className="container byd-menu-inner">
            <div className="byd-menu-columns">
              {menuColumns.map((column) => (
                <div className="byd-menu-column" key={column.title}>
                  <span>{column.title}</span>
                  {column.links.map((link) => (
                    <a href={menuLinkHref(link)} onClick={closeMenu} key={link}>
                      {link}<ArrowRight size={16} />
                    </a>
                  ))}
                </div>
              ))}
            </div>
            <div className="byd-menu-column byd-menu-solutions">
              <span>{menuSolutions.title}</span>
              {menuSolutions.links.map((link) => (
                <a href={menuLinkHref(link)} onClick={closeMenu} key={link}>
                  {link}<ArrowRight size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
