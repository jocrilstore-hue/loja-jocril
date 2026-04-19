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
          <button style={adminGhost} onClick={() => router.back()}>Cancelar</button>
          <button style={adminPrimary} onClick={save} disabled={saving}>
            {saving ? "A guardar…" : isEdit ? "Guardar alterações" : "Criar variante"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {/* IDENTIFICAÇÃO */}
        <VCard title="Identificação" desc="Nesta versão, a variante guarda apenas SKU, formato, estado, preço com IVA e stock. Os restantes campos ficam ocultos até terem persistência.">
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
            <div style={{ gridColumn: "span 2", display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              <div onClick={() => setIsActive(!isActive)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", border: "1px solid var(--color-base-900)", borderRadius: 2, cursor: "pointer" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-light-base-primary)" }}>Ativo</div>
                  <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 2 }}>Disponível para compra</div>
                </div>
                <ToggleSwitch on={isActive} />
              </div>
            </div>
          </div>
        </VCard>

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
            <div>
              <VLabel>Stock (unidades)</VLabel>
              <div style={{ display: "flex", alignItems: "stretch", border: "1px solid var(--color-base-800)", borderRadius: 2, background: "var(--color-dark-base-primary)" }}>
                <input type="number" min="0" value={stockQty} onChange={(e) => setStockQty(e.target.value)} style={{ flex: 1, padding: "9px 12px", background: "transparent", border: "none", outline: "none", color: "var(--color-light-base-primary)", fontFamily: "var(--font-geist-sans)", fontSize: 14, minWidth: 0 }} />
                <span className="text-mono-xs" style={{ padding: "0 10px", display: "grid", placeItems: "center", color: "var(--color-base-500)", borderLeft: "1px solid var(--color-base-800)" }}>un</span>
              </div>
            </div>
          </div>
        </VCard>
      </div>
    </AdminShell>
  );
}
