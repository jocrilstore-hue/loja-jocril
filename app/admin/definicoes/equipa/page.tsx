"use client";

import AdminShell from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminShell";
import { adminDisabled } from "@/components/admin/styles";
import { PageHeader, SettingsTabs, FormRow, AdminInput, AdminToggle } from "@/components/admin/SettingsHelpers";

const users = [
  { name: "Maria Inácio",      email: "maria@jocril.pt",      role: "Administrador",  last: "agora",                    avatar: "MI", color: "var(--color-accent-100)",  pending: false },
  { name: "João Pedro Silva",  email: "joao@jocril.pt",       role: "Gestor",          last: "há 2h",                    avatar: "JP", color: "var(--color-accent-300)",  pending: false },
  { name: "Ana Costa",         email: "ana.costa@jocril.pt",  role: "Operador",        last: "há 35 min",                avatar: "AC", color: "var(--color-base-400)",    pending: false },
  { name: "Tiago Alves",       email: "tiago@jocril.pt",      role: "Operador",        last: "há 4h",                    avatar: "TA", color: "var(--color-base-400)",    pending: false },
  { name: "Rita Mendes",       email: "rita@jocril.pt",       role: "Apoio cliente",   last: "há 18 min",                avatar: "RM", color: "var(--color-base-400)",    pending: false },
  { name: "Nuno Fernandes",    email: "nuno@jocril.pt",       role: "Gestor",          last: "ontem",                    avatar: "NF", color: "var(--color-accent-300)",  pending: false },
  { name: "(convite pendente)", email: "paula@jocril.pt",     role: "Operador",        last: "convite enviado há 2 dias", avatar: "·",  color: "var(--color-base-700)",    pending: true },
];

const roles = [
  { name: "Administrador", count: 1, perms: ["Acesso total", "Gerir utilizadores", "Configurações", "Financeiro"] },
  { name: "Gestor",         count: 2, perms: ["Encomendas", "Produtos", "Clientes", "Relatórios", "Descontos"] },
  { name: "Operador",       count: 3, perms: ["Ver encomendas", "Editar estado", "Imprimir etiquetas"] },
  { name: "Apoio cliente",  count: 1, perms: ["Ver encomendas", "Ver clientes", "Criar notas internas"] },
];

const hdrs = ["", "Nome", "Email", "Perfil", "Último acesso", ""];

export default function AdminDefinicoesEquipaPage() {
  return (
    <AdminShell active="team" breadcrumbs={["Admin", "Definições", "Equipa"]}>
      <PageHeader
        title="Equipa e utilizadores"
        lede="Vista de leitura dos utilizadores com acesso ao backoffice. Convites, exportação e regras de segurança ainda não estão ligados."
        actions={<>
          <button style={adminDisabled} disabled title="Exportação ainda não ligada">Exportar</button>
          <button style={adminDisabled} disabled title="Convites ainda não ligados">+ Convidar utilizador</button>
        </>}
      />
      <SettingsTabs active="team" />

      <AdminCard title="Utilizadores" right={<span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>{users.filter(u => !u.pending).length} ativos · 1 pendente</span>}>
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "44px 1.5fr 1.5fr 1fr 160px 40px", padding: "12px 18px", borderBottom: "1px dashed var(--color-base-800)", background: "var(--color-dark-base-primary)" }}>
            {hdrs.map(h => <span key={h} className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>{h}</span>)}
          </div>
          {users.map((u, i) => (
            <div key={u.email} style={{ display: "grid", gridTemplateColumns: "44px 1.5fr 1.5fr 1fr 160px 40px", alignItems: "center", padding: "14px 18px", borderBottom: i < users.length - 1 ? "1px dashed var(--color-base-900)" : "none", opacity: u.pending ? 0.65 : 1 }}>
              <div style={{ width: 32, height: 32, borderRadius: 999, background: u.color, color: u.pending ? "var(--color-base-400)" : "var(--color-dark-base-primary)", display: "grid", placeItems: "center", fontFamily: "var(--font-geist-mono)", fontSize: 11 }}>{u.avatar}</div>
              <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)", letterSpacing: "-.015em" }}>{u.name}</span>
              <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>{u.email}</span>
              <span className="text-mono-xs" style={{ color: "var(--color-accent-300)", padding: "2px 8px", border: "1px solid var(--color-base-800)", borderRadius: 2, width: "fit-content" }}>{u.role}</span>
              <span className="text-mono-xs" style={{ color: u.pending ? "var(--color-accent-300)" : "var(--color-base-500)" }}>{u.pending ? "● " : ""}{u.last}</span>
              <span title="Edição ainda não ligada" style={{ color: "var(--color-base-700)", cursor: "not-allowed" }}>⋯</span>
            </div>
          ))}
        </div>
      </AdminCard>

      <div style={{ marginTop: 32 }}>
        <AdminCard title="Perfis e permissões" right={<button style={adminDisabled} disabled title="Criação de perfis ainda não ligada">+ Novo perfil</button>}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, padding: 18 }}>
            {roles.map(r => (
              <div key={r.name} style={{ border: "1px dashed var(--color-base-800)", borderRadius: 4, padding: 18, background: "var(--color-dark-base-primary)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 15, color: "var(--color-light-base-primary)", letterSpacing: "-.02em" }}>{r.name}</span>
                  <span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>{r.count} utiliz.</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {r.perms.map(p => <span key={p} className="text-mono-xs" style={{ padding: "3px 8px", border: "1px solid var(--color-base-800)", borderRadius: 2, color: "var(--color-base-400)" }}>{p}</span>)}
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      <div style={{ marginTop: 32 }}>
        <AdminCard title="Segurança">
          <div style={{ padding: "2px 18px" }}>
            <FormRow label="2FA obrigatório" hint="Exigir autenticação de dois fatores para Administradores e Gestores.">
              <AdminToggle on={true} disabled title="Regra ainda não persistida"/>
            </FormRow>
            <FormRow label="Sessão expira após" hint="Tempo de inatividade antes de pedir novo login.">
              <AdminInput value="30" width={100} suffix="min" readOnly title="Leitura apenas nesta versão"/>
            </FormRow>
            <FormRow label="IPs permitidos" hint="Opcional. Restringe acesso ao backoffice a redes específicas." last>
              <AdminInput value="Todos os IPs · sem restrição" width={360} readOnly title="Leitura apenas nesta versão"/>
            </FormRow>
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
