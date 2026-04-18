"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminShell";
import { adminDanger, adminGhost, adminPrimary } from "@/components/admin/styles";

function Tag({ children, muted }: { children: ReactNode; muted?: boolean }) {
  return (
    <span className="text-mono-xs" style={{ padding: "4px 10px", border: "1px dashed var(--color-base-800)", borderRadius: 2, color: muted ? "var(--color-base-500)" : "var(--color-accent-300)", textTransform: "uppercase" }}>
      {children}
    </span>
  );
}

const o = {
  n: "JOC-25-04819", d: "17 Abr 2026 · 09:22", status: "paid",
  customer: { n: "Agência Ponto & Linha, Lda.", e: "contas@pontolinha.pt", p: "+351 213 400 211", nif: "515 998 441", orders: 7, spent: "€ 8 420,50" },
  items: [
    { sku: "EXP-A3-06P-T", n: "Expositor A3 · 6 prateleiras · Transparente", qty: 4, unit: 42.50 },
    { sku: "DSP-PAR-A3-B", n: "Display parede A3 · Branco",                   qty: 2, unit: 128.00 },
    { sku: "CX-30-T",      n: "Caixa coletora 30 cm · Transparente",          qty: 6, unit: 68.00 },
  ],
  shipTo:  ["Agência Ponto & Linha, Lda.", "Av. da República 88", "1050-210 Lisboa", "Portugal"],
  billTo:  ["Agência Ponto & Linha, Lda.", "NIF 515 998 441", "Av. da República 88", "1050-210 Lisboa"],
  payment: { m: "Transferência bancária", ref: "PTE-R29-1884", status: "Confirmado · 17 Abr 09:24" },
  carrier: { n: "DPD Portugal", svc: "Expresso 24h", tracking: "PTE-04819-XN" },
  timeline: [
    { l: "Encomenda criada",   d: "17 Abr 09:22", who: "Cliente", done: true, active: false },
    { l: "Pagamento recebido", d: "17 Abr 09:24", who: "Sistema", done: true, active: true },
    { l: "Em preparação",      d: "—",             who: "—",       done: false, active: false },
    { l: "Expedida",           d: "—",             who: "—",       done: false, active: false },
    { l: "Entregue",           d: "—",             who: "—",       done: false, active: false },
  ],
};

