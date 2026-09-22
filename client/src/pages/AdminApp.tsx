import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, ExternalLink, FileUp, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AdminShell from "@/components/AdminShell";
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

export default function AdminApp() {
  const auth = useAdminSession();

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

  useEffect(() => {
    if (!auth.session) return;
    refreshReleases();
  }, [auth.session, refreshReleases]);

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
    <AdminShell auth={auth} active="app" title="App BYD" meta={`${releases.length} release(s)`}>
      <section className="byd-admin-app">
        <div className="byd-admin-app-copy">
          <strong>Arquivo para download</strong>
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
    </AdminShell>
  );
}
