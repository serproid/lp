import { useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import BydHeader from "@/components/BydHeader";
import BydFooter from "@/components/BydFooter";
import { offers, offerCitiesByState, offerSegments, offerSeries, offerStates } from "@/lib/offersData";
import { brl, usePriceOverrides } from "@/lib/priceStore";

function FilterSelect({ label, placeholder, options, value, onChange, disabled }: { label: string; placeholder: string; options: string[]; value: string; onChange: (value: string) => void; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="byd-offer-filter">
      <span className="byd-offer-filter-label">{label}</span>
      <div className={`byd-offer-filter-field ${disabled ? "is-disabled" : ""}`}>
        <button type="button" className="byd-offer-filter-input" onClick={() => !disabled && setOpen((current) => !current)}>
          <span className={value ? "" : "is-placeholder"}>{value || placeholder}</span>
          {value ? <span className="byd-offer-filter-clear" onClick={(event) => { event.stopPropagation(); onChange(""); }}>×</span> : null}
          <ChevronDown size={14} className={open ? "rotate" : ""} />
        </button>
        {open && !disabled && (
          <div className="byd-offer-filter-options">
            {options.map((option) => (
              <button type="button" key={option} className={option === value ? "is-selected" : ""} onClick={() => { onChange(option); setOpen(false); }}>{option}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Offers() {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [model, setModel] = useState("");
  const [segment, setSegment] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const overrides = usePriceOverrides();

  const cityOptions = state ? offerCitiesByState[state] ?? [] : [];

  const filtered = useMemo(
    () => offers.filter((offer) => (!model || offer.series === model) && (!segment || offer.segment === segment)),
    [model, segment],
  );

  const clearAll = () => { setState(""); setCity(""); setModel(""); setSegment(""); };

  return (
    <main className="site-shell byd-home byd-offers-page">
      <BydHeader />

      <section className="byd-offer-banner">
        <a href="/test-drive" aria-label="Ofertas BYD">
          <picture>
            <source media="(max-width: 768px)" srcSet="https://www.byd.com/material/__CN/byd-site/br/offer-model/ofertas-jul-2026-mob.webp" />
            <img src="https://www.byd.com/material/__CN/byd-site/br/offer-model/ofertas-jul-2026.desk.webp" alt="Ofertas BYD" />
          </picture>
        </a>
      </section>

      <section className={`container byd-offer-layout ${filtersOpen ? "" : "is-collapsed"}`}>
        <aside className="byd-offer-sidebar">
          <button type="button" className="byd-offer-filters-toggle" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen}>
            <SlidersHorizontal size={16} />
            <span>Filtros</span>
            <ChevronDown size={16} className={filtersOpen ? "rotate" : ""} />
          </button>
          <div className="byd-offer-sidebar-body">
            <h1 className="byd-offer-title">Ofertas BYD</h1>
            <p className="byd-offer-subtitle">Escolha sua oferta</p>
            <div className="byd-offer-filters">
              <FilterSelect label="Estado" placeholder="Todos os estados" options={offerStates} value={state} onChange={(value) => { setState(value); setCity(""); }} />
              <FilterSelect label="Cidade" placeholder="Selecione a cidade" options={cityOptions} value={city} onChange={setCity} disabled={!state} />
              <FilterSelect label="Modelo" placeholder="Selecione um modelo" options={offerSeries} value={model} onChange={setModel} />
              <FilterSelect label="Segmento" placeholder="Selecione um segmento" options={offerSegments} value={segment} onChange={setSegment} />
            </div>
          </div>
        </aside>

        <div className="byd-offer-results">
          <div className="byd-offer-list-top">
            <span>{filtered.length} {filtered.length === 1 ? "oferta selecionada" : "ofertas selecionadas"} para você</span>
            <button type="button" className={state || city || model || segment ? "" : "is-disabled"} onClick={clearAll}>Limpar filtro</button>
          </div>

          <div className="byd-offer-cards">
            {filtered.map((offer) => {
              const override = overrides[offer.id];
              const crm = override?.crmPrice ?? offer.crmPrice;
              const por = override?.discountPrice !== undefined ? override.discountPrice : offer.discountPrice;
              return (
              <article className="byd-offer-card" key={offer.id}>
                <div className="byd-offer-media">
                  {offer.segment && offer.segment !== "Todos" ? <span className="byd-offer-segment">{offer.segment}</span> : null}
                  <img src={offer.image} alt={offer.model} loading="lazy" />
                </div>
                <div className="byd-offer-info">
                  <h3>{offer.model} {offer.year}</h3>
                  <ul className="byd-offer-bullets">
                    {offer.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                  <div className="byd-offer-prices">
                    <div className="byd-offer-price">
                      <span className="byd-offer-price-label">De</span>
                      <strong>{brl(crm)}</strong>
                    </div>
                    {por !== null ? (
                      <div className="byd-offer-price is-highlight">
                        <span className="byd-offer-price-label">Por</span>
                        <strong>{brl(por)}</strong>
                      </div>
                    ) : null}
                  </div>
                  <div className="byd-offer-validity">
                    <span>Oferta válida até {offer.validade}</span>
                    <button type="button" onClick={() => toast(`Condições do ${offer.model} em breve.`)}>Consulte condições</button>
                  </div>
                  <div className="byd-offer-actions">
                    <a className="byd-offer-btn" href={`/simulacao?modelo=${encodeURIComponent(`${offer.model} ${offer.year}`)}`}>Estou interessado</a>
                    <a className="byd-offer-whatsapp" href="https://wa.me/551140028922" target="_blank" rel="noreferrer" aria-label={`WhatsApp ${offer.model}`}><WhatsAppIcon /></a>
                  </div>
                </div>
              </article>
              );
            })}
            {filtered.length === 0 && <p className="byd-offer-empty">Nenhuma oferta encontrada para os filtros selecionados.</p>}
          </div>
        </div>
      </section>

      <BydFooter />
    </main>
  );
}
