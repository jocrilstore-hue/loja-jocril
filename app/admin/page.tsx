import Link from "next/link";
import AdminShell, { AdminCard } from "@/components/admin/AdminShell";

type Trend = "up" | "down" | "flat";
type OrderStatus = "pending" | "paid" | "prep" | "shipped";

const kpis: { k: string; v: string; d: string; trend: Trend; spark: number[] }[] = [
  { k: "Vendas hoje",   v: "€ 3 482,60", d: "+12,4% vs ontem",  trend: "up",   spark: [20,28,22,36,44,38,52,48,64,58,72,68,84,92] },
  { k: "Encomendas",    v: "18",          d: "4 por despachar",   trend: "flat", spark: [14,12,18,16,22,18,20,24,18,20,22,18,24,18] },
  { k: "Ticket médio",  v: "€ 193,48",   d: "+€ 8,20 vs mês",   trend: "up",   spark: [42,48,44,52,56,62,58,66,72,68,74,80,76,84] },
  { k: "Stock crítico", v: "12 SKUs",     d: "< 5 unid. disp.",  trend: "down", spark: [48,46,40,38,36,32,28,24,22,20,18,16,14,12] },
];

const recent: { n: string; c: string; it: number; v: string; s: OrderStatus; t: string }[] = [
  { n: "JOC-25-04821", c: "Maria Silva",      it: 3,  v: "€ 186,40",   s: "paid",    t: "2 min atrás" },
  { n: "JOC-25-04820", c: "Ricardo Mota",     it: 1,  v: "€  54,00",   s: "prep",    t: "28 min atrás" },
  { n: "JOC-25-04819", c: "Agência Criativa", it: 12, v: "€ 1 284,00", s: "paid",    t: "1 h atrás" },
  { n: "JOC-25-04818", c: "Beefeater PT",     it: 2,  v: "€ 422,00",   s: "shipped", t: "2 h atrás" },
  { n: "JOC-25-04817", c: "Daniel Ferreira",  it: 5,  v: "€ 268,50",   s: "prep",    t: "3 h atrás" },
  { n: "JOC-25-04816", c: "Joana Pinto",      it: 1,  v: "€  48,00",   s: "pending", t: "3 h atrás" },
  { n: "JOC-25-04815", c: "Ricola Ibérica",   it: 8,  v: "€ 832,00",   s: "shipped", t: "5 h atrás" },
];

const statusMap: Record<OrderStatus, { l: string; c: string }> = {
  pending: { l: "A aguardar", c: "var(--color-base-500)" },
  paid:    { l: "Paga",       c: "var(--color-accent-300)" },
  prep:    { l: "Preparação", c: "var(--color-accent-100)" },
  shipped: { l: "Expedida",   c: "var(--color-secondary)" },
};

const topProds = [
  { n: "Expositor A3 · 6 prateleiras", sold: 42, rev: "€ 1 785,00", img: "/assets/portfolio/carm-premium.avif" },
  { n: "Display parede A3",             sold: 28, rev: "€ 1 428,00", img: "/assets/portfolio/rayban.avif" },
  { n: "Caixa coletora 30 cm",          sold: 24, rev: "€ 1 176,00", img: "/assets/portfolio/fanta.avif" },
  { n: "Moldura A2",                    sold: 18, rev: "€   648,00", img: "/assets/portfolio/stoli.avif" },
];

const lowStock = [
  { sku: "EXP-A3-06P-T", n: "EXP · A3 · 6P · Transp.",    qty: 3, min: 10 },
  { sku: "EXP-A3-06P-O", n: "EXP · A3 · 6P · Opaco",      qty: 2, min: 10 },
  { sku: "CX-30-T",      n: "Caixa coletora 30 · Transp.", qty: 4, min: 15 },
];

function Spark({ data, trend }: { data: number[]; trend: Trend }) {
  const w = 200, h = 36;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min)) * h}`)
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
  return (
    <AdminShell active="dash" breadcrumbs={["Painel"]}>
      <div style={{ marginBottom: 28 }}>
        <div className="text-mono-xs" style={{ color: "var(--color-accent-100)" }}>● Resumo · Hoje, 17 Abril</div>
        <h1 style={{ margin: "8px 0 0", fontFamily: "var(--font-geist-sans)", fontSize: 40, letterSpacing: "-.045em", color: "var(--color-light-base-primary)" }}>
          Painel de gestão
        </h1>
      </div>

      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {kpis.map((k) => (
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
          {recent.map((o) => {
            const s = statusMap[o.s];
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
            {topProds.map((p, i) => (
              <div key={p.n} style={{ display: "grid", gridTemplateColumns: "44px 1fr auto", gap: 12, padding: "10px 18px", alignItems: "center", borderBottom: i < topProds.length - 1 ? "1px dashed var(--color-base-900)" : "none" }}>
                <div style={{ aspectRatio: "1/1", background: `url(${p.img}) center/cover`, border: "1px solid var(--color-base-800)", borderRadius: 2 }} />
                <div>
                  <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-light-base-primary)", letterSpacing: "-.02em" }}>{p.n}</div>
                  <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 2 }}>{p.sold} unidades</div>
                </div>
                <span className="text-mono-xs" style={{ color: "var(--color-accent-100)" }}>{p.rev}</span>
              </div>
            ))}
          </AdminCard>

          <AdminCard title="Stock crítico" right={<span className="text-mono-xs" style={{ color: "var(--color-destructive)" }}>3 SKUs</span>}>
            {lowStock.map((l, i) => (
              <div key={l.sku} style={{ padding: "10px 18px", borderBottom: i < lowStock.length - 1 ? "1px dashed var(--color-base-900)" : "none" }}>
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
