"use client";

import { useEffect, useState } from "react";
import AdminShell, { AdminCard } from "@/components/admin/AdminShell";
import { adminGhost, adminPrimary } from "@/components/admin/styles";

type CustomerDetail = {
  id: number;
  n: string;
  e: string;
  p: string;
  nif: string;
  type: "B2B" | "B2C";
  since: string;
  tier: string;
  addr: string[][];
  notes: string;
  kpis: [string, string][];
  orders: { n: string; d: string; it: number; v: string; s: string }[];
  activity: { d: string; l: string }[];
};

const statusMap: Record<string, [string, string]> = {
  paid:       ["Paga",       "var(--color-accent-300)"],
  pending:    ["Pendente",   "var(--color-base-500)"],
  confirmed:  ["Confirmada", "var(--color-accent-100)"],
  processing: ["Preparação", "var(--color-accent-100)"],
  shipped:    ["Expedida",   "var(--color-secondary)"],
  delivered:  ["Entregue",   "var(--color-base-300)"],
  cancelled:  ["Cancelada",  "var(--color-base-500)"],
};

export default function AdminClienteDetailClient({ id }: { id: string }) {
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadCustomer() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/admin/customers/${id}`, { signal: controller.signal });
        const payload = await response.json() as { success: boolean; data?: CustomerDetail; error?: string };
        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.error ?? "Erro ao carregar cliente");
        }
        setCustomer(payload.data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Erro ao carregar cliente");
      } finally {
        setLoading(false);
      }
    }
    loadCustomer();
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <AdminShell active="customers" breadcrumbs={["Clientes", "A carregar"]}>
        <div className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>A carregar cliente live…</div>
      </AdminShell>
    );
  }

  if (error || !customer) {
    return (
      <AdminShell active="customers" breadcrumbs={["Clientes", "Erro"]}>
        <div style={{ color: "var(--color-destructive)", fontFamily: "var(--font-geist-sans)", fontSize: 14 }}>{error ?? "Cliente não encontrado"}</div>
      </AdminShell>
    );
  }

  const initials = customer.n.split(" ").slice(0, 2).map((word) => word[0]).join("").slice(0, 2);

  return (
    <AdminShell active="customers" breadcrumbs={["Clientes", customer.n]}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: 999, background: "var(--color-accent-100)", color: "#fff", display: "grid", placeItems: "center", fontFamily: "var(--font-geist-mono)", fontSize: 24, letterSpacing: "-.02em" }}>{initials}</div>
          <div>
            <div className="text-mono-xs" style={{ color: "var(--color-accent-100)" }}>● Cliente {customer.type} · Desde {customer.since}</div>
            <h1 style={{ margin: "8px 0 0", fontFamily: "var(--font-geist-sans)", fontSize: 36, letterSpacing: "-.04em", color: "var(--color-light-base-primary)" }}>{customer.n}</h1>
            <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 6 }}>{customer.e} · {customer.p} · NIF {customer.nif}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={adminGhost}>Enviar email</button>
          <button style={adminGhost}>Editar cliente</button>
          <button style={adminPrimary}>+ Nova encomenda</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 14 }}>
        {customer.kpis.map(([l, v]) => (
          <div key={l} style={{ padding: "16px 20px", border: "1px dashed var(--color-base-800)", borderRadius: 4, background: "var(--color-dark-base-secondary)" }}>
            <div className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>{l}</div>
            <div style={{ marginTop: 8, fontFamily: "var(--font-geist-sans)", fontSize: 28, letterSpacing: "-.035em", color: "var(--color-light-base-primary)" }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
        <AdminCard title={`Encomendas (${customer.orders.length})`} right={<a className="text-mono-xs" style={{ color: "var(--color-accent-100)" }}>Ver todas →</a>}>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr auto auto 1fr", gap: 16, padding: "10px 18px", borderBottom: "1px dashed var(--color-base-800)" }}>
            {["Nº", "Data", "Artigos", "Total", "Estado"].map(h => <span key={h} className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>{h}</span>)}
          </div>
          {customer.orders.length === 0 && (
            <div style={{ padding: "18px", fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-base-400)" }}>Sem encomendas.</div>
          )}
          {customer.orders.map(o => {
            const [l, col] = statusMap[o.s] ?? [o.s, "var(--color-base-500)"];
            return (
              <div key={o.n} style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr auto auto 1fr", gap: 16, padding: "12px 18px", alignItems: "center", borderBottom: "1px dashed var(--color-base-900)" }}>
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "var(--color-accent-100)" }}>{o.n}</span>
                <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>{o.d}</span>
                <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>× {o.it}</span>
                <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)" }}>{o.v}</span>
                <span className="text-mono-xs" style={{ color: col }}>● {l}</span>
              </div>
            );
          })}
        </AdminCard>

        <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
          <AdminCard title="Morada" padded>
            {customer.addr.length === 0 && (
              <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-base-400)" }}>Sem moradas registadas.</div>
            )}
            {customer.addr.map((address, idx) => (
              <div key={idx} style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-light-base-primary)", lineHeight: 1.6, marginBottom: 12 }}>
                {address.map(line => <div key={line}>{line}</div>)}
              </div>
            ))}
          </AdminCard>

          <AdminCard title="Notas internas" padded>
            <p style={{ margin: 0, fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-base-300)", lineHeight: 1.55 }}>{customer.notes}</p>
          </AdminCard>

          <AdminCard title="Atividade recente" padded>
            <div style={{ display: "grid", gap: 10 }}>
              {customer.activity.length === 0 && (
                <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-base-400)" }}>Sem atividade recente.</div>
              )}
              {customer.activity.map((a, i) => (
                <div key={i} style={{ paddingBottom: 10, borderBottom: i < customer.activity.length - 1 ? "1px dashed var(--color-base-800)" : "none" }}>
                  <div className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>{a.d}</div>
                  <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-light-base-primary)", marginTop: 3, letterSpacing: "-.02em" }}>{a.l}</div>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>
    </AdminShell>
  );
}
