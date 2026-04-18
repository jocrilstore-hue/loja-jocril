import AdminShell from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminShell";
import { adminGhost, adminPrimary } from "@/components/admin/styles";
import { PageHeader, SettingsTabs } from "@/components/admin/SettingsHelpers";
import Link from "next/link";

const store = {
  name: "Jocril — Sociedade Transformadora de Acrílicos, Lda.",
  domain: "jocril.pt", currency: "EUR (€)", locale: "pt-PT",
  nif: "500 842 160", email: "apoio@jocril.pt",
};

const groups = [
  { kicker: "01", title: "Configuração comercial", cards: [
    { k: "ship",      label: "Envios e zonas",         hint: "3 zonas · 4 transportadoras · €150 limiar grátis", href: "/admin/definicoes/envios",    status: "Ativo" },
    { k: "tiers",     label: "Escalões de preço",      hint: "5 escalões B2B · -5% a -22%",                       href: "/admin/definicoes/escaloes",  status: "Ativo" },
    { k: "discounts", label: "Códigos de desconto",    hint: "12 campanhas · 2 ativas",                            href: "/admin/definicoes/descontos", status: "2 ativos" },
    { k: "taxes",     label: "IVA e impostos",          hint: "Taxa normal 23% · Isenção intra-UE",               href: "/admin/definicoes/impostos",  status: "Ativo" },
  ]},
  { kicker: "02", title: "Operações", cards: [
    { k: "team",     label: "Equipa · Utilizadores",  hint: "7 utilizadores · 3 perfis",              href: "/admin/definicoes/equipa", status: "Ativo" },
    { k: "email",    label: "Notificações por email", hint: "9 templates · Resend",                   href: "#",                        status: "Ativo" },
    { k: "webhooks", label: "Webhooks e integrações", hint: "Stripe · CTT · Phc Contabilidade",       href: "#",                        status: "3 ligações" },
    { k: "api",      label: "API keys",               hint: "2 tokens ativos · expira em 90d",        href: "#",                        status: "2 tokens" },
  ]},
];

function Row({ label, hint, value, last }: { label: string; hint: string; value: string; last?: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 32, padding: "18px 0", borderBottom: last ? "none" : "1px dashed var(--color-base-900)" }}>
      <div>
        <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)", letterSpacing: "-.02em" }}>{label}</div>
        <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 4, lineHeight: 1.5 }}>{hint}</div>
      </div>
      <div style={{ display: "inline-flex", alignItems: "stretch", border: "1px solid var(--color-base-800)", borderRadius: 2, background: "var(--color-dark-base-primary)" }}>
        <input defaultValue={value} style={{ flex: 1, padding: "9px 12px", background: "transparent", border: "none", outline: "none", color: "var(--color-light-base-primary)", fontFamily: "var(--font-geist-sans)", fontSize: 14, letterSpacing: "-.015em" }}/>
      </div>
    </div>
  );
}

export default function AdminDefinicoesPage() {
  return (
    <AdminShell active="settings" breadcrumbs={["Admin", "Definições"]}>
      <PageHeader
        title="Definições"
        lede="Configurações gerais da loja Jocril. Estas alterações aplicam-se a todas as encomendas novas a partir do momento da gravação."
        actions={<>
          <button style={adminGhost}>Log de alterações</button>
          <button style={adminPrimary}>Guardar</button>
        </>}
      />
      <SettingsTabs active="overview" />

      <AdminCard title="Identidade da loja">
        <div style={{ padding: "2px 18px" }}>
          <Row label="Nome legal"    hint="Apresentado em faturas e documentos fiscais." value={store.name} />
          <Row label="NIF"           hint="Número de identificação fiscal."               value={store.nif} />
          <Row label="Domínio"       hint="URL canónico da loja online."                  value={store.domain} />
          <Row label="Email de apoio" hint="Para onde chegam respostas dos clientes."     value={store.email} />
          <Row label="Moeda"         hint="Moeda de apresentação e cobrança."             value={store.currency} />
          <Row label="Idioma"        hint="Idioma padrão do website e emails."            value={store.locale} last />
        </div>
      </AdminCard>

      {groups.map(g => (
        <div key={g.kicker} style={{ marginTop: 32 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14 }}>
            <span className="text-mono-xs" style={{ color: "var(--color-accent-100)" }}>● {g.kicker}</span>
            <h2 style={{ margin: 0, fontFamily: "var(--font-geist-sans)", fontSize: 18, letterSpacing: "-.025em", color: "var(--color-light-base-primary)" }}>{g.title}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {g.cards.map(c => (
              <Link key={c.k} href={c.href} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "center", padding: "20px 22px", border: "1px dashed var(--color-base-800)", borderRadius: 4, background: "var(--color-dark-base-secondary)", textDecoration: "none" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 16, letterSpacing: "-.02em", color: "var(--color-light-base-primary)" }}>{c.label}</span>
                    <span className="text-mono-xs" style={{ padding: "2px 8px", border: "1px solid var(--color-base-800)", borderRadius: 2, color: "var(--color-accent-300)" }}>● {c.status}</span>
                  </div>
                  <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 6 }}>{c.hint}</div>
                </div>
                <span style={{ color: "var(--color-base-600)", fontSize: 18 }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </AdminShell>
  );
}
