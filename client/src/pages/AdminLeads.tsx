import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, MessageCircle, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AdminShell from "@/components/AdminShell";
import { useAdminSession } from "@/lib/useAdminSession";
import { deleteLead, listLeads, setLeadStatus, type Lead, type LeadStatus } from "@/lib/leadStore";
import { whatsappLinkTo } from "@/lib/whatsapp";

const statusLabels: Record<LeadStatus, string> = {
  novo: "Novo",
  em_contato: "Em contato",
  convertido: "Convertido",
  descartado: "Descartado",
};

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export default function AdminLeads() {
  const auth = useAdminSession();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | LeadStatus>("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setLeads(await listLeads());
    } catch (error) {
      toast(`Erro ao carregar leads: ${errorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!auth.session) return;
    refresh();
  }, [auth.session, refresh]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (statusFilter && lead.status !== statusFilter) return false;
      if (!term) return true;
      const haystack = `${lead.firstName} ${lead.lastName} ${lead.email} ${lead.phone} ${lead.document} ${lead.model ?? ""} ${lead.city ?? ""} ${lead.state ?? ""}`;
      return haystack.toLowerCase().includes(term);
    });
  }, [leads, query, statusFilter]);

  const handleStatus = async (lead: Lead, status: LeadStatus) => {
    try {
      await setLeadStatus(lead.id, status);
      setLeads((current) => current.map((item) => (item.id === lead.id ? { ...item, status } : item)));
    } catch (error) {
      toast(`Erro ao atualizar lead: ${errorMessage(error)}`);
    }
  };

  const handleDelete = async (lead: Lead) => {
    try {
      await deleteLead(lead.id);
      setLeads((current) => current.filter((item) => item.id !== lead.id));
      toast("Lead removido.");
    } catch (error) {
      toast(`Erro ao remover lead: ${errorMessage(error)}`);
    }
  };

  return (
    <AdminShell auth={auth} active="leads" title="Leads capturados" meta={`${leads.length} lead(s)`}>
      <div className="byd-admin-leads-toolbar">
        <label className="byd-admin-search">
          <Search size={16} />
          <input placeholder="Buscar por nome, e-mail, telefone ou modelo" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <select className="byd-admin-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "" | LeadStatus)}>
          <option value="">Todos os status</option>
          <option value="novo">Novo</option>
          <option value="em_contato">Em contato</option>
          <option value="convertido">Convertido</option>
          <option value="descartado">Descartado</option>
        </select>
      </div>

      {loading ? (
        <p className="byd-admin-empty"><Loader2 className="byd-admin-spin" size={18} /></p>
      ) : filtered.length === 0 ? (
        <p className="byd-admin-empty">{leads.length === 0 ? "Nenhum lead recebido ainda." : "Nenhum lead encontrado para o filtro."}</p>
      ) : (
        <div className="byd-admin-leads-list">
          {filtered.map((lead) => (
            <article className="byd-admin-lead-card" key={lead.id}>
              <header>
                <div>
                  <strong>{lead.firstName} {lead.lastName}</strong>
                  <small>{formatDate(lead.createdAt)}</small>
                </div>
                <span className={`byd-admin-status is-${lead.status}`}>{statusLabels[lead.status]}</span>
              </header>

              <div className="byd-admin-lead-grid">
                <div>
                  <span>Telefone</span>
                  <strong>{lead.phone}</strong>
                </div>
                <div>
                  <span>E-mail</span>
                  <strong>{lead.email}</strong>
                </div>
                <div>
                  <span>{lead.personType === "fisica" ? "CPF" : "CNPJ"}</span>
                  <strong>{lead.document}</strong>
                </div>
                <div>
                  <span>Modelo</span>
                  <strong>{lead.model ?? "—"}</strong>
                </div>
                <div>
                  <span>Local</span>
                  <strong>{[lead.city, lead.state].filter(Boolean).join(" / ") || "—"}</strong>
                </div>
                {lead.cep ? (
                  <div>
                    <span>CEP</span>
                    <strong>{lead.cep}</strong>
                  </div>
                ) : null}
              </div>

              {lead.details ? <p className="byd-admin-lead-details">{lead.details}</p> : null}

              <footer>
                <a
                  href={whatsappLinkTo(lead.phone, `Olá ${lead.firstName}! Sou da equipe BYD e vi seu interesse no ${lead.model ?? "veículo"}. Podemos falar?`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
                <select value={lead.status} onChange={(event) => handleStatus(lead, event.target.value as LeadStatus)}>
                  <option value="novo">Novo</option>
                  <option value="em_contato">Em contato</option>
                  <option value="convertido">Convertido</option>
                  <option value="descartado">Descartado</option>
                </select>
                <button type="button" className="byd-admin-danger" onClick={() => handleDelete(lead)}><Trash2 size={14} /> Excluir</button>
              </footer>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
