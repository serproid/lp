import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import BydHeader from "@/components/BydHeader";
import BydFooter from "@/components/BydFooter";
import LongArrow from "@/components/LongArrow";

type HeroSlide = {
  name: string;
  eyebrow: string;
  image: string;
  mobileImage?: string;
  href: string;
  campaign?: boolean;
  video?: string;
};

const heroSlides: HeroSlide[] = [
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
    mobileImage:
      "https://www.byd.com/material/byd-site/br/product/atto-2-dmi/kv-banner-home-mob4.webp",
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

const fallbackImages = {
  hero: heroSlides[0].image,
  technology:
    "https://www.byd.com/material/__CN/byd-site/br/product/songpro-flex/kv-banner-home.webp",
  greenFuture: "/futuro-verde.jpg",
};

function useMobileHero() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 860px)").matches,
  );
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 860px)");
    const onChange = () => setIsMobile(mql.matches);
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);
    setIsMobile(mql.matches);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, []);
  return isMobile;
}

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const isMobile = useMobileHero();

  const slide = heroSlides[activeSlide];
  const heroImage = isMobile && slide.mobileImage ? slide.mobileImage : slide.image;
  const nextSlide = () => setActiveSlide((current) => (current + 1) % heroSlides.length);
  const previousSlide = () =>
    setActiveSlide((current) => (current + heroSlides.length - 1) % heroSlides.length);

  return (
    <main className="site-shell byd-home">
      <BydHeader isHome />

      <section id="top" className={`byd-hero ${slide.campaign ? "has-campaign-art" : ""} ${slide.video ? "has-video" : ""}`} style={{ backgroundImage: `url(${heroImage})` }}>
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

      <BydFooter />
    </main>
  );
}
