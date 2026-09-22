import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { CheckCircle2, ExternalLink, FileUp, Loader2, Lock, LogOut, RotateCcw, Save, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { offers } from "@/lib/offersData";
import { supabase } from "@/lib/supabase";
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
import {
  deleteLead,
  listLeads,
  setLeadStatus,
  type Lead,
  type LeadStatus,
} from "@/lib/leadStore";

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
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("admin@buy.com");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Draft>(() => buildDraft());
  const [savingPrices, setSavingPrices] = useState(false);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

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

  const refreshLeads = useCallback(async () => {
    setLoadingLeads(true);
    try {
      setLeads(await listLeads());
    } catch (error) {
      toast(`Erro ao carregar leads: ${errorMessage(error)}`);
    } finally {
      setLoadingLeads(false);
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
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    reloadPrices();
    refreshReleases();
    refreshLeads();
  }, [session, reloadPrices, refreshReleases, refreshLeads]);

  const filtered = useMemo(
    () => offers.filter((offer) => `${offer.model} ${offer.series} ${offer.segment}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      toast(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : error.message);
      return;
    }
    setPassword("");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setPassword("");
  };

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

  const handleLeadStatus = async (lead: Lead, status: LeadStatus) => {
    try {
      await setLeadStatus(lead.id, status);
      setLeads((current) => current.map((item) => (item.id === lead.id ? { ...item, status } : item)));
    } catch (error) {
      toast(`Erro ao atualizar lead: ${errorMessage(error)}`);
    }
  };

  const handleLeadDelete = async (lead: Lead) => {
    try {
      await deleteLead(lead.id);
      setLeads((current) => current.filter((item) => item.id !== lead.id));
      toast("Lead removido.");
    } catch (error) {
      toast(`Erro ao remover lead: ${errorMessage(error)}`);
    }
  };

  if (checking) {
    return (
      <main className="byd-admin-login">
        <div className="byd-admin-login-card">
          <Loader2 className="byd-admin-spin" size={24} />
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="byd-admin-login">
        <form className="byd-admin-login-card" onSubmit={login}>
          <span className="byd-admin-login-icon"><Lock size={22} /></span>
          <h1>Super Admin</h1>
          <p>Acesso restrito ao gerenciamento de preços e do app BYD.</p>
          <label>
            E-mail
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@buy.com" autoComplete="username" autoFocus required />
          </label>
          <label>
            Senha
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite a senha" autoComplete="current-password" required />
          </label>
          <button type="submit" disabled={busy}>{busy ? "Entrando..." : "Entrar"}</button>
        </form>
      </main>
    );
  }

  const activeRelease = releases.find((release) => release.isActive) ?? null;
  const activeUrl = resolveAppUrl(activeRelease);

  return (
    <main className="byd-admin">
      <header className="byd-admin-bar">
        <div className="byd-admin-bar-inner">
          <div className="byd-admin-brand">
            <span className="byd-admin-badge">Super Admin</span>
            <strong>Gerenciar preços e app</strong>
            <span className="byd-admin-count">{offers.length} ofertas</span>
          </div>
          <div className="byd-admin-bar-actions">
            <button type="button" className="byd-admin-ghost" onClick={reset}><RotateCcw size={15} /> Restaurar</button>
            <button type="button" className="byd-admin-save" onClick={save} disabled={savingPrices}><Save size={15} /> {savingPrices ? "Salvando..." : "Salvar preços"}</button>
            <button type="button" className="byd-admin-ghost" onClick={logout}><LogOut size={15} /> Sair</button>
          </div>
        </div>
      </header>

      <div className="byd-admin-body">
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
              <input
                type="text"
                inputMode="numeric"
                value={draft[offer.id]?.crmPrice ?? ""}
                onChange={(event) => update(offer.id, "crmPrice", event.target.value)}
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="sem desconto"
                value={draft[offer.id]?.discountPrice ?? ""}
                onChange={(event) => update(offer.id, "discountPrice", event.target.value)}
              />
            </div>
          ))}
          {filtered.length === 0 && <p className="byd-admin-empty">Nenhuma oferta encontrada.</p>}
        </div>

        <section className="byd-admin-leads">
          <h2 className="byd-admin-section-title">Leads — Oferta Selecionada <span>{leads.length} lead(s)</span></h2>
          {loadingLeads ? (
            <p className="byd-admin-empty"><Loader2 className="byd-admin-spin" size={18} /></p>
          ) : leads.length === 0 ? (
            <p className="byd-admin-empty">Nenhum lead recebido ainda.</p>
          ) : (
            <div className="byd-admin-table">
              <div className="byd-admin-lead byd-admin-lead-head">
                <span>Contato</span>
                <span>Telefone / E-mail</span>
                <span>Modelo</span>
                <span>Local</span>
                <span>Status</span>
              </div>
              {leads.map((lead) => (
                <div className="byd-admin-lead" key={lead.id}>
                  <div>
                    <strong>{lead.firstName} {lead.lastName}</strong>
                    <small>{lead.personType === "fisica" ? "CPF" : "CNPJ"} {lead.document} · {formatDate(lead.createdAt)}</small>
                  </div>
                  <div>
                    <small>{lead.phone}</small>
                    <small>{lead.email}</small>
                  </div>
                  <span className="byd-admin-lead-model">{lead.model ?? "—"}</span>
                  <div>
                    <small>{[lead.city, lead.state].filter(Boolean).join(" / ") || "—"}</small>
                    {lead.cep ? <small>CEP {lead.cep}</small> : null}
                    {lead.details ? <small>{lead.details}</small> : null}
                  </div>
                  <div className="byd-admin-lead-actions">
                    <select value={lead.status} onChange={(event) => handleLeadStatus(lead, event.target.value as LeadStatus)}>
                      <option value="novo">Novo</option>
                      <option value="em_contato">Em contato</option>
                      <option value="convertido">Convertido</option>
                      <option value="descartado">Descartado</option>
                    </select>
                    <button type="button" className="byd-admin-danger" onClick={() => handleLeadDelete(lead)}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
