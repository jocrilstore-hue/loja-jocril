"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { adminDisabled, adminGhost } from "@/components/admin/styles";

type Tier = { id: number; min: number; pct: number };

export default function AdminEscaloesPrecosPage() {
  const [tiers, setTiers] = useState<Tier[]>([
    { id: 1, min: 200,  pct: 0.5 },
    { id: 2, min: 400,  pct: 1.0 },
    { id: 3, min: 800,  pct: 1.5 },
    { id: 4, min: 1000, pct: 3.0 },
  ]);

  const sorted = [...tiers].sort((a, b) => a.min - b.min);

  const add = () => {
    const last = sorted[sorted.length - 1];
    const maxId = Math.max(...tiers.map((t) => t.id), 0);
    setTiers([...tiers, { id: maxId + 1, min: (last?.min ?? 0) + 200, pct: (last?.pct ?? 0) + 0.5 }]);
  };

  const remove = (id: number) => {
    if (tiers.length <= 1) return;
    setTiers(tiers.filter((t) => t.id !== id));
  };

  const update = (id: number, field: keyof Tier, val: number) =>
    setTiers(tiers.map((t) => (t.id === id ? { ...t, [field]: val } : t)));

  const exPrice = 2.50;

  return (
    <AdminShell active="price" breadcrumbs={["Admin", "Ferramentas", "Escalões de preço"]}>
      <div style={{ marginBottom: 28 }}>
        <div className="text-mono-xs" style={{ color: "var(--color-accent-100)", marginBottom: 6 }}>● Ferramenta</div>
        <h1 style={{ margin: "0 0 8px", fontFamily: "var(--font-geist-sans)", fontSize: 36, letterSpacing: "-.04em", color: "var(--color-light-base-primary)" }}>
          Escalões de desconto por quantidade
        </h1>
        <p style={{ margin: 0, fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-base-400)", maxWidth: 600 }}>
          Pré-visualize descontos progressivos baseados no valor total do pedido. A aplicação global ao catálogo ainda não está ligada.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, alignItems: "start" }}>
        {/* Config card */}
        <div style={{ border: "1px dashed var(--color-base-800)", borderRadius: 4, overflow: "hidden", background: "var(--color-dark-base-secondary)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px dashed var(--color-base-800)" }}>
            <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 16, color: "var(--color-light-base-primary)" }}>Pré-visualizar escalões</div>
            <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 3 }}>Estes valores só alteram a simulação desta página.</div>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 40px", gap: 12, padding: "8px 0", borderBottom: "1px dashed var(--color-base-800)", marginBottom: 8 }}>
              <span className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>Valor mínimo (EUR)</span>
              <span className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>Desconto (%)</span>
              <span />
            </div>
            {sorted.map((t) => (
              <div key={t.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 40px", gap: 12, padding: "10px 0", borderBottom: "1px dashed var(--color-base-900)", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>&gt;</span>
                  <div style={{ display: "flex", alignItems: "stretch", border: "1px solid var(--color-base-800)", borderRadius: 2, flex: 1, background: "var(--color-dark-base-primary)" }}>
                    <input
                      type="number"
                      value={t.min}
                      min={1}
                      step={50}
                      onChange={(e) => update(t.id, "min", parseFloat(e.target.value) || 0)}
                      style={{ flex: 1, padding: "7px 10px", background: "transparent", border: "none", outline: "none", color: "var(--color-light-base-primary)", fontFamily: "var(--font-geist-mono)", fontSize: 13, minWidth: 0 }}
                    />
                    <span className="text-mono-xs" style={{ padding: "0 8px", display: "grid", placeItems: "center", color: "var(--color-base-500)", borderLeft: "1px solid var(--color-base-800)" }}>EUR</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "stretch", border: "1px solid var(--color-base-800)", borderRadius: 2, background: "var(--color-dark-base-primary)" }}>
                  <input
                    type="number"
                    value={t.pct}
                    min={0.1}
                    max={100}
                    step={0.5}
                    onChange={(e) => update(t.id, "pct", parseFloat(e.target.value) || 0)}
                    style={{ flex: 1, padding: "7px 10px", background: "transparent", border: "none", outline: "none", color: "var(--color-light-base-primary)", fontFamily: "var(--font-geist-mono)", fontSize: 13, minWidth: 0 }}
                  />
                  <span className="text-mono-xs" style={{ padding: "0 8px", display: "grid", placeItems: "center", color: "var(--color-base-500)", borderLeft: "1px solid var(--color-base-800)" }}>%</span>
                </div>
                <button onClick={() => remove(t.id)} title="Remove apenas esta pré-visualização" style={{ background: "transparent", border: "none", color: "var(--color-base-600)", cursor: "pointer", fontSize: 16, display: "grid", placeItems: "center" }}>×</button>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button style={adminGhost} onClick={add} title="Adiciona apenas nesta pré-visualização">+ Adicionar escalão</button>
              <button style={adminDisabled} disabled title="Aplicação global ainda não ligada">
                Aplicação global indisponível
              </button>
            </div>
          </div>
        </div>

        {/* Right: how it works + preview */}
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ border: "1px dashed var(--color-base-800)", borderRadius: 4, background: "var(--color-dark-base-secondary)", padding: 20 }}>
            <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 15, color: "var(--color-light-base-primary)", marginBottom: 12 }}>Como funciona</div>
            <div style={{ display: "grid", gap: 10, fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-base-300)", lineHeight: 1.55 }}>
              <p style={{ margin: 0 }}>Os descontos são baseados no <strong style={{ color: "var(--color-light-base-primary)" }}>valor total</strong> do pedido, não na quantidade.</p>
              <p style={{ margin: 0 }}>Para cada produto, o sistema calcula automaticamente a quantidade necessária para atingir cada escalão de valor.</p>
              <div style={{ padding: 12, background: "var(--color-dark-base-primary)", border: "1px solid var(--color-base-900)", borderRadius: 2 }}>
                <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginBottom: 6 }}>Exemplo · produto a € {exPrice.toFixed(2)}</div>
                {sorted.slice(0, 3).map((t) => (
                  <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px dashed var(--color-base-900)" }}>
                    <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>Pedido &gt; {t.min} EUR</span>
                    <span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>= {Math.ceil(t.min / exPrice)} un.</span>
                    <span className="text-mono-xs" style={{ color: "var(--color-accent-100)" }}>-{t.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ border: "1px dashed var(--color-base-800)", borderRadius: 4, background: "var(--color-dark-base-secondary)", padding: 20 }}>
            <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 15, color: "var(--color-light-base-primary)", marginBottom: 12 }}>Pré-visualização</div>
            {sorted.map((t, i) => (
              <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < sorted.length - 1 ? "1px dashed var(--color-base-900)" : "none" }}>
                <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-base-300)" }}>Pedido &gt; {t.min} EUR</span>
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, color: "var(--color-accent-100)" }}>-{t.pct}%</span>
              </div>
            ))}
          </div>
          <div style={{ border: "1px dashed var(--color-base-800)", borderRadius: 4, padding: 20, background: "var(--color-dark-base-secondary)" }}>
            <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginBottom: 8 }}>● aplicação não ligada</div>
            <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-base-300)", lineHeight: 1.55 }}>
              Esta ferramenta já não simula uma gravação. Quando a rota de persistência estiver pronta, a aplicação global deve chamar o RPC de escalões e reportar o resultado real.
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
