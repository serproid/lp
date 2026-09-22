import { useMemo, useState, type CSSProperties } from "react";
import { ArrowRight, ChevronDown, Filter, MapPin, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { segments, states, vehicles } from "@/lib/siteData";

const cityOptions = ["Todas as cidades", "São Paulo", "Campinas", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre"];
const modelOptions = ["Todos os modelos", ...vehicles.map((vehicle) => vehicle.name)];

export default function Offers() {
  const [state, setState] = useState(states[0]);
  const [city, setCity] = useState(cityOptions[0]);
  const [model, setModel] = useState(modelOptions[0]);
  const [segment, setSegment] = useState(segments[0]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filteredVehicles = useMemo(() => model === modelOptions[0] ? vehicles : vehicles.filter((vehicle) => vehicle.name === model), [model]);

  return (
    <main className="subpage-shell">
      <header className="subpage-header">
        <a href="/" className="subpage-brand"><span className="brand-symbol">✦</span><span className="brand-word">BYD</span></a>
        <nav><a href="/modelos">Modelos</a><a href="/tecnologia">Tecnologia</a><a className="active" href="/ofertas">Ofertas</a><a href="/test-drive">Test Drive</a><a href="/aluguel-byd-mais">Aluguel BYD Mais</a></nav>
        <a className="subpage-menu-link" href="/">Menu</a>
      </header>

      <section className="offers-hero">
        <div className="offers-hero-copy"><p className="eyebrow light-eyebrow"><span /> Escolha o seu próximo BYD</p><h1>Ofertas<br /><em>exclusivas.</em></h1><p>Condições especiais para você viver a nova energia em movimento.</p></div>
        <div className="offers-hero-image" />
      </section>

      <section className="offers-content container">
        <div className="offers-title-row"><div><p className="eyebrow"><span /> Ofertas BYD</p><h2>Escolha sua<br /><em>oferta.</em></h2></div><button className="filter-trigger" onClick={() => setFilterOpen(!filterOpen)}><SlidersHorizontal size={16} /> Filtros <ChevronDown size={15} className={filterOpen ? "rotate" : ""} /></button></div>
        <div className={`offers-filters ${filterOpen ? "open" : ""}`}>
          <FilterSelect label="Estado" value={state} options={states} onChange={setState} />
          <FilterSelect label="Cidade" value={city} options={cityOptions} onChange={setCity} />
          <FilterSelect label="Modelo" value={model} options={modelOptions} onChange={setModel} />
          <FilterSelect label="Segmento" value={segment} options={segments} onChange={setSegment} />
          <button className="button button-dark filter-submit" onClick={() => { setSubmitted(true); toast("Ofertas atualizadas"); }}>Aplicar filtros <ArrowRight size={16} /></button>
        </div>
        {submitted && <p className="filter-feedback"><MapPin size={14} /> Mostrando condições disponíveis para {state === states[0] ? "todo o Brasil" : state}{city !== cityOptions[0] ? ` · ${city}` : ""}.</p>}
        <div className="offer-grid">{filteredVehicles.map((vehicle) => <article className="offer-card" key={vehicle.name} style={{ "--card-accent": vehicle.accent } as CSSProperties}><div className="offer-image"><img src={vehicle.image} alt={vehicle.name} /><span className="offer-pill">Oferta especial</span></div><div className="offer-card-body"><p className="offer-category">{vehicle.category}</p><h3>{vehicle.name}</h3><div className="offer-details"><span>{vehicle.range}<small>autonomia estimada</small></span><span>{vehicle.offer}<small>condição vigente</small></span></div><div className="offer-card-bottom"><strong>{vehicle.price}</strong><button onClick={() => toast(`Oferta do ${vehicle.name} selecionada`)}>Ver oferta <ArrowRight size={15} /></button></div></div></article>)}</div>
        <p className="offers-disclaimer">As ofertas apresentadas são ilustrativas e podem variar de acordo com região, disponibilidade e condições comerciais. Consulte uma concessionária BYD.</p>
      </section>
      <Footer />
    </main>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="filter-field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={15} /></label>;
}

function Footer() { return <footer className="subpage-footer"><div className="container subpage-footer-grid"><div className="footer-brand"><span className="brand-symbol">✦</span><span className="brand-word">BYD</span><p>Construa seus sonhos.</p></div><div className="footer-legal"><span>© 2026 BYD Brasil — Todos os direitos reservados.</span><span>Privacidade&nbsp;&nbsp;&nbsp; Termos de uso</span></div></div></footer>; }
