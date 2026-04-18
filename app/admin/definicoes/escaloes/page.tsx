"use client";

import AdminShell from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminShell";
import { adminGhost, adminPrimary } from "@/components/admin/styles";
import { PageHeader, SettingsTabs, FormRow, AdminInput, AdminToggle } from "@/components/admin/SettingsHelpers";

const tiers = [
  { id: "T0", label: "Particular",                  discount: 0,   minOrder: "€ 0",      customers: 584, color: "var(--color-base-600)" },
  { id: "T1", label: "Retalhista",                  discount: -5,  minOrder: "€ 500",    customers: 42,  color: "var(--color-accent-300)" },
  { id: "T2", label: "Profissional",                discount: -12, minOrder: "€ 1 500",  customers: 23,  color: "var(--color-accent-100)" },
  { id: "T3", label: "Grandes contas",              discount: -18, minOrder: "€ 5 000",  customers: 8,   color: "var(--color-accent-100)" },
  { id: "T4", label: "Parceria · Distribuidor",     discount: -22, minOrder: "Negociado",customers: 3,   color: "var(--color-accent-100)" },
];

const totalCustomers = tiers.reduce((s, t) => s + t.customers, 0);

const stats: [string, string | number][] = [
  ["Escalões", tiers.length],
  ["Clientes atribuídos", totalCustomers],
  ["Desconto médio", "-7,8%"],
  ["Impacto mensal", "-€ 4.320"],
];

const hdrs = ["Código", "Designação", "Desconto", "Mínimo mensal", "Clientes", "Estado", ""];

export default function AdminDefinicoesEscaloesPage() {
  return (
    <AdminShell active="tiers" breadcrumbs={["Admin", "Definições", "Escalões de preço"]}>
      <PageHeader
        title="Escalões de preço"
        lede="Desconto automático aplicado a clientes consoante o seu escalão. Atribuído manualmente na ficha de cliente ou por volume anual de compras."
        actions={<>
          <button style={adminGhost}>Exportar</button>
          <button style={adminPrimary}>+ Novo escalão</button>
        </>}
      />
      <SettingsTabs active="tiers" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {stats.map(([l, v]) => (
          <div key={l} style={{ padding: "14px 16px", border: "1px dashed var(--color-base-800)", borderRadius: 4, background: "var(--color-dark-base-secondary)" }}>
            <div className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>{l}</div>
            <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 26, letterSpacing: "-.03em", color: "var(--color-light-base-primary)", marginTop: 6 }}>{v}</div>
          </div>
        ))}
      </div>

      <AdminCard title="Escalões configurados">
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 140px 160px 120px 90px 40px", padding: "12px 18px", borderBottom: "1px dashed var(--color-base-800)", background: "var(--color-dark-base-primary)" }}>
            {hdrs.map(h => <span key={h} className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>{h}</span>)}
          </div>
          {tiers.map((t, i) => (
            <div key={t.id} style={{ display: "grid", gridTemplateColumns: "80px 1fr 140px 160px 120px 90px 40px", alignItems: "center", padding: "14px 18px", borderBottom: i < tiers.length - 1 ? "1px dashed var(--color-base-900)" : "none" }}>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: t.color, padding: "3px 8px", border: `1px solid ${t.color}`, borderRadius: 2, width: "fit-content" }}>{t.id}</span>
              <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)", letterSpacing: "-.015em" }}>{t.label}</div>
              <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 20, letterSpacing: "-.03em", color: t.discount === 0 ? "var(--color-base-500)" : "var(--color-accent-100)" }}>{t.discount}%</span>
              <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>{t.minOrder}</span>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "var(--color-base-300)" }}>{t.customers}</span>
              <AdminToggle on={true}/>
              <span style={{ color: "var(--color-base-600)", cursor: "pointer" }}>⋯</span>
            </div>
          ))}
        </div>
      </AdminCard>

      <div style={{ marginTop: 32 }}>
        <AdminCard title="Promoção automática de escalão">
          <div style={{ padding: "2px 18px" }}>
            <FormRow label="Ativar promoção automática" hint="Clientes sobem de escalão automaticamente ao atingir o volume anual definido.">
              <AdminToggle on={true}/>
            </FormRow>
            <FormRow label="Período de avaliação" hint="Volume de compras acumulado durante este período.">
              <AdminInput value="12" width={80} suffix="meses"/>
            </FormRow>
            <FormRow label="Notificar cliente" hint="Email automático quando o escalão é promovido.">
              <AdminToggle on={true} label="Com template T1→T2, T2→T3, etc."/>
            </FormRow>
            <FormRow label="Requer aprovação humana" hint="T3 e T4 exigem confirmação de um gestor comercial." last>
              <AdminToggle on={true}/>
            </FormRow>
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
