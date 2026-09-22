import { useState } from "react";
import { ArrowRight, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { useLocation, useSearch } from "wouter";
import BydHeader from "@/components/BydHeader";
import BydFooter from "@/components/BydFooter";
import { resolveAppUrl, useActiveApp } from "@/lib/appStore";

const downPaymentChips = [
  { label: "Sem entrada", value: 0 },
  { label: "R$ 10 mil", value: 10000 },
  { label: "R$ 20 mil", value: 20000 },
  { label: "R$ 30 mil", value: 30000 },
  { label: "R$ 40 mil", value: 40000 },
  { label: "R$ 50 mil+", value: 50000 },
];

const tradeChips = [
  { label: "R$ 20.000", value: "R$ 20.000" },
  { label: "R$ 30.000", value: "R$ 30.000" },
  { label: "R$ 40.000", value: "R$ 40.000" },
  { label: "R$ 50.000", value: "R$ 50.000" },
  { label: "Outro valor", value: "outro" },
];

export default function Simulator() {
  const search = useSearch();
  const [, navigate] = useLocation();
  const params = new URLSearchParams(search);
  const model = params.get("modelo") || "";
  const offerId = params.get("id") || "";

  const appRelease = useActiveApp();
  const appUrl = resolveAppUrl(appRelease);

  const [buyType, setBuyType] = useState<"new" | "trade">("new");
  const [downPayment, setDownPayment] = useState(30000);
  const [tradeValue, setTradeValue] = useState("");
  const [otherTrade, setOtherTrade] = useState("");

  const handleApp = () => {
    if (appUrl) {
      window.open(appUrl, "_blank", "noopener,noreferrer");
    } else {
      toast("O download do app estará disponível em breve.");
    }
  };

  const goToOffer = () => {
    const next = new URLSearchParams();
    if (offerId) next.set("id", offerId);
    if (model) next.set("modelo", model);
    const query = next.toString();
    navigate(`/oferta-selecionada${query ? `?${query}` : ""}`);
  };

  return (
    <main className="site-shell byd-home byd-sim-page">
      <BydHeader />

      <section className="byd-sim-hero">
        <div className="container">
          <p className="byd-overline dark">Simulação</p>
          <h1 className="byd-sim-title">Seu BYD novo está mais perto do que você imagina</h1>
          <p className="byd-sim-subtitle">Faça uma simulação rápida, segura e sem compromisso. Escolha como pretende dar a entrada e veja as opções disponíveis.</p>
          {model ? <p className="byd-sim-model">Veículo selecionado: <strong>{model}</strong></p> : null}
        </div>
      </section>

      <section className="container byd-sim-body">
        <div className="byd-sim-card">
          <h2 className="byd-sim-step">1. Como pretende comprar?</h2>
          <div className="byd-sim-options">
            <button
              type="button"
              className={`byd-sim-option ${buyType === "new" ? "is-active" : ""}`}
              onClick={() => setBuyType("new")}
              aria-pressed={buyType === "new"}
            >
              <span className="byd-sim-radio" />
              <span>Vou comprar um BYD novo</span>
            </button>
            <button
              type="button"
              className={`byd-sim-option ${buyType === "trade" ? "is-active" : ""}`}
              onClick={() => setBuyType("trade")}
              aria-pressed={buyType === "trade"}
            >
              <span className="byd-sim-radio" />
              <span>Vou dar meu carro usado como entrada</span>
            </button>
          </div>
        </div>

        <div className="byd-sim-card">
          <h2 className="byd-sim-step">2. Quanto pretende dar de entrada?</h2>
          <div className="byd-sim-chips">
            {downPaymentChips.map((chip) => (
              <button
                type="button"
                key={chip.label}
                className={`byd-sim-chip ${downPayment === chip.value ? "is-active" : ""}`}
                onClick={() => setDownPayment(chip.value)}
              >{chip.label}</button>
            ))}
          </div>

          <div className="byd-sim-slider">
            <div className="byd-sim-slider-head">
              <span>Valor da entrada</span>
              <strong>{downPayment === 0 ? "Sem entrada" : downPayment.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}</strong>
            </div>
            <input
              type="range"
              min={0}
              max={100000}
              step={1000}
              value={downPayment}
              onChange={(event) => setDownPayment(Number(event.target.value))}
              aria-label="Valor da entrada"
            />
            <div className="byd-sim-slider-range"><span>R$ 0</span><span>R$ 100.000</span></div>
          </div>
        </div>

        {buyType === "trade" && (
          <div className="byd-sim-card">
            <h2 className="byd-sim-step">Qual é o valor aproximado do seu usado?</h2>
            <div className="byd-sim-chips">
              {tradeChips.map((chip) => (
                <button
                  type="button"
                  key={chip.value}
                  className={`byd-sim-chip ${tradeValue === chip.value ? "is-active" : ""}`}
                  onClick={() => setTradeValue(chip.value)}
                >{chip.label}</button>
              ))}
            </div>
            {tradeValue === "outro" && (
              <input
                className="byd-sim-input"
                placeholder="Informe o valor aproximado (R$)"
                value={otherTrade}
                onChange={(event) => setOtherTrade(event.target.value)}
              />
            )}
            <div className="byd-sim-eval">
              <p>Não sabe quanto vale seu carro? Informe os dados e faça uma avaliação.</p>
              <button type="button" className="byd-sim-link" onClick={() => toast("Avaliação de usado em breve.")}>Fazer avaliação <ArrowRight size={15} /></button>
            </div>
          </div>
        )}

        <div className="byd-sim-submit-wrap">
          <button type="button" className="byd-sim-submit" onClick={goToOffer}>Ver opções disponíveis <ArrowRight size={16} /></button>
        </div>
      </section>

      <section className="byd-sim-app">
        <div className="container byd-sim-app-inner">
          <span className="byd-sim-app-icon"><Smartphone size={26} /></span>
          <div className="byd-sim-app-copy">
            <h2>Simule pelo aplicativo</h2>
            <p>É rápido, seguro e você pode fazer a simulação pelo celular. Consulte as condições disponíveis, informe os dados necessários e acompanhe sua simulação de forma prática.</p>
          </div>
          <button type="button" className="byd-sim-app-btn" onClick={handleApp}>
            Baixar app e simular agora <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <BydFooter />
    </main>
  );
}
