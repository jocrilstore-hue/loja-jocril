"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminShell";
import { adminDisabled } from "@/components/admin/styles";
import { PageHeader, SettingsTabs, FormRow, AdminInput, AdminToggle } from "@/components/admin/SettingsHelpers";

type ShippingZone = { id: string; name: string; postal: string; carriers: number; rate: string; free: string; enabled: boolean };
type ShippingCarrier = { name: string; srv: string; zones: string; status: string };

const hdrs = ["Zona", "Código postal", "Transp.", "Preço", "Portes grátis", "Estado", ""];
const carrierHdrs = ["Transportadora", "Serviços", "Zonas", "Estado", ""];

export default function AdminDefinicoesEnviosPage() {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [carriers, setCarriers] = useState<ShippingCarrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadShipping() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/admin/settings/shipping", { signal: controller.signal });
        const payload = await response.json() as { success: boolean; data?: { zones: ShippingZone[]; carriers: ShippingCarrier[] }; error?: string };
        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.error ?? "Erro ao carregar envios");
        }
        setZones(payload.data.zones);
        setCarriers(payload.data.carriers);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Erro ao carregar envios");
      } finally {
        setLoading(false);
      }
    }
    loadShipping();
    return () => controller.abort();
  }, []);

  return (
    <AdminShell active="ship" breadcrumbs={["Admin", "Definições", "Envios e zonas"]}>
      <PageHeader
        title="Envios e zonas"
        lede="Zonas geográficas, transportadoras associadas e preço base por zona. Esta página lê os dados live; edição e importação ainda não estão ligadas."
        actions={<>
          <button style={adminDisabled} disabled title="Importação ainda não ligada">Importar</button>
          <button style={adminDisabled} disabled title="Criação de zonas ainda não ligada">+ Nova zona</button>
        </>}
      />
      <SettingsTabs active="shipping" />
      {loading && <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginBottom: 16 }}>A carregar zonas live…</div>}
      {error && <div style={{ color: "var(--color-destructive)", fontFamily: "var(--font-geist-sans)", fontSize: 13, marginBottom: 16 }}>{error}</div>}

      <AdminCard title="Zonas de entrega" right={<span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>{zones.length} zonas · {zones.filter(z => z.enabled).length} ativas</span>}>
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 90px 100px 100px 90px 40px", padding: "12px 18px", borderBottom: "1px dashed var(--color-base-800)", background: "var(--color-dark-base-primary)" }}>
            {hdrs.map(h => <span key={h} className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>{h}</span>)}
          </div>
          {zones.length === 0 && (
            <div style={{ padding: "18px", fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-base-400)" }}>Sem zonas configuradas.</div>
          )}
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
              <AdminToggle on={z.enabled} disabled title="Alteração de estado ainda não ligada"/>
              <span title="Edição ainda não ligada" style={{ color: "var(--color-base-700)", cursor: "not-allowed" }}>⋯</span>
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
            {carriers.length === 0 && (
              <div style={{ padding: "18px", fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-base-400)" }}>Sem transportadoras configuradas.</div>
            )}
            {carriers.map((c, i) => (
              <div key={c.name} style={{ display: "grid", gridTemplateColumns: "1.4fr 1.4fr 1fr 1fr 40px", alignItems: "center", padding: "14px 18px", borderBottom: i < carriers.length - 1 ? "1px dashed var(--color-base-900)" : "none" }}>
                <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)", letterSpacing: "-.015em" }}>{c.name}</div>
                <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>{c.srv}</span>
                <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>{c.zones}</span>
                <span className="text-mono-xs" style={{ color: "var(--color-accent-300)" }}>● {c.status}</span>
                <span title="Edição ainda não ligada" style={{ color: "var(--color-base-700)", cursor: "not-allowed" }}>⋯</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      <div style={{ marginTop: 32 }}>
        <AdminCard title="Regras globais">
          <div style={{ padding: "2px 18px" }}>
            <FormRow label="Limiar de portes grátis" hint="Aplicado a Portugal continental. Valor sem IVA.">
              <AdminInput value="150,00" width={140} suffix="€" readOnly title="Leitura apenas nesta versão"/>
            </FormRow>
            <FormRow label="Preparação em armazém" hint="Tempo médio entre confirmação e expedição.">
              <AdminInput value="24–48h úteis" width={220} readOnly title="Leitura apenas nesta versão"/>
            </FormRow>
            <FormRow label="Peso máximo por volume" hint="Acima deste valor, envio por pallet.">
              <AdminInput value="30" width={100} suffix="kg" readOnly title="Leitura apenas nesta versão"/>
            </FormRow>
            <FormRow label="Levantar na fábrica" hint="Permitir opção de recolha presencial em Leiria." last>
              <AdminToggle on={true} label="Disponível · Seg–Sex, 09h–18h" disabled title="Regra ainda não persistida"/>
            </FormRow>
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
