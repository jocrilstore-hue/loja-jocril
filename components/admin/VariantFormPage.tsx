"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ToggleSwitch from "@/components/admin/ToggleSwitch";
import { adminGhost, adminPrimary } from "@/components/admin/styles";

type Mode = "create" | "edit";
type FieldState = "ok" | "checking" | "error";

const FORMATS = ["A6","A5","A4","A3","A2","A1","DL","CD","personalizado"];

const TIER_ROWS: [number, number | "∞", string, string][] = [
  [1,   9,   "€ 52,25", "—"],
  [10,  49,  "€ 47,00", "-10%"],
  [50,  199, "€ 42,00", "-20%"],
  [200, "∞", "€ 36,50", "-30%"],
];

const SPECS: [string, string][] = [
  ["Material",            "Acrílico (PMMA) fundido 5mm"],
  ["Dimensões",           "297 × 420 × 1200 mm"],
  ["Número de prateleiras","6"],
  ["Carga por prateleira","até 8 kg"],
  ["Acabamento",          "Bordos polidos · colagem estrutural"],
  ["Peso",                "3,2 kg"],
];

function inputStyle(err: boolean): CSSProperties {
  return {
    width: "100%",
    padding: "9px 12px",
    background: "var(--color-dark-base-primary)",
    border: `1px solid ${err ? "var(--color-destructive)" : "var(--color-base-800)"}`,
    borderRadius: 2,
    color: "var(--color-light-base-primary)",
    fontFamily: "var(--font-geist-sans)",
    fontSize: 14,
    outline: "none",
  };
}

function VCard({ title, desc, children }: { title: string; desc?: string; children: ReactNode }) {
  return (
    <div style={{ border: "1px dashed var(--color-base-800)", borderRadius: 4, overflow: "hidden", background: "var(--color-dark-base-secondary)" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px dashed var(--color-base-800)" }}>
        <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 16, color: "var(--color-light-base-primary)", letterSpacing: "-.02em" }}>{title}</div>
        {desc && <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 3 }}>{desc}</div>}
      </div>
      <div style={{ padding: 18 }}>{children}</div>
    </div>
  );
}

function VLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="text-mono-xs" style={{ display: "block", marginBottom: 6, color: "var(--color-base-500)", textTransform: "uppercase" }}>
      {children}{required && <span style={{ color: "var(--color-destructive)", marginLeft: 4 }}>*</span>}
    </label>
  );
}

function VField({ label, value, unit, type = "text" }: { label: string; value: string; unit?: string; type?: string }) {
  return (
    <div>
      <VLabel>{label}</VLabel>
      <div style={{ display: "flex", alignItems: "stretch", border: "1px solid var(--color-base-800)", borderRadius: 2, background: "var(--color-dark-base-primary)" }}>
        <input type={type} defaultValue={value} style={{ flex: 1, padding: "9px 12px", background: "transparent", border: "none", outline: "none", color: "var(--color-light-base-primary)", fontFamily: "var(--font-geist-sans)", fontSize: 14, minWidth: 0 }} />
        {unit && <span className="text-mono-xs" style={{ padding: "0 10px", display: "grid", placeItems: "center", color: "var(--color-base-500)", borderLeft: "1px solid var(--color-base-800)" }}>{unit}</span>}
      </div>
    </div>
  );
}

function StateIcon({ state }: { state: FieldState }) {
  const style: CSSProperties = { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" };
  if (state === "checking") return <span style={{ ...style, color: "var(--color-base-500)" }}>…</span>;
  if (state === "error")    return <span style={{ ...style, color: "var(--color-destructive)" }}>✗</span>;
  return <span style={{ ...style, color: "var(--color-accent-100)" }}>✓</span>;
}

function SwitchRow({ label, desc, defaultOn }: { label: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div onClick={() => setOn(!on)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", border: "1px solid var(--color-base-900)", borderRadius: 2, cursor: "pointer" }}>
      <div>
        <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-light-base-primary)" }}>{label}</div>
        <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 2 }}>{desc}</div>
      </div>
      <ToggleSwitch on={on} />
    </div>
  );
}

