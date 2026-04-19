"use client";

import { useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminShell";
import { adminDisabled } from "@/components/admin/styles";
import { PageHeader, SettingsTabs, FormRow, AdminInput, AdminToggle } from "@/components/admin/SettingsHelpers";

type Code = { code: string; type: string; value: string; min: string; uses: string; until: string; status: "Ativo" | "Expirado" | "Rascunho" };

const codes: Code[] = [
  { code: "PRIMAVERA25",   type: "Percentagem",  value: "-15%",  min: "€ 100", uses: "342 / 1000", until: "30 Abr 2026",   status: "Ativo" },
  { code: "JOCRIL-B2B",    type: "Fixo",          value: "-€ 25", min: "€ 300", uses: "127 / ∞",    until: "Permanente",    status: "Ativo" },
  { code: "PORTES-GRATIS", type: "Envio grátis",  value: "100%",  min: "€ 50",  uses: "88 / 200",   until: "15 Mai 2026",   status: "Ativo" },
  { code: "VERAO2025",     type: "Percentagem",  value: "-20%",  min: "€ 150", uses: "412 / 500",   until: "31 Ago 2025",   status: "Expirado" },
  { code: "ARQUITETOS",    type: "Percentagem",  value: "-10%",  min: "€ 250", uses: "56 / ∞",      until: "Permanente",    status: "Ativo" },
  { code: "NATAL24",       type: "Fixo",          value: "-€ 10", min: "€ 50",  uses: "891 / 1000",  until: "31 Dez 2024",   status: "Expirado" },
  { code: "RESTOCK-ACR",   type: "Percentagem",  value: "-8%",   min: "€ 100", uses: "23 / 500",    until: "Rascunho",      status: "Rascunho" },
];

const STATUS_COLOR: Record<string, string> = {
  "Ativo":    "var(--color-accent-100)",
  "Expirado": "var(--color-base-500)",
  "Rascunho": "var(--color-accent-300)",
};
const statusOf: Record<string, string> = { "Ativo": "active", "Expirado": "expired", "Rascunho": "draft" };

const hdrs = ["Código", "Tipo", "Valor", "Mín.", "Utilizações", "Validade", "Estado", ""];

export default function AdminDefinicoesDescontosPage() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery]   = useState("");

  const counts = {
    all:     codes.length,
    active:  codes.filter(c => c.status === "Ativo").length,
    expired: codes.filter(c => c.status === "Expirado").length,
    draft:   codes.filter(c => c.status === "Rascunho").length,
  };
  const tabs = [
    { k: "all",       l: `Todos · ${counts.all}` },
    { k: "active",    l: `Ativos · ${counts.active}` },
    { k: "scheduled", l: "Agendados · 0" },
    { k: "expired",   l: `Expirados · ${counts.expired}` },
    { k: "draft",     l: `Rascunhos · ${counts.draft}` },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return codes.filter(c => {
      if (filter !== "all" && statusOf[c.status] !== filter) return false;
      if (q && !c.code.toLowerCase().includes(q) && !c.type.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [filter, query]);

  const tabBtnStyle = (on: boolean) => ({
    padding: "7px 12px", border: "1px solid var(--color-base-800)", borderRadius: 2, cursor: "pointer",
    background: on ? "var(--color-light-base-secondary)" : "transparent",
    color: on ? "var(--color-dark-base-primary)" : "var(--color-base-400)",
    fontFamily: "var(--font-geist-mono)", fontSize: 12, textTransform: "uppercase" as const, letterSpacing: "-.015rem",
  });

  return (
    <AdminShell active="discounts" breadcrumbs={["Admin", "Definições", "Descontos"]}>
      <PageHeader
        title="Códigos de desconto"
        lede="Vista de leitura dos códigos promocionais. A criação, exportação e regras globais ainda não estão ligadas."
        actions={<>
          <button style={adminDisabled} disabled title="Exportação ainda não ligada">Exportar CSV</button>
          <button style={adminDisabled} disabled title="Criação de códigos ainda não ligada">+ Novo código</button>
        </>}
      />
      <SettingsTabs active="discounts" />

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.k} onClick={() => setFilter(t.k)} style={tabBtnStyle(t.k === filter)}>{t.l}</button>
        ))}
      </div>

      <AdminCard title="Campanhas" right={
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Pesquisar código…" aria-label="Pesquisar códigos"
          style={{ padding: "6px 10px", background: "var(--color-dark-base-primary)", border: "1px solid var(--color-base-800)", borderRadius: 2, color: "var(--color-light-base-primary)", fontFamily: "var(--font-geist-sans)", fontSize: 13, outline: "none" }}/>
      }>
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 100px 100px 130px 130px 100px 40px", padding: "12px 18px", borderBottom: "1px dashed var(--color-base-800)", background: "var(--color-dark-base-primary)" }}>
            {hdrs.map(h => <span key={h} className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>{h}</span>)}
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding: "48px 18px", textAlign: "center" }}>
              <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginBottom: 6 }}>● sem resultados</div>
              <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 15, color: "var(--color-light-base-primary)", letterSpacing: "-.02em" }}>Nenhum código corresponde aos filtros.</div>
            </div>
          ) : filtered.map((c, i) => (
            <div key={c.code} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 100px 100px 130px 130px 100px 40px", alignItems: "center", padding: "14px 18px", borderBottom: i < filtered.length - 1 ? "1px dashed var(--color-base-900)" : "none" }}>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "var(--color-accent-100)", letterSpacing: "-.01rem" }}>{c.code}</span>
              <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>{c.type}</span>
              <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 15, color: "var(--color-light-base-primary)" }}>{c.value}</span>
              <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>{c.min}</span>
              <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>{c.uses}</span>
              <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>{c.until}</span>
              <span className="text-mono-xs" style={{ color: STATUS_COLOR[c.status] }}>● {c.status}</span>
              <span title="Edição ainda não ligada" style={{ color: "var(--color-base-700)", cursor: "not-allowed" }}>⋯</span>
            </div>
          ))}
        </div>
      </AdminCard>

      <div style={{ marginTop: 32 }}>
        <AdminCard title="Regras globais">
          <div style={{ padding: "2px 18px" }}>
            <FormRow label="Permitir combinação" hint="Os clientes podem aplicar vários códigos na mesma encomenda.">
              <AdminToggle on={false} disabled title="Regra ainda não persistida"/>
            </FormRow>
            <FormRow label="Aplicar a produtos em promoção" hint="Se desativado, códigos ignoram artigos já com desconto.">
              <AdminToggle on={false} disabled title="Regra ainda não persistida"/>
            </FormRow>
            <FormRow label="Desconto máximo por encomenda" hint="Limite aplicado mesmo com código válido.">
              <AdminInput value="50" width={100} suffix="%" readOnly title="Leitura apenas nesta versão"/>
            </FormRow>
            <FormRow label="Mínimo de carrinho para desconto" hint="Aplicado por defeito a códigos sem regra própria." last>
              <AdminInput value="30,00" width={120} suffix="€" readOnly title="Leitura apenas nesta versão"/>
            </FormRow>
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
