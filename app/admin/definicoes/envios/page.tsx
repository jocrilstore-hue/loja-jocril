"use client";

import AdminShell from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminShell";
import { adminGhost, adminPrimary } from "@/components/admin/styles";
import { PageHeader, SettingsTabs, FormRow, AdminInput, AdminToggle } from "@/components/admin/SettingsHelpers";

const zones = [
  { id: "PT-continental", name: "Portugal continental",   postal: "1000–4999",    carriers: 3, rate: "€ 6,90",       free: "≥ €150", enabled: true },
  { id: "PT-ilhas",       name: "Ilhas · Madeira e Açores", postal: "9000–9999",  carriers: 1, rate: "€ 14,50",      free: "≥ €300", enabled: true },
  { id: "ES",             name: "Espanha peninsular",     postal: "01000–52999",  carriers: 2, rate: "€ 12,00",       free: "≥ €250", enabled: true },
  { id: "EU",             name: "União Europeia",         postal: "Diversos",     carriers: 1, rate: "€ 22,00",       free: "—",       enabled: true },
  { id: "UK-CH",          name: "Reino Unido · Suíça",   postal: "Orçamento",    carriers: 1, rate: "Por orçamento", free: "—",       enabled: false },
  { id: "pickup",         name: "Levantar na fábrica",   postal: "2415 Leiria",  carriers: 0, rate: "Grátis",        free: "—",       enabled: true },
];

const carriers = [
  { name: "DPD Portugal",  srv: "Classic · Express",  zones: "PT · ES",    status: "Ativo" },
  { name: "CTT Expresso",  srv: "13h00 · EMS",         zones: "PT · Ilhas", status: "Ativo" },
  { name: "SEUR",          srv: "24h · 48h",           zones: "PT · ES",    status: "Ativo" },
  { name: "DHL Express",   srv: "WorldWide",           zones: "UE · UK",    status: "Ativo" },
];

const hdrs = ["Zona", "Código postal", "Transp.", "Preço", "Portes grátis", "Estado", ""];
const carrierHdrs = ["Transportadora", "Serviços", "Zonas", "Estado", ""];

export default function AdminDefinicoesEnviosPage() {
  return (
    <AdminShell active="ship" breadcrumbs={["Admin", "Definições", "Envios e zonas"]}>
      <PageHeader
        title="Envios e zonas"
        lede="Zonas geográficas, transportadoras associadas e preço base por zona. Os preços podem ser sobrepostos em campanhas ou escalões de preço."
        actions={<>
          <button style={adminGhost}>Importar</button>
          <button style={adminPrimary}>+ Nova zona</button>
        </>}
      />
      <SettingsTabs active="shipping" />

      <AdminCard title="Zonas de entrega" right={<span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>{zones.length} zonas · {zones.filter(z => z.enabled).length} ativas</span>}>
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 90px 100px 100px 90px 40px", padding: "12px 18px", borderBottom: "1px dashed var(--color-base-800)", background: "var(--color-dark-base-primary)" }}>
            {hdrs.map(h => <span key={h} className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>{h}</span>)}
          </div>
          {zones.map((z, i) => (
            <div key={z.id} style={{ display: "grid", gridTemplateColumns: "1fr 140px 90px 100px 100px 90px 40px", alignItems: "center", padding: "14px 18px", borderBottom: i < zones.length - 1 ? "1px dashed var(--color-base-900)" : "none" }}>
              <div>
                <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)", letterSpacing: "-.015em" }}>{z.name}</div>
                <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 3 }}>{z.id}</div>
              </div>
              <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>{z.postal}</span>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "var(--color-base-300)" }}>{z.carriers}</span>
              <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)" }}>{z.rate}</span>
              <span className="text-mono-xs" style={{ color: "var(--color-accent-300)" }}>{z.free}</span>
              <AdminToggle on={z.enabled}/>
              <span style={{ color: "var(--color-base-600)", cursor: "pointer" }}>⋯</span>
            </div>
          ))}
        </div>
      </AdminCard>

      <div style={{ marginTop: 32 }}>
        <AdminCard title="Transportadoras">
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.4fr 1fr 1fr 40px", padding: "12px 18px", borderBottom: "1px dashed var(--color-base-800)", background: "var(--color-dark-base-primary)" }}>
              {carrierHdrs.map(h => <span key={h} className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>{h}</span>)}
            </div>
            {carriers.map((c, i) => (
              <div key={c.name} style={{ display: "grid", gridTemplateColumns: "1.4fr 1.4fr 1fr 1fr 40px", alignItems: "center", padding: "14px 18px", borderBottom: i < carriers.length - 1 ? "1px dashed var(--color-base-900)" : "none" }}>
                <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)", letterSpacing: "-.015em" }}>{c.name}</div>
                <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>{c.srv}</span>
                <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>{c.zones}</span>
                <span className="text-mono-xs" style={{ color: "var(--color-accent-300)" }}>● {c.status}</span>
                <span style={{ color: "var(--color-base-600)", cursor: "pointer" }}>⋯</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      <div style={{ marginTop: 32 }}>
        <AdminCard title="Regras globais">
          <div style={{ padding: "2px 18px" }}>
            <FormRow label="Limiar de portes grátis" hint="Aplicado a Portugal continental. Valor sem IVA.">
              <AdminInput value="150,00" width={140} suffix="€"/>
            </FormRow>
            <FormRow label="Preparação em armazém" hint="Tempo médio entre confirmação e expedição.">
              <AdminInput value="24–48h úteis" width={220}/>
            </FormRow>
            <FormRow label="Peso máximo por volume" hint="Acima deste valor, envio por pallet.">
              <AdminInput value="30" width={100} suffix="kg"/>
            </FormRow>
            <FormRow label="Levantar na fábrica" hint="Permitir opção de recolha presencial em Leiria." last>
              <AdminToggle on={true} label="Disponível · Seg–Sex, 09h–18h"/>
            </FormRow>
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
