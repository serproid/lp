import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ExternalLink, FileUp, Loader2, RotateCcw, Save, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AdminShell from "@/components/AdminShell";
import { offers } from "@/lib/offersData";
import { useAdminSession } from "@/lib/useAdminSession";
import {
  deleteRelease,
  listReleases,
  resolveAppUrl,
  saveAppLink,
  setActiveRelease,
  uploadApp,
  type AppPlatform,
  type AppRelease,
} from "@/lib/appStore";
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

function formatBytes(bytes: number | null) {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export default function Admin() {
  const auth = useAdminSession();

  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Draft>(() => buildDraft());
  const [savingPrices, setSavingPrices] = useState(false);

  const [releases, setReleases] = useState<AppRelease[]>([]);
  const [platform, setPlatform] = useState<AppPlatform>("android");
  const [version, setVersion] = useState("");
  const [notes, setNotes] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshReleases = useCallback(async () => {
    try {
      setReleases(await listReleases());
    } catch (error) {
      toast(`Erro ao carregar apps: ${errorMessage(error)}`);
    }
  }, []);

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
    refreshReleases();
  }, [auth.session, reloadPrices, refreshReleases]);

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

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file) {
      toast("Selecione o arquivo do app.");
      return;
    }
    setUploading(true);
    try {
      await uploadApp(file, { platform, version: version.trim(), notes: notes.trim() });
      clearFile();
      setVersion("");
      setNotes("");
      await refreshReleases();
      toast("App enviado e publicado.");
    } catch (error) {
      toast(`Erro no upload: ${errorMessage(error)}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveLink = async () => {
    if (!linkUrl.trim()) {
      toast("Informe a URL do app.");
      return;
    }
    setUploading(true);
    try {
      await saveAppLink({ platform, version: version.trim(), url: linkUrl.trim(), notes: notes.trim() });
      setLinkUrl("");
      setVersion("");
      setNotes("");
      await refreshReleases();
      toast("Link do app publicado.");
    } catch (error) {
      toast(`Erro ao salvar link: ${errorMessage(error)}`);
    } finally {
      setUploading(false);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await setActiveRelease(id);
      await refreshReleases();
      toast("Release ativo atualizado.");
    } catch (error) {
      toast(`Erro ao ativar: ${errorMessage(error)}`);
    }
  };

  const handleDelete = async (release: AppRelease) => {
    try {
      await deleteRelease(release);
      await refreshReleases();
      toast("Release removido.");
    } catch (error) {
      toast(`Erro ao remover: ${errorMessage(error)}`);
    }
  };

  const activeRelease = releases.find((release) => release.isActive) ?? null;
  const activeUrl = resolveAppUrl(activeRelease);

  return (
    <AdminShell
      auth={auth}
      active="prices"
      title="Gerenciar preços e app"
      meta={`${offers.length} ofertas`}
      actions={
        <>
          <button type="button" className="byd-admin-ghost" onClick={reset}><RotateCcw size={15} /> Restaurar</button>
          <button type="button" className="byd-admin-save" onClick={save} disabled={savingPrices}><Save size={15} /> {savingPrices ? "Salvando..." : "Salvar preços"}</button>
        </>
      }
    >
      <section className="byd-admin-app">
        <div className="byd-admin-app-copy">
          <strong>App BYD — arquivo para download</strong>
          <p>Envie o arquivo (.apk/.ipa) ou informe um link. O release ativo é usado nos botões de download da simulação.</p>
        </div>

        <div className="byd-admin-app-grid">
          <div className="byd-admin-app-form">
            <select value={platform} onChange={(event) => setPlatform(event.target.value as AppPlatform)}>
              <option value="android">Android</option>
              <option value="ios">iOS</option>
              <option value="web">Web</option>
            </select>
            <input type="text" value={version} onChange={(event) => setVersion(event.target.value)} placeholder="Versão (ex: 1.2.0)" />
            <input type="text" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Observações (opcional)" />
          </div>

          <div className="byd-admin-app-form">
            <input ref={fileInputRef} className="byd-admin-file" type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            <button type="button" className="byd-admin-save" onClick={handleUpload} disabled={uploading}>
              {uploading ? <Loader2 className="byd-admin-spin" size={15} /> : <FileUp size={15} />} Enviar app
            </button>
          </div>

          <div className="byd-admin-app-form">
            <input type="text" value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} placeholder="Ou cole um link (Play Store / App Store)" />
            <button type="button" className="byd-admin-ghost byd-admin-ghost-dark" onClick={handleSaveLink} disabled={uploading}><ExternalLink size={15} /> Publicar link</button>
          </div>
        </div>

        {activeUrl ? (
          <p className="byd-admin-app-active">
            <CheckCircle2 size={15} /> Link ativo: <a href={activeUrl} target="_blank" rel="noreferrer">{activeUrl}</a>
          </p>
        ) : null}

        <div className="byd-admin-releases">
          {releases.length === 0 ? (
            <p className="byd-admin-empty">Nenhum app publicado ainda.</p>
          ) : (
            releases.map((release) => (
              <div className="byd-admin-release" key={release.id}>
                <div className="byd-admin-release-info">
                  <strong>
                    {release.platform}{release.version ? ` · v${release.version}` : ""}
                    {release.isActive ? <span className="byd-admin-pill">Ativo</span> : null}
                  </strong>
                  <small>
                    {release.fileName ?? release.downloadUrl ?? "—"}
                    {release.fileSize ? ` · ${formatBytes(release.fileSize)}` : ""} · {formatDate(release.createdAt)}
                  </small>
                </div>
                <div className="byd-admin-release-actions">
                  {resolveAppUrl(release) ? <a href={resolveAppUrl(release)} target="_blank" rel="noreferrer">Abrir</a> : null}
                  {!release.isActive ? <button type="button" onClick={() => handleActivate(release.id)}>Ativar</button> : null}
                  <button type="button" className="byd-admin-danger" onClick={() => handleDelete(release)}><Trash2 size={14} /> Excluir</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

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
