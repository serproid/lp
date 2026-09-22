import { useMemo, useState, type FormEvent } from "react";
import { Lock, LogOut, RotateCcw, Save, Search } from "lucide-react";
import { toast } from "sonner";
import { offers } from "@/lib/offersData";
import { getAppConfig, saveAppConfig } from "@/lib/appStore";
import { clearOverrides, getOverrides, saveOverrides, type PriceOverrides } from "@/lib/priceStore";

const ADMIN_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD as string) || "byd2026";
const AUTH_KEY = "byd:admin-auth";

type DraftRow = { crmPrice: string; discountPrice: string };
type Draft = Record<string, DraftRow>;

function buildDraft(): Draft {
  const overrides = getOverrides();
  const draft: Draft = {};
  offers.forEach((offer) => {
    const override = overrides[offer.id];
    const crm = override?.crmPrice ?? offer.crmPrice;
    const por = override?.discountPrice !== undefined ? override.discountPrice : offer.discountPrice;
    draft[offer.id] = { crmPrice: String(crm), discountPrice: por === null ? "" : String(por) };
  });
  return draft;
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === "1");
  const [password, setPassword] = useState("");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Draft>(() => buildDraft());
  const [appUrl, setAppUrl] = useState(() => getAppConfig().downloadUrl);

  const filtered = useMemo(
    () => offers.filter((offer) => `${offer.model} ${offer.series} ${offer.segment}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const login = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "1");
      setAuthed(true);
    } else {
      toast("Senha incorreta.");
    }
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
    setPassword("");
  };

  const update = (id: string, field: keyof DraftRow, value: string) => {
    setDraft((current) => ({ ...current, [id]: { ...current[id], [field]: value } }));
  };

  const save = () => {
    const overrides: PriceOverrides = {};
    offers.forEach((offer) => {
      const row = draft[offer.id];
      const crm = Number(row.crmPrice);
      const por = row.discountPrice.trim() === "" ? null : Number(row.discountPrice);
      if (crm !== offer.crmPrice || por !== offer.discountPrice) {
        overrides[offer.id] = { crmPrice: crm, discountPrice: por };
      }
    });
    saveOverrides(overrides);
    toast(`${Object.keys(overrides).length} preço(s) atualizado(s).`);
  };

  const reset = () => {
    clearOverrides();
    setDraft(buildDraft());
    toast("Preços restaurados para o valor original.");
  };

  if (!authed) {
    return (
      <main className="byd-admin-login">
        <form className="byd-admin-login-card" onSubmit={login}>
          <span className="byd-admin-login-icon"><Lock size={22} /></span>
          <h1>Super Admin</h1>
          <p>Acesso restrito ao gerenciamento de preços BYD.</p>
          <label>
            Senha
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite a senha" autoFocus />
          </label>
          <button type="submit">Entrar</button>
        </form>
      </main>
    );
  }

  return (
    <main className="byd-admin">
      <header className="byd-admin-bar">
        <div className="byd-admin-bar-inner">
          <div className="byd-admin-brand">
            <span className="byd-admin-badge">Super Admin</span>
            <strong>Gerenciar preços</strong>
            <span className="byd-admin-count">{offers.length} ofertas</span>
          </div>
          <div className="byd-admin-bar-actions">
            <button type="button" className="byd-admin-ghost" onClick={reset}><RotateCcw size={15} /> Restaurar</button>
            <button type="button" className="byd-admin-save" onClick={save}><Save size={15} /> Salvar preços</button>
            <button type="button" className="byd-admin-ghost" onClick={logout}><LogOut size={15} /> Sair</button>
          </div>
        </div>
      </header>

      <div className="byd-admin-body">
        <div className="byd-admin-app">
          <div className="byd-admin-app-copy">
            <strong>App BYD — link de download</strong>
            <p>Cole o link (Android/iOS). Os botões "Baixar app e simular agora" e "Ver opções disponíveis" da simulação usam este link.</p>
          </div>
          <div className="byd-admin-app-row">
            <input value={appUrl} onChange={(event) => setAppUrl(event.target.value)} placeholder="https://..." />
            <button type="button" className="byd-admin-save" onClick={() => { saveAppConfig({ downloadUrl: appUrl.trim() }); toast("Link do app salvo."); }}><Save size={15} /> Salvar link</button>
          </div>
        </div>

        <label className="byd-admin-search">
          <Search size={16} />
          <input placeholder="Buscar por modelo, série ou segmento" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>

        <div className="byd-admin-table">
          <div className="byd-admin-row byd-admin-row-head">
            <span>Modelo</span>
            <span>Segmento</span>
            <span>De (R$)</span>
            <span>Por (R$)</span>
          </div>
          {filtered.map((offer) => (
            <div className="byd-admin-row" key={offer.id}>
              <div className="byd-admin-model">
                <img src={offer.image} alt={offer.model} loading="lazy" />
                <div>
                  <strong>{offer.model}</strong>
                  <small>{offer.series} · {offer.year}</small>
                </div>
              </div>
              <span className="byd-admin-segment">{offer.segment}</span>
              <input
                type="number"
                step="100"
                min="0"
                value={draft[offer.id]?.crmPrice ?? ""}
                onChange={(event) => update(offer.id, "crmPrice", event.target.value)}
              />
              <input
                type="number"
                step="100"
                min="0"
                placeholder="sem desconto"
                value={draft[offer.id]?.discountPrice ?? ""}
                onChange={(event) => update(offer.id, "discountPrice", event.target.value)}
              />
            </div>
          ))}
          {filtered.length === 0 && <p className="byd-admin-empty">Nenhuma oferta encontrada.</p>}
        </div>
      </div>
    </main>
  );
}
