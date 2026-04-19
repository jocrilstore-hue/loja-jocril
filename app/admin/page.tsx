"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminShell, { AdminCard } from "@/components/admin/AdminShell";

type Trend = "up" | "down" | "flat";
type OrderStatus = string;

type DashboardStats = {
  kpis: { k: string; v: string; d: string; trend: Trend; spark: number[] }[];
  recent: { n: string; c: string; it: number; v: string; s: OrderStatus; t: string }[];
  topProds: { n: string; sold: number; rev: string; img: string }[];
  lowStock: { sku: string; n: string; qty: number; min: number }[];
};

const emptyStats: DashboardStats = {
  kpis: [],
  recent: [],
  topProds: [],
  lowStock: [],
};

const statusMap: Record<string, { l: string; c: string }> = {
  pending:    { l: "A aguardar",  c: "var(--color-base-500)" },
  paid:       { l: "Paga",        c: "var(--color-accent-300)" },
  confirmed:  { l: "Confirmada",  c: "var(--color-accent-100)" },
  processing: { l: "Preparação",  c: "var(--color-accent-100)" },
  shipped:    { l: "Expedida",    c: "var(--color-secondary)" },
  delivered:  { l: "Entregue",    c: "var(--color-secondary)" },
  cancelled:  { l: "Cancelada",   c: "var(--color-base-500)" },
};

