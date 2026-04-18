"use client";

import AdminShell from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminShell";
import { adminGhost, adminPrimary } from "@/components/admin/styles";
import { PageHeader, SettingsTabs, FormRow, AdminInput, AdminToggle } from "@/components/admin/SettingsHelpers";

const rates = [
  { code: "NORMAL",   label: "Taxa normal",         value: 23, region: "Continente",            usage: "Maioria dos produtos" },
  { code: "INTER",    label: "Taxa intermédia",      value: 13, region: "Continente",            usage: "Alimentação específica" },
  { code: "REDUZIDA", label: "Taxa reduzida",        value: 6,  region: "Continente",            usage: "Livros · bens essenciais" },
  { code: "MADEIRA",  label: "Taxa normal",          value: 22, region: "Madeira",               usage: "Produtos expedidos p/ Madeira" },
  { code: "ACORES",   label: "Taxa normal",          value: 16, region: "Açores",                usage: "Produtos expedidos p/ Açores" },
  { code: "ISENTO",   label: "Isento · Intra-UE",   value: 0,  region: "UE (com NIF válido)",   usage: "B2B com VIES confirmado" },
];

const hdrs = ["Código", "Designação", "Taxa", "Região", "Aplicação", ""];

export default function AdminDefinicoesImpostosPage() {
  return (
    <AdminShell active="taxes" breadcrumbs={["Admin", "Definições", "IVA e impostos"]}>
      <PageHeader
        title="IVA e impostos"
        lede="Taxas aplicáveis consoante o tipo de produto e destino. A Jocril está enquadrada no regime normal de IVA com periodicidade mensal."
        actions={<>
          <button style={adminGhost}>Sincronizar AT</button>
          <button style={adminPrimary}>+ Nova taxa</button>
        </>}
      />
      <SettingsTabs active="taxes" />

      <AdminCard title="Taxas de IVA configuradas">
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 100px 180px 1.3fr 40px", padding: "12px 18px", borderBottom: "1px dashed var(--color-base-800)", background: "var(--color-dark-base-primary)" }}>
            {hdrs.map(h => <span key={h} className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>{h}</span>)}
          </div>
          {rates.map((r, i) => (
            <div key={r.code} style={{ display: "grid", gridTemplateColumns: "140px 1fr 100px 180px 1.3fr 40px", alignItems: "center", padding: "14px 18px", borderBottom: i < rates.length - 1 ? "1px dashed var(--color-base-900)" : "none" }}>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "var(--color-accent-100)", padding: "3px 8px", border: "1px solid var(--color-base-800)", borderRadius: 2, width: "fit-content" }}>{r.code}</span>
              <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)", letterSpacing: "-.015em" }}>{r.label}</span>
              <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 20, letterSpacing: "-.03em", color: "var(--color-light-base-primary)" }}>{r.value}%</span>
              <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>{r.region}</span>
              <span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>{r.usage}</span>
              <span style={{ color: "var(--color-base-600)", cursor: "pointer" }}>⋯</span>
            </div>
          ))}
        </div>
      </AdminCard>

      <div style={{ marginTop: 32 }}>
        <AdminCard title="Regime fiscal">
          <div style={{ padding: "2px 18px" }}>
            <FormRow label="Regime" hint="Enquadramento atual para efeitos de IVA.">
              <AdminInput value="Regime Normal · Periodicidade Mensal" width={360}/>
            </FormRow>
            <FormRow label="Número de IVA" hint="Mesmo que NIF para empresas portuguesas.">
              <AdminInput value="PT500842160" width={220}/>
            </FormRow>
            <FormRow label="Validação VIES automática" hint="Validar NIF intra-UE no sistema VIES ao criar encomenda B2B.">
              <AdminToggle on={true}/>
            </FormRow>
            <FormRow label="Aplicar isenção Art.º 14.º RITI" hint="Isentar automaticamente encomendas intra-UE com NIF válido.">
              <AdminToggle on={true}/>
            </FormRow>
            <FormRow label="Preços apresentados" hint="Como os preços são exibidos nas páginas de produto.">
              <AdminInput value="Com IVA incluído (B2C) · Sem IVA (B2B)" width={380}/>
            </FormRow>
            <FormRow label="Comunicar faturas à AT" hint="SAF-T automático até ao dia 5 do mês seguinte." last>
              <AdminToggle on={true} label="Via Phc Contabilidade"/>
            </FormRow>
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
