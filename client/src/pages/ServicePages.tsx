import { type ReactNode } from "react";
import { ArrowRight, Check, Leaf, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";
import BydHeader from "@/components/BydHeader";
import BydFooter from "@/components/BydFooter";

export function Technology() {
  return (
    <main className="site-shell byd-home subpage-shell">
      <BydHeader />
      <section className="tech-page-hero">
        <div className="container">
          <p className="eyebrow light-eyebrow"><span /> Tecnologia BYD</p>
          <h1>Inovação que<br /><em>move o mundo.</em></h1>
          <p>Da bateria Blade à inteligência de bordo, criamos tecnologias para transformar a maneira como você se move.</p>
        </div>
      </section>
      <section className="technology-pillars container">
        <div className="subpage-title">
          <div><p className="eyebrow"><span /> O jeito BYD</p><h2>Mais que<br /><em>um carro.</em></h2></div>
          <p>Um ecossistema completo de soluções para uma vida mais conectada, segura e sustentável.</p>
        </div>
        <div className="pillar-grid">
          <Pillar icon={<Zap />} title="Energia inteligente" text="Baterias desenvolvidas para entregar performance, autonomia e tranquilidade." />
          <Pillar icon={<ShieldCheck />} title="Segurança avançada" text="Estruturas e sistemas que cuidam de você em todos os caminhos." />
          <Pillar icon={<Leaf />} title="Um futuro mais limpo" text="Tecnologia pensada para reduzir o impacto e ampliar as possibilidades." />
        </div>
      </section>
      <BydFooter />
    </main>
  );
}

function Pillar({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <article className="pillar-card">
      <span>{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
      <a href="/" onClick={(event) => { event.preventDefault(); toast("Conteúdo em breve"); }}>Saiba mais <ArrowRight size={15} /></a>
    </article>
  );
}

export function Subscription() {
  return (
    <main className="site-shell byd-home subpage-shell">
      <BydHeader />
      <section className="subscription-hero">
        <div className="container">
          <p className="eyebrow light-eyebrow"><span /> Mobilidade do seu jeito</p>
          <h1>Aluguel BYD<br /><em>Mais.</em></h1>
          <p>Tenha um BYD na sua garagem com a liberdade e a praticidade de uma assinatura.</p>
        </div>
      </section>
      <section className="subscription-section container">
        <div><p className="eyebrow"><span /> Como funciona</p><h2>Mais liberdade.<br /><em>Menos preocupação.</em></h2></div>
        <div className="subscription-steps">
          <Step number="01" title="Escolha seu modelo" text="Encontre o BYD que combina com a sua rotina." />
          <Step number="02" title="Defina seu plano" text="Assine pelo período que fizer sentido para você." />
          <Step number="03" title="Viva a experiência" text="Receba, dirija e aproveite. A gente cuida do resto." />
        </div>
      </section>
      <BydFooter />
    </main>
  );
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="subscription-step">
      <span>{number}</span>
      <div><h3>{title}</h3><p>{text}</p></div>
      <Check size={18} />
    </div>
  );
}
