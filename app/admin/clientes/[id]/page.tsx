import AdminShell from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminShell";
import { adminGhost, adminPrimary } from "@/components/admin/styles";

const c = {
  n: "Agência Ponto & Linha, Lda.", e: "contas@pontolinha.pt", p: "+351 213 400 211",
  nif: "515 998 441", type: "B2B", since: "Janeiro 2024", tier: "10+",
  addr: ["Av. da República 88", "1050-210 Lisboa", "Portugal"],
  notes: "Conta corrente aprovada. Faturação a 30 dias. Contacto principal: Sofia Martins (sofia@pontolinha.pt).",
  kpis: [["Encomendas", "7"], ["Valor total", "€ 8 420,50"], ["Ticket médio", "€ 1 203,00"], ["Últimos 90d", "€ 3 212,00"]] as [string, string][],
  orders: [
    { n: "JOC-25-04819", d: "17 Abr 2026", it: 12, v: "€ 1 284,00", s: "paid" },
    { n: "JOC-25-04612", d: "28 Mar 2026", it: 8,  v: "€   932,00", s: "delivered" },
    { n: "JOC-25-04410", d: "02 Mar 2026", it: 15, v: "€ 1 842,50", s: "delivered" },
    { n: "JOC-25-04188", d: "18 Fev 2026", it: 6,  v: "€   612,00", s: "delivered" },
    { n: "JOC-25-04002", d: "12 Fev 2026", it: 9,  v: "€ 1 176,00", s: "delivered" },
  ],
  activity: [
    { d: "17 Abr 09:22", l: "Nova encomenda JOC-25-04819 · € 1 284,00" },
    { d: "10 Abr 14:30", l: "Actualizou morada de faturação" },
    { d: "28 Mar 11:04", l: "Promovida ao escalão 10+ · desconto 8%" },
    { d: "19 Mar 17:02", l: "Contactou apoio · ticket #1882 resolvido" },
  ],
};

const statusMap: Record<string, [string, string]> = {
  paid:      ["Paga",     "var(--color-accent-300)"],
  delivered: ["Entregue", "var(--color-base-300)"],
};

export default function AdminClienteDetailPage() {
  return (
    <AdminShell active="customers" breadcrumbs={["Clientes", c.n]}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: 999, background: "var(--color-accent-100)", color: "#fff", display: "grid", placeItems: "center", fontFamily: "var(--font-geist-mono)", fontSize: 24, letterSpacing: "-.02em" }}>PL</div>
          <div>
            <div className="text-mono-xs" style={{ color: "var(--color-accent-100)" }}>● Cliente {c.type} · Desde {c.since}</div>
            <h1 style={{ margin: "8px 0 0", fontFamily: "var(--font-geist-sans)", fontSize: 36, letterSpacing: "-.04em", color: "var(--color-light-base-primary)" }}>{c.n}</h1>
            <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 6 }}>{c.e} · {c.p} · NIF {c.nif}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={adminGhost}>Enviar email</button>
          <button style={adminGhost}>Editar cliente</button>
          <button style={adminPrimary}>+ Nova encomenda</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 14 }}>
        {c.kpis.map(([l, v]) => (
          <div key={l} style={{ padding: "16px 20px", border: "1px dashed var(--color-base-800)", borderRadius: 4, background: "var(--color-dark-base-secondary)" }}>
            <div className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>{l}</div>
            <div style={{ marginTop: 8, fontFamily: "var(--font-geist-sans)", fontSize: 28, letterSpacing: "-.035em", color: "var(--color-light-base-primary)" }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
        <AdminCard title={`Encomendas (${c.orders.length})`} right={<a className="text-mono-xs" style={{ color: "var(--color-accent-100)" }}>Ver todas →</a>}>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr auto auto 1fr", gap: 16, padding: "10px 18px", borderBottom: "1px dashed var(--color-base-800)" }}>
            {["Nº", "Data", "Artigos", "Total", "Estado"].map(h => <span key={h} className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>{h}</span>)}
          </div>
          {c.orders.map(o => {
            const [l, col] = statusMap[o.s] ?? ["—", "var(--color-base-500)"];
            return (
              <div key={o.n} style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr auto auto 1fr", gap: 16, padding: "12px 18px", alignItems: "center", borderBottom: "1px dashed var(--color-base-900)" }}>
                <a style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "var(--color-accent-100)", cursor: "pointer" }}>{o.n}</a>
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
            <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-light-base-primary)", lineHeight: 1.6 }}>
              {c.addr.map(l => <div key={l}>{l}</div>)}
            </div>
            <a style={{ marginTop: 12, display: "block", fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "var(--color-accent-100)", cursor: "pointer", paddingTop: 10, borderTop: "1px dashed var(--color-base-800)" }}>Editar morada →</a>
          </AdminCard>

          <AdminCard title="Notas internas" padded>
            <p style={{ margin: 0, fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-base-300)", lineHeight: 1.55 }}>{c.notes}</p>
          </AdminCard>

          <AdminCard title="Atividade recente" padded>
            <div style={{ display: "grid", gap: 10 }}>
              {c.activity.map((a, i) => (
                <div key={i} style={{ paddingBottom: 10, borderBottom: i < c.activity.length - 1 ? "1px dashed var(--color-base-800)" : "none" }}>
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
