import { useState, type FormEvent, type ReactNode } from "react";
import { LayoutDashboard, Loader2, Lock, LogOut, Users } from "lucide-react";
import { Link } from "wouter";
import type { AdminSession } from "@/lib/useAdminSession";

type AdminShellProps = {
  auth: AdminSession;
  active: "prices" | "leads";
  title: string;
  meta?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export default function AdminShell({ auth, active, title, meta, actions, children }: AdminShellProps) {
  const [email, setEmail] = useState("admin@buy.com");
  const [password, setPassword] = useState("");

  if (auth.checking) {
    return (
      <main className="byd-admin-login">
        <div className="byd-admin-login-card">
          <Loader2 className="byd-admin-spin" size={24} />
        </div>
      </main>
    );
  }

  if (!auth.session) {
    const submit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const ok = await auth.signIn(email, password);
      if (ok) setPassword("");
    };
    return (
      <main className="byd-admin-login">
        <form className="byd-admin-login-card" onSubmit={submit}>
          <span className="byd-admin-login-icon"><Lock size={22} /></span>
          <h1>Super Admin</h1>
          <p>Acesso restrito ao gerenciamento de preços, do app e dos leads.</p>
          <label>
            E-mail
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@buy.com" autoComplete="username" autoFocus required />
          </label>
          <label>
            Senha
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite a senha" autoComplete="current-password" required />
          </label>
          <button type="submit" disabled={auth.busy}>{auth.busy ? "Entrando..." : "Entrar"}</button>
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
            <strong>{title}</strong>
            {meta ? <span className="byd-admin-count">{meta}</span> : null}
          </div>
          <nav className="byd-admin-nav" aria-label="Seções do painel">
            <Link href="/admin" className={`byd-admin-tab ${active === "prices" ? "is-active" : ""}`}><LayoutDashboard size={16} /> Preços e app</Link>
            <Link href="/admin/leads" className={`byd-admin-tab ${active === "leads" ? "is-active" : ""}`}><Users size={16} /> Leads</Link>
          </nav>
          <div className="byd-admin-bar-actions">
            {actions}
            <button type="button" className="byd-admin-ghost" onClick={() => auth.signOut()}><LogOut size={15} /> Sair</button>
          </div>
        </div>
      </header>
      <div className="byd-admin-body">{children}</div>
    </main>
  );
}