export default function VariantFormPage({ mode }: { mode: Mode }) {
  const isEdit = mode === "edit";
  const router = useRouter();
  const params = useParams();
  const productId = params?.id ? String(params.id) : null;
  const variantId = params?.vid ? String(params.vid) : null;

  const [skuState] = useState<FieldState>("ok");
  const [slugState] = useState<FieldState>("ok");
  const [sizeFormat, setSizeFormat] = useState("A3");
  const [isCustom, setIsCustom] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Controlled fields for API submission
  const [sku, setSku] = useState(isEdit ? "EXP-A3-06P-TR" : "");
  const [priceWithVat, setPriceWithVat] = useState(isEdit ? "52.25" : "");
  const [stockQty, setStockQty] = useState(isEdit ? "0" : "");
  const [isActive, setIsActive] = useState(true);

  const save = async () => {
    if (saving) return;
    setSaving(true);
    setApiError(null);
    try {
      if (isEdit && productId && variantId) {
        const res = await fetch(`/api/admin/products/${productId}/variants/${variantId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sku: sku || undefined,
            size_format: sizeFormat,
            base_price_including_vat: priceWithVat ? parseFloat(priceWithVat) : undefined,
            stock_quantity: stockQty !== "" ? parseInt(stockQty, 10) : undefined,
            is_active: isActive,
          }),
        });
        const json = await res.json();
        if (!json.success) {
          setApiError(json.error ?? "Erro ao guardar");
          return;
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2200);
      } else if (!isEdit && productId) {
        if (!sku.trim()) { setApiError("SKU é obrigatório"); return; }
        if (!priceWithVat) { setApiError("Preço é obrigatório"); return; }
        const res = await fetch(`/api/admin/products/${productId}/variants`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sku,
            size_format: sizeFormat,
            base_price_including_vat: parseFloat(priceWithVat),
            stock_quantity: stockQty !== "" ? parseInt(stockQty, 10) : 0,
            is_active: isActive,
          }),
        });
        const json = await res.json();
        if (!json.success) {
          setApiError(json.error ?? "Erro ao criar variante");
          return;
        }
        router.push(`/admin/produtos/${productId}`);
      }
    } catch {
      setApiError("Erro de ligação ao servidor");
    } finally {
      setSaving(false);
    }
  };

  const breadcrumbs = ["Produtos", "Expositor A3 · 6 prateleiras", "Variantes", isEdit ? "A3 · Transparente" : "Nova variante"];

  return (
    <AdminShell active="products" breadcrumbs={breadcrumbs}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div className="text-mono-xs" style={{ color: "var(--color-accent-100)", marginBottom: 6 }}>
            ● {isEdit ? "Editar variante" : "Nova variante"}
          </div>
          <h1 style={{ margin: 0, fontFamily: "var(--font-geist-sans)", fontSize: 32, letterSpacing: "-.04em", color: "var(--color-light-base-primary)" }}>
            {isEdit ? "A3 · Transparente" : "Nova variante"}
          </h1>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {saved && <span className="text-mono-xs" style={{ color: "var(--color-accent-300)" }}>✓ Guardado</span>}
          {apiError && <span className="text-mono-xs" style={{ color: "var(--color-destructive)" }}>{apiError}</span>}
          <button style={adminGhost}>Cancelar</button>
          <button style={adminPrimary} onClick={save} disabled={saving}>
            {saving ? "A guardar…" : isEdit ? "Guardar alterações" : "Criar variante"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {/* IDENTIFICAÇÃO */}
        <VCard title="Identificação" desc="Campos únicos desta variante">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <VLabel required>SKU</VLabel>
              <div style={{ position: "relative" }}>
                <input value={sku} onChange={(e) => setSku(e.target.value)} style={inputStyle(skuState === "error")} />
                <StateIcon state={skuState} />
              </div>
              {skuState === "error" && (
                <div className="text-mono-xs" style={{ color: "var(--color-destructive)", marginTop: 4 }}>
                  SKU já existe. Sugestão: <span style={{ textDecoration: "underline", cursor: "pointer" }}>EXP-A3-06P-TR-2</span>
                </div>
              )}
            </div>
            <div>
              <VLabel required>URL Slug</VLabel>
              <div style={{ position: "relative" }}>
                <input defaultValue={isEdit ? "expositor-a3-6-prateleiras-transparente" : ""} style={inputStyle(slugState === "error")} />
                <StateIcon state={slugState} />
              </div>
            </div>
            <div>
              <VLabel required>Formato</VLabel>
              <select
                value={sizeFormat}
                onChange={(e) => { setSizeFormat(e.target.value); setIsCustom(e.target.value === "personalizado"); }}
                style={{ width: "100%", padding: "9px 12px", background: "var(--color-dark-base-primary)", border: "1px solid var(--color-base-800)", borderRadius: 2, color: "var(--color-light-base-primary)", fontFamily: "var(--font-geist-sans)", fontSize: 14, outline: "none" }}
              >
                {FORMATS.map((f) => <option key={f}>{f}</option>)}
              </select>
              {!isCustom && <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 4 }}>A3 · 297 × 420 mm</div>}
            </div>
            <div>
              <VLabel>Orientação</VLabel>
              <select defaultValue="vertical" style={{ width: "100%", padding: "9px 12px", background: "var(--color-dark-base-primary)", border: "1px solid var(--color-base-800)", borderRadius: 2, color: "var(--color-light-base-primary)", fontFamily: "var(--font-geist-sans)", fontSize: 14, outline: "none" }}>
                <option value="vertical">Vertical</option>
                <option value="horizontal">Horizontal</option>
                <option value="both">Ambas</option>
              </select>
            </div>
            <div style={{ gridColumn: "span 2", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div onClick={() => setIsActive(!isActive)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", border: "1px solid var(--color-base-900)", borderRadius: 2, cursor: "pointer" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-light-base-primary)" }}>Ativo</div>
                  <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 2 }}>Disponível para compra</div>
                </div>
                <ToggleSwitch on={isActive} />
              </div>
              <SwitchRow label="Mais vendido" desc="Destacar como best-seller" defaultOn={false} />
            </div>
          </div>
        </VCard>

        {/* DIMENSÕES PERSONALIZADAS */}
        {isCustom && (
          <VCard title="Dimensões personalizadas" desc="Usado quando não se aplica formato standard">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              <VField label="Largura" value="297" unit="mm" />
              <VField label="Altura" value="420" unit="mm" />
              <VField label="Espessura" value="5" unit="mm" />
              <VField label="Profundidade" value="150" unit="mm" />
            </div>
          </VCard>
        )}

        {/* PREÇO */}
        <VCard title="Preço" desc="Introduza o preço com IVA — o preço sem IVA é calculado automaticamente (IVA: 23%)">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            <div>
              <VLabel required>Preço c/ IVA (€)</VLabel>
              <div style={{ position: "relative" }}>
                <input type="number" step="0.01" value={priceWithVat} onChange={(e) => setPriceWithVat(e.target.value)} style={{ ...inputStyle(false), paddingRight: 36 }} />
                <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--color-base-500)", fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>€</span>
              </div>
            </div>
            <div>
              <VLabel>Preço s/ IVA (€)</VLabel>
              <input type="number" defaultValue={isEdit ? "42.50" : ""} disabled style={{ ...inputStyle(false), opacity: 0.6, cursor: "not-allowed" }} />
              <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 4 }}>Calculado automaticamente</div>
            </div>
            <VField label="Quantidade mínima" value="1" unit="un" type="number" />
            <div>
              <VLabel>Stock (unidades)</VLabel>
              <div style={{ display: "flex", alignItems: "stretch", border: "1px solid var(--color-base-800)", borderRadius: 2, background: "var(--color-dark-base-primary)" }}>
                <input type="number" min="0" value={stockQty} onChange={(e) => setStockQty(e.target.value)} style={{ flex: 1, padding: "9px 12px", background: "transparent", border: "none", outline: "none", color: "var(--color-light-base-primary)", fontFamily: "var(--font-geist-sans)", fontSize: 14, minWidth: 0 }} />
                <span className="text-mono-xs" style={{ padding: "0 10px", display: "grid", placeItems: "center", color: "var(--color-base-500)", borderLeft: "1px solid var(--color-base-800)" }}>un</span>
              </div>
            </div>
          </div>

          {/* Escalões de preço desta variante */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>Escalões de preço desta variante</div>
              <button style={adminGhost}>+ Adicionar escalão</button>
            </div>
            <div style={{ border: "1px dashed var(--color-base-800)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "100px 100px 120px 100px 40px", gap: 14, padding: "10px 16px", background: "var(--color-dark-base-primary)", borderBottom: "1px dashed var(--color-base-800)" }}>
                {["Qtd mín.", "Qtd máx.", "Preço un.", "Desconto", ""].map((h) => (
                  <span key={h} className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
              {TIER_ROWS.map(([min, max, price, disc], i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 100px 120px 100px 40px", gap: 14, padding: "12px 16px", borderBottom: i < TIER_ROWS.length - 1 ? "1px dashed var(--color-base-900)" : "none", alignItems: "center" }}>
                  <input type="number" defaultValue={min} style={{ padding: "6px 8px", background: "transparent", border: "1px solid var(--color-base-800)", borderRadius: 2, color: "var(--color-light-base-primary)", fontFamily: "var(--font-geist-mono)", fontSize: 12, width: "100%" }} />
                  <input type="number" defaultValue={typeof max === "number" ? max : ""} placeholder="∞" style={{ padding: "6px 8px", background: "transparent", border: "1px solid var(--color-base-800)", borderRadius: 2, color: "var(--color-light-base-primary)", fontFamily: "var(--font-geist-mono)", fontSize: 12, width: "100%" }} />
                  <input defaultValue={price} style={{ padding: "6px 8px", background: "transparent", border: "1px solid var(--color-base-800)", borderRadius: 2, color: "var(--color-light-base-primary)", fontFamily: "var(--font-geist-mono)", fontSize: 12, width: "100%" }} />
                  <span className="text-mono-xs" style={{ color: disc === "—" ? "var(--color-base-600)" : "var(--color-accent-100)" }}>{disc}</span>
                  <button style={{ background: "transparent", border: "none", color: "var(--color-base-600)", cursor: "pointer", fontSize: 16 }}>×</button>
                </div>
              ))}
            </div>
          </div>
        </VCard>

        {/* EMBALAGEM */}
        <VCard title="Embalagem" desc="Dimensões e peso para cálculo de envio">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <VField label="Comprimento" value="45" unit="cm" />
            <VField label="Largura" value="32" unit="cm" />
            <VField label="Altura" value="8" unit="cm" />
            <VField label="Peso" value="1.8" unit="kg" type="number" />
          </div>
        </VCard>

        {/* ÁREA DE IMPRESSÃO */}
        <VCard title="Área de impressão" desc="Dimensões úteis para impressão e área de segurança">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <VField label="Largura impressão" value="280" unit="mm" />
            <VField label="Altura impressão" value="400" unit="mm" />
            <VField label="Margem de segurança" value="5" unit="mm" />
            <VField label="Resolução recomendada" value="300" unit="DPI" type="number" />
          </div>
        </VCard>

        {/* IMAGEM TÉCNICA */}
        <VCard title="Imagem técnica" desc="Diagrama de corte ou ficha técnica em PDF/PNG">
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20, alignItems: "center" }}>
            <div style={{ aspectRatio: "1/1", border: "1px dashed var(--color-base-700)", borderRadius: 4, background: "var(--color-dark-base-primary)", display: "grid", placeItems: "center" }}>
              <svg width="200" height="150" viewBox="0 0 400 300">
                <g stroke="var(--color-base-500)" strokeWidth="1" fill="none">
                  <rect x="80" y="40" width="240" height="220" stroke="var(--color-accent-100)" />
                  {[1,2,3,4,5].map((i) => <line key={i} x1="80" x2="320" y1={40 + i * 37} y2={40 + i * 37} />)}
                  <line x1="60" y1="40" x2="75" y2="40" /><line x1="60" y1="260" x2="75" y2="260" /><line x1="67" y1="40" x2="67" y2="260" />
                  <line x1="80" y1="275" x2="80" y2="285" /><line x1="320" y1="275" x2="320" y2="285" /><line x1="80" y1="280" x2="320" y2="280" />
                </g>
                <text x="55" y="155" fill="var(--color-base-400)" fontFamily="monospace" fontSize="10" textAnchor="end">420mm</text>
                <text x="200" y="298" fill="var(--color-base-400)" fontFamily="monospace" fontSize="10" textAnchor="middle">297mm</text>
                <text x="85" y="52" fill="var(--color-accent-100)" fontFamily="monospace" fontSize="8">01</text>
                <text x="85" y="252" fill="var(--color-accent-100)" fontFamily="monospace" fontSize="8">06</text>
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>Formatos aceites: PNG, SVG, PDF · Máx. 10MB</div>
              <button style={adminGhost}>Carregar imagem técnica</button>
              <button style={{ ...adminGhost, color: "var(--color-destructive)", borderColor: "rgba(193,18,18,.4)" }}>Remover</button>
            </div>
          </div>
        </VCard>

        {/* ESPECIFICAÇÕES */}
        <VCard title="Especificações técnicas" desc="Dados específicos desta variante (sobrepõe as especificações do template)">
          <div style={{ border: "1px dashed var(--color-base-800)", borderRadius: 4, overflow: "hidden" }}>
            {SPECS.map(([k, v], i) => (
              <div key={k} style={{ display: "grid", gridTemplateColumns: "200px 1fr auto", gap: 14, padding: "10px 14px", borderBottom: i < SPECS.length - 1 ? "1px dashed var(--color-base-900)" : "none", alignItems: "center" }}>
                <input defaultValue={k} style={{ padding: "5px 8px", background: "transparent", border: "1px solid var(--color-base-800)", borderRadius: 2, color: "var(--color-base-400)", fontFamily: "var(--font-geist-mono)", fontSize: 12 }} />
                <input defaultValue={v} style={{ padding: "5px 8px", background: "transparent", border: "1px solid var(--color-base-800)", borderRadius: 2, color: "var(--color-light-base-primary)", fontFamily: "var(--font-geist-sans)", fontSize: 14 }} />
                <button style={{ background: "transparent", border: "none", color: "var(--color-base-600)", cursor: "pointer", fontSize: 16 }}>×</button>
              </div>
            ))}
          </div>
          <button style={{ ...adminGhost, marginTop: 10 }}>+ Adicionar especificação</button>
        </VCard>
      </div>
    </AdminShell>
  );
}
