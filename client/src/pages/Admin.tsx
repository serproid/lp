import { useCallback, useEffect, useMemo, useState } from "react";
import { RotateCcw, Save, Search } from "lucide-react";
import { toast } from "sonner";
import AdminShell from "@/components/AdminShell";
import { offers } from "@/lib/offersData";
import { useAdminSession } from "@/lib/useAdminSession";
import {
  brl,
  clearOverrides,
  fetchOverrides,
  getOverrides,
  removeOverrides,
  saveOverrides,
  type PriceOverrides,
} from "@/lib/priceStore";

type DraftRow = { crmPrice: string; discountPrice: string };
type Draft = Record<string, DraftRow>;

function buildDraft(): Draft {
  const overrides = getOverrides();
  const draft: Draft = {};
  offers.forEach((offer) => {
    const override = overrides[offer.id];
    const crm = override?.crmPrice ?? offer.crmPrice;
    const por = override?.discountPrice !== undefined ? override.discountPrice : offer.discountPrice;
    draft[offer.id] = { crmPrice: brl(crm), discountPrice: por === null ? "" : brl(por) };
  });
  return draft;
}

function currencyDigitsToValue(value: string): number {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) / 100 : 0;
}

function parseCurrency(value: string): number | null {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) / 100 : null;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export default function Admin() {
  const auth = useAdminSession();

  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Draft>(() => buildDraft());
  const [savingPrices, setSavingPrices] = useState(false);

  const reloadPrices = useCallback(async () => {
    try {
      await fetchOverrides();
      setDraft(buildDraft());
    } catch {
      /* mantém o cache local */
    }
  }, []);

  useEffect(() => {
    if (!auth.session) return;
    reloadPrices();
  }, [auth.session, reloadPrices]);

  const filtered = useMemo(
    () => offers.filter((offer) => `${offer.model} ${offer.series} ${offer.segment}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const update = (id: string, field: keyof DraftRow, value: string) => {
    const digits = value.replace(/\D/g, "");
    const formatted = digits ? brl(currencyDigitsToValue(value)) : "";
    setDraft((current) => ({ ...current, [id]: { ...current[id], [field]: formatted } }));
  };

  const save = async () => {
    const current = getOverrides();
    const toUpsert: PriceOverrides = {};
    const toRemove: string[] = [];

    offers.forEach((offer) => {
      const row = draft[offer.id];
      if (!row) return;
      const crm = parseCurrency(row.crmPrice);
      const por = row.discountPrice.trim() === "" ? null : parseCurrency(row.discountPrice);
      if (crm === null || !Number.isFinite(crm) || crm < 0) return;
      const changed = crm !== offer.crmPrice || por !== offer.discountPrice;
      if (changed) {
        toUpsert[offer.id] = { crmPrice: crm, discountPrice: por };
      } else if (current[offer.id]) {
        toRemove.push(offer.id);
      }
    });

    setSavingPrices(true);
    try {
      if (toRemove.length > 0) await removeOverrides(toRemove);
      await saveOverrides(toUpsert);
      setDraft(buildDraft());
      const total = Object.keys(toUpsert).length + toRemove.length;
      toast(`${total} preço(s) atualizado(s).`);
    } catch (error) {
      toast(`Erro ao salvar: ${errorMessage(error)}`);
    } finally {
      setSavingPrices(false);
    }
  };

  const reset = async () => {
    try {
      await clearOverrides();
      setDraft(buildDraft());
      toast("Preços restaurados para o valor original.");
    } catch (error) {
      toast(`Erro ao restaurar: ${errorMessage(error)}`);
    }
  };

  return (
    <AdminShell
      auth={auth}
      active="prices"
      title="Preços das ofertas"
      meta={`${offers.length} ofertas`}
      actions={
        <>
          <button type="button" className="byd-admin-ghost" onClick={reset}><RotateCcw size={15} /> Restaurar</button>
          <button type="button" className="byd-admin-save" onClick={save} disabled={savingPrices}><Save size={15} /> {savingPrices ? "Salvando..." : "Salvar preços"}</button>
        </>
      }
    >
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
            <label className="byd-admin-price">
              <span className="byd-admin-price-label">De (R$)</span>
              <input
                type="text"
                inputMode="numeric"
                value={draft[offer.id]?.crmPrice ?? ""}
                onChange={(event) => update(offer.id, "crmPrice", event.target.value)}
              />
            </label>
            <label className="byd-admin-price">
              <span className="byd-admin-price-label">Por (R$)</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="sem desconto"
                value={draft[offer.id]?.discountPrice ?? ""}
                onChange={(event) => update(offer.id, "discountPrice", event.target.value)}
              />
            </label>
          </div>
        ))}
        {filtered.length === 0 && <p className="byd-admin-empty">Nenhuma oferta encontrada.</p>}
      </div>
    </AdminShell>
  );
}