function Spark({ data, trend }: { data: number[]; trend: Trend }) {
  const safeData = data.length > 1 ? data : [0, 0];
  const w = 200, h = 36;
  const max = Math.max(...safeData), min = Math.min(...safeData);
  const range = max - min || 1;
  const pts = safeData
    .map((v, i) => `${(i / (safeData.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");
  const color =
    trend === "up" ? "var(--color-accent-300)" :
    trend === "down" ? "var(--color-destructive)" :
    "var(--color-base-500)";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={pts} />
      <polyline fill={color} fillOpacity={0.08} stroke="none" points={`0,${h} ${pts} ${w},${h}`} />
    </svg>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const todayLabel = new Date().toLocaleDateString("pt-PT", { day: "2-digit", month: "long" });

  useEffect(() => {
    const controller = new AbortController();
    async function loadStats() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/admin/stats", { signal: controller.signal });
        const payload = await response.json() as { success: boolean; data?: DashboardStats; error?: string };
        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.error ?? "Erro ao carregar painel");
        }
        setStats(payload.data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Erro ao carregar painel");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
    return () => controller.abort();
  }, []);

  return (
    <AdminShell active="dash" breadcrumbs={["Painel"]}>
      <div style={{ marginBottom: 28 }}>
        <div className="text-mono-xs" style={{ color: "var(--color-accent-100)" }}>● Resumo · Hoje, {todayLabel}</div>
        <h1 style={{ margin: "8px 0 0", fontFamily: "var(--font-geist-sans)", fontSize: 40, letterSpacing: "-.045em", color: "var(--color-light-base-primary)" }}>
          Painel de gestão
        </h1>
        {loading && <div className="text-mono-xs" style={{ marginTop: 10, color: "var(--color-base-500)" }}>A carregar dados live…</div>}
        {error && <div style={{ marginTop: 10, color: "var(--color-destructive)", fontFamily: "var(--font-geist-sans)", fontSize: 13 }}>{error}</div>}
      </div>

      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {stats.kpis.map((k) => (
          <div key={k.k} style={{ padding: 22, border: "1px dashed var(--color-base-800)", borderRadius: 4, background: "var(--color-dark-base-secondary)" }}>
            <div className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>{k.k}</div>
            <div style={{ marginTop: 10, fontFamily: "var(--font-geist-sans)", fontSize: 32, letterSpacing: "-.035em", color: "var(--color-light-base-primary)" }}>{k.v}</div>
            <div style={{ marginTop: 14, height: 36 }}>
              <Spark data={k.spark} trend={k.trend} />
            </div>
            <div className="text-mono-xs" style={{ marginTop: 8, color: k.trend === "up" ? "var(--color-accent-300)" : k.trend === "down" ? "var(--color-destructive)" : "var(--color-base-500)" }}>
              {k.trend === "up" ? "↗" : k.trend === "down" ? "↘" : "→"} {k.d}
            </div>
          </div>
        ))}
      </div>

      {/* main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
        {/* recent orders */}
        <AdminCard
          title="Encomendas recentes"
          right={
            <Link href="/admin/encomendas" className="text-mono-xs" style={{ color: "var(--color-accent-100)" }}>
              Ver todas →
            </Link>
          }
        >
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1.4fr auto 1fr 1fr auto", gap: 16, padding: "10px 18px", borderBottom: "1px dashed var(--color-base-800)" }}>
            {["Nº", "Cliente", "Artigos", "Total", "Estado", ""].map((h) => (
              <span key={h} className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>
          {stats.recent.length === 0 && (
            <div style={{ padding: "18px", fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-base-400)" }}>
              Sem encomendas recentes.
            </div>
          )}
          {stats.recent.map((o) => {
            const s = statusMap[o.s] ?? { l: o.s, c: "var(--color-base-400)" };
            return (
              <div key={o.n} style={{ display: "grid", gridTemplateColumns: "1.3fr 1.4fr auto 1fr 1fr auto", gap: 16, padding: "12px 18px", alignItems: "center", borderBottom: "1px dashed var(--color-base-900)" }}>
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "var(--color-light-base-primary)" }}>{o.n}</span>
                <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)", letterSpacing: "-.02em" }}>{o.c}</span>
                <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>× {o.it}</span>
                <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)" }}>{o.v}</span>
                <span className="text-mono-xs" style={{ color: s.c }}>● {s.l}</span>
                <span className="text-mono-xs" style={{ color: "var(--color-base-600)" }}>{o.t}</span>
              </div>
            );
          })}
        </AdminCard>

        {/* side column */}
        <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
          <AdminCard title="Top produtos · 30 dias">
            {stats.topProds.length === 0 && (
              <div style={{ padding: "18px", fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-base-400)" }}>
                Sem vendas nos últimos 30 dias.
              </div>
            )}
            {stats.topProds.map((p, i) => (
              <div key={p.n} style={{ display: "grid", gridTemplateColumns: "44px 1fr auto", gap: 12, padding: "10px 18px", alignItems: "center", borderBottom: i < stats.topProds.length - 1 ? "1px dashed var(--color-base-900)" : "none" }}>
                <div style={{ aspectRatio: "1/1", background: `url(${p.img}) center/cover`, border: "1px solid var(--color-base-800)", borderRadius: 2 }} />
                <div>
                  <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-light-base-primary)", letterSpacing: "-.02em" }}>{p.n}</div>
                  <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 2 }}>{p.sold} unidades</div>
                </div>
                <span className="text-mono-xs" style={{ color: "var(--color-accent-100)" }}>{p.rev}</span>
              </div>
            ))}
          </AdminCard>

          <AdminCard title="Stock crítico" right={<span className="text-mono-xs" style={{ color: "var(--color-destructive)" }}>{stats.lowStock.length} SKUs</span>}>
            {stats.lowStock.length === 0 && (
              <div style={{ padding: "18px", fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-base-400)" }}>
                Sem alertas de stock.
              </div>
            )}
            {stats.lowStock.map((l, i) => (
              <div key={l.sku} style={{ padding: "10px 18px", borderBottom: i < stats.lowStock.length - 1 ? "1px dashed var(--color-base-900)" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "var(--color-light-base-primary)" }}>{l.sku}</span>
                  <span className="text-mono-xs" style={{ color: "var(--color-destructive)" }}>{l.qty} / {l.min}</span>
                </div>
                <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 3 }}>{l.n}</div>
                <div style={{ marginTop: 8, height: 4, background: "var(--color-dark-base-primary)", border: "1px solid var(--color-base-800)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${(l.qty / l.min) * 100}%`, height: "100%", background: "var(--color-destructive)" }} />
                </div>
              </div>
            ))}
          </AdminCard>
        </div>
      </div>
    </AdminShell>
  );
}