export default function AdminEncomendaDetailPage() {
  const subtotal = o.items.reduce((s, it) => s + it.qty * it.unit, 0);
  const discount = 120.00, shipping = 16.00, total = subtotal - discount + shipping;

  const [note, setNote] = useState("");

  return (
    <AdminShell active="orders" breadcrumbs={["Encomendas", o.n]}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, marginBottom: 24 }}>
        <div>
          <div className="text-mono-xs" style={{ color: "var(--color-accent-100)" }}>● Encomenda · Paga</div>
          <h1 style={{ margin: "8px 0 0", fontFamily: "var(--font-geist-sans)", fontSize: 40, letterSpacing: "-.045em", color: "var(--color-light-base-primary)" }}>{o.n}</h1>
          <div style={{ marginTop: 10, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Tag>● Paga</Tag>
            <Tag muted>Criada · {o.d}</Tag>
            <Tag muted>3 artigos · 12 unidades</Tag>
            <Tag muted>Cliente #24 · 7 encomendas anteriores</Tag>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={adminGhost}>Imprimir fatura</button>
          <button style={adminGhost}>Imprimir guia</button>
          <button style={adminDanger}>Cancelar</button>
          <button style={adminPrimary}>✓ Marcar como expedida</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 14 }}>
        <div style={{ display: "grid", gap: 14 }}>
          <AdminCard title={`Artigos (${o.items.length})`}>
            <div style={{ display: "grid", gridTemplateColumns: "64px 1.6fr auto auto auto", gap: 14, padding: "10px 18px", borderBottom: "1px dashed var(--color-base-800)" }}>
              {["", "Produto", "Qtd", "Unit.", "Total"].map(h => <span key={h} className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>{h}</span>)}
            </div>
            {o.items.map((it, i) => (
              <div key={it.sku} style={{ display: "grid", gridTemplateColumns: "64px 1.6fr auto auto auto", gap: 14, padding: 18, alignItems: "center", borderBottom: i < o.items.length - 1 ? "1px dashed var(--color-base-900)" : "none" }}>
                <div style={{ aspectRatio: "1/1", background: "var(--color-dark-base-primary)", border: "1px solid var(--color-base-800)", borderRadius: 2 }}/>
                <div>
                  <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)", letterSpacing: "-.02em" }}>{it.n}</div>
                  <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 3 }}>SKU {it.sku}</div>
                </div>
                <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>× {it.qty}</span>
                <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>€ {it.unit.toFixed(2).replace(".", ",")}</span>
                <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)" }}>€ {(it.unit * it.qty).toFixed(2).replace(".", ",")}</span>
              </div>
            ))}
            <div style={{ padding: 18, borderTop: "1px dashed var(--color-base-800)", display: "grid", gap: 6 }}>
              {[
                ["Subtotal", `€ ${subtotal.toFixed(2).replace(".", ",")}`],
                ["Desconto escalão 10+", "−€ 120,00"],
                ["Envio", "€ 16,00"],
                ["IVA incluído (23%)", "—"],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>{l}</span>
                  <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-base-300)" }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 4, borderTop: "1px dashed var(--color-base-800)" }}>
                <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 17, color: "var(--color-light-base-primary)" }}>Total</span>
                <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 24, color: "var(--color-light-base-primary)", letterSpacing: "-.03em" }}>€ {total.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Cronologia" padded>
            <div style={{ display: "grid", gap: 0 }}>
              {o.timeline.map((t, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "24px 1fr auto", gap: 14, padding: "10px 0", alignItems: "center" }}>
                  <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
                    <div style={{ width: 12, height: 12, borderRadius: 7, background: t.active ? "var(--color-accent-100)" : "var(--color-dark-base-secondary)", border: `1.5px solid ${t.done ? "var(--color-accent-100)" : "var(--color-base-700)"}`, boxShadow: t.active ? "0 0 0 4px rgba(240,71,66,.2)" : "none" }}/>
                    {i < o.timeline.length - 1 && <div style={{ position: "absolute", top: 18, width: 1, height: 20, borderLeft: `1px dashed ${t.done ? "var(--color-accent-100)" : "var(--color-base-800)"}` }}/>}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: t.done ? "var(--color-light-base-primary)" : "var(--color-base-500)" }}>{t.l}</div>
                    <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 2 }}>{t.d} · {t.who}</div>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard title="Notas internas" padded>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Cliente B2B regular. Enviar com embalagem reforçada. Incluir catálogo impresso."
              style={{ width: "100%", minHeight: 80, padding: 12, background: "var(--color-dark-base-primary)", border: "1px solid var(--color-base-800)", borderRadius: 2, color: "var(--color-light-base-primary)", fontFamily: "var(--font-geist-sans)", fontSize: 13, resize: "vertical", outline: "none", boxSizing: "border-box" }}/>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="text-mono-xs" style={{ color: "var(--color-base-600)" }}>Visível apenas para staff</span>
              <button style={adminPrimary}>Guardar nota</button>
            </div>
          </AdminCard>
        </div>

        <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
          <AdminCard title="Cliente" padded>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 999, background: "var(--color-accent-100)", color: "#fff", display: "grid", placeItems: "center", fontFamily: "var(--font-geist-mono)", fontSize: 14 }}>PL</div>
              <div>
                <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 15, color: "var(--color-light-base-primary)" }}>{o.customer.n}</div>
                <div className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>{o.customer.e}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingTop: 12, borderTop: "1px dashed var(--color-base-800)" }}>
              {[["Telefone", o.customer.p], ["NIF", o.customer.nif], ["Encomendas", String(o.customer.orders)], ["Valor total", o.customer.spent]].map(([l, v]) => (
                <div key={l}>
                  <div className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>{l}</div>
                  <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-light-base-primary)", marginTop: 3 }}>{v}</div>
                </div>
              ))}
            </div>
            <a style={{ marginTop: 12, display: "block", fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "var(--color-accent-100)", cursor: "pointer", paddingTop: 12, borderTop: "1px dashed var(--color-base-800)" }}>Ver perfil do cliente →</a>
          </AdminCard>

          <AdminCard title="Entrega" padded>
            <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-light-base-primary)", lineHeight: 1.6 }}>
              {o.shipTo.map(l => <div key={l}>{l}</div>)}
            </div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed var(--color-base-800)" }}>
              <div className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>Transportadora</div>
              <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-light-base-primary)", marginTop: 3 }}>{o.carrier.n} · {o.carrier.svc}</div>
              <div style={{ marginTop: 8, fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "var(--color-accent-100)" }}>{o.carrier.tracking}</div>
            </div>
          </AdminCard>

          <AdminCard title="Faturação" padded>
            <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-light-base-primary)", lineHeight: 1.6 }}>
              {o.billTo.map(l => <div key={l}>{l}</div>)}
            </div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed var(--color-base-800)", display: "grid", gap: 4 }}>
              <div className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>Pagamento</div>
              <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-light-base-primary)" }}>{o.payment.m}</div>
              <div className="text-mono-xs" style={{ color: "var(--color-accent-300)", marginTop: 3 }}>● {o.payment.status}</div>
              <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 2 }}>Ref. {o.payment.ref}</div>
            </div>
          </AdminCard>
        </div>
      </div>
    </AdminShell>
  );
}
