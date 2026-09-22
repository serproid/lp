import { ArrowRight, BatteryCharging, Zap } from "lucide-react";
import { toast } from "sonner";
import BydHeader from "@/components/BydHeader";
import BydFooter from "@/components/BydFooter";
import { vehicles } from "@/lib/siteData";

export default function Models() {
  return (
    <main className="site-shell byd-home subpage-shell">
      <BydHeader />
      <section className="models-page-hero">
        <div className="container">
          <p className="eyebrow light-eyebrow"><span /> A linha BYD</p>
          <h1>Encontre o seu<br /><em>próximo carro.</em></h1>
          <p>Design marcante, tecnologia inteligente e uma experiência elétrica feita para o Brasil.</p>
        </div>
      </section>
      <section className="models-list container">
        <div className="subpage-title">
          <div><p className="eyebrow"><span /> Modelos</p><h2>Uma linha para<br /><em>cada caminho.</em></h2></div>
          <p>Escolha entre SUVs, sedans, compactos e picapes com a tecnologia BYD.</p>
        </div>
        <div className="models-grid">
          {vehicles.map((vehicle) => (
            <article className="model-card" key={vehicle.name}>
              <div className="model-card-image"><img src={vehicle.image} alt={vehicle.name} /></div>
              <div className="model-card-copy">
                <p>{vehicle.category}</p>
                <h3>{vehicle.name}</h3>
                <div>
                  <span><BatteryCharging size={15} /> {vehicle.range}</span>
                  <span><Zap size={15} /> Elétrico / híbrido</span>
                </div>
                <button onClick={() => toast(`Detalhes do ${vehicle.name} em breve`)}>Saiba mais <ArrowRight size={16} /></button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <BydFooter />
    </main>
  );
}
