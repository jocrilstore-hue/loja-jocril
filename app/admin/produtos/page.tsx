"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CSSProperties } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { adminGhost, adminPrimary, adminDanger } from "@/components/admin/styles";

type Prod = {
  sku: string;
  n: string;
  cat: string;
  price: string;
  priceN: number;
  stock: number;
  vars: number;
  published: boolean;
  updated: string;
  updIdx: number;
  img: string;
};

type SortKey = "n" | "cat" | "priceN" | "stock" | "vars" | "published" | "updIdx";

const products: Prod[] = [
  { sku: "EXP-A3-06P", n: "Expositor A3 · 6 prateleiras",    cat: "Acrílicos Chão",  price: "€ 42,50",  priceN: 42.50,  stock: 428, vars: 5, published: true,  updated: "15 Abr", updIdx: 2  , img: "/assets/portfolio/carm-premium.avif" },
  { sku: "EXP-A4-04P", n: "Expositor A4 · 4 prateleiras",    cat: "Acrílicos Chão",  price: "€ 32,80",  priceN: 32.80,  stock: 184, vars: 4, published: true,  updated: "14 Abr", updIdx: 3  , img: "/assets/portfolio/carm.avif" },
  { sku: "DSP-PAR-A3", n: "Display parede A3 c/ LED",         cat: "Displays Parede", price: "€ 128,00", priceN: 128.00, stock: 62,  vars: 3, published: true,  updated: "12 Abr", updIdx: 5  , img: "/assets/portfolio/rayban.avif" },
  { sku: "CX-30",      n: "Caixa coletora 30 cm",              cat: "Caixas & Urnas",  price: "€ 68,00",  priceN: 68.00,  stock: 148, vars: 2, published: true,  updated: "11 Abr", updIdx: 6  , img: "/assets/portfolio/fanta.avif" },
  { sku: "MLD-A2",     n: "Moldura A2 acrílico",               cat: "Molduras",        price: "€ 42,00",  priceN: 42.00,  stock: 220, vars: 6, published: true,  updated: "09 Abr", updIdx: 8  , img: "/assets/portfolio/stoli.avif" },
  { sku: "URN-50",     n: "Urna sorteio 50 L",                  cat: "Caixas & Urnas",  price: "€ 92,00",  priceN: 92.00,  stock: 14,  vars: 1, published: true,  updated: "08 Abr", updIdx: 9  , img: "/assets/portfolio/heineken-trophy.avif" },
  { sku: "EXP-A3-FU",  n: "Expositor A3 · Fumado",              cat: "Acrílicos Chão",  price: "€ 46,20",  priceN: 46.20,  stock: 3,   vars: 2, published: true,  updated: "07 Abr", updIdx: 10 , img: "/assets/portfolio/beefeater.avif" },
  { sku: "DSP-CILIN",  n: "Display cilíndrico ø300",            cat: "Displays",        price: "€ 95,00",  priceN: 95.00,  stock: 48,  vars: 2, published: false, updated: "05 Abr", updIdx: 12 , img: "/assets/portfolio/glade.avif" },
  { sku: "EXP-A2-08P", n: "Expositor A2 · 8 prateleiras",    cat: "Acrílicos Chão",  price: "€ 74,00",  priceN: 74.00,  stock: 92,  vars: 3, published: true,  updated: "02 Abr", updIdx: 15 , img: "/assets/portfolio/bioderma.avif" },
  { sku: "EXP-A3-08P", n: "Expositor A3 · 8 prateleiras",    cat: "Acrílicos Chão",  price: "€ 54,00",  priceN: 54.00,  stock: 176, vars: 4, published: true,  updated: "01 Abr", updIdx: 16 , img: "/assets/portfolio/ricola.avif" },
];

const selectStyle: CSSProperties = {
  padding: "9px 12px",
  background: "var(--color-dark-base-secondary)",
  border: "1px solid var(--color-base-800)",
  borderRadius: 2,
  color: "var(--color-base-300)",
  fontFamily: "var(--font-geist-mono)",
  fontSize: 12,
};

const headers: { k: string; l: string; sortable: boolean }[] = [
  { k: "",          l: "",            sortable: false },
  { k: "n",         l: "Produto",     sortable: true },
  { k: "cat",       l: "Categoria",   sortable: true },
  { k: "priceN",    l: "Preço base",  sortable: true },
  { k: "stock",     l: "Stock",       sortable: true },
  { k: "vars",      l: "Variantes",   sortable: true },
  { k: "published", l: "Estado",      sortable: true },
  { k: "updIdx",    l: "Editado",     sortable: true },
];

export default function AdminProductsPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("any");
  const [state, setState] = useState("any");
  const [stockFilter, setStockFilter] = useState("any");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const cats = useMemo(() => Array.from(new Set(products.map((p) => p.cat))).sort(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = products.filter((p) => {
      if (cat !== "any" && p.cat !== cat) return false;
      if (state === "published" && !p.published) return false;
      if (state === "draft" && p.published) return false;
      if (stockFilter === "instock" && p.stock < 10) return false;
      if (stockFilter === "low" && (p.stock >= 10 || p.stock === 0)) return false;
      if (stockFilter === "out" && p.stock !== 0) return false;
      if (q) {
        const hay = (p.sku + " " + p.n + " " + p.cat).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (sortKey) {
      const dir = sortDir === "asc" ? 1 : -1;
      rows = [...rows].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
        if (typeof av === "boolean" && typeof bv === "boolean") return (av === bv ? 0 : av ? -1 : 1) * dir;
        return String(av).localeCompare(String(bv), "pt") * dir;
      });
    }
    return rows;
  }, [query, cat, state, stockFilter, sortKey, sortDir]);

  const toggle = (k: string) =>
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  const allOnPage = filtered.length > 0 && filtered.every((p) => selected.includes(p.sku));
  const toggleAll = () => setSelected(allOnPage ? [] : filtered.map((p) => p.sku));
  const cycleSort = (k: SortKey) => {
    if (sortKey !== k) { setSortKey(k); setSortDir("asc"); return; }
    if (sortDir === "asc") setSortDir("desc");
    else { setSortKey(null); setSortDir("asc"); }
  };
  const clearFilters = () => { setQuery(""); setCat("any"); setState("any"); setStockFilter("any"); setSortKey(null); };
  const hasFilters = query.trim() || cat !== "any" || state !== "any" || stockFilter !== "any";

  return (
    <AdminShell active="products" breadcrumbs={["Produtos"]}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div className="text-mono-xs" style={{ color: "var(--color-accent-100)" }}>● Catálogo</div>
          <h1 style={{ margin: "8px 0 0", fontFamily: "var(--font-geist-sans)", fontSize: 40, letterSpacing: "-.045em", color: "var(--color-light-base-primary)" }}>
            Produtos · 183
          </h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={adminGhost}>Importar CSV</button>
          <button style={adminGhost}>Exportar</button>
          <Link href="/admin/produtos/novo" style={adminPrimary}>+ Novo produto</Link>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Procurar produtos, SKUs, categorias…"
          aria-label="Procurar produtos"
          style={{ flex: "1 1 320px", padding: "9px 12px", background: "var(--color-dark-base-secondary)", border: "1px solid var(--color-base-800)", borderRadius: 2, color: "var(--color-light-base-primary)", fontFamily: "var(--font-geist-sans)", fontSize: 13, minWidth: 300 }}
        />
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filtrar por categoria" style={selectStyle}>
          <option value="any">Todas as categorias</option>
          {cats.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={state} onChange={(e) => setState(e.target.value)} aria-label="Filtrar por estado" style={selectStyle}>
          <option value="any">Qualquer estado</option>
          <option value="published">Publicados</option>
          <option value="draft">Rascunhos</option>
        </select>
        <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} aria-label="Filtrar por stock" style={selectStyle}>
          <option value="any">Qualquer stock</option>
          <option value="instock">Em stock</option>
          <option value="low">Stock crítico</option>
          <option value="out">Esgotado</option>
        </select>
        {hasFilters && (
          <button onClick={clearFilters} style={{ padding: "9px 12px", background: "transparent", border: "1px dashed var(--color-base-700)", borderRadius: 2, color: "var(--color-base-400)", fontFamily: "var(--font-geist-mono)", fontSize: 12, cursor: "pointer" }}>
            Limpar filtros
          </button>
        )}
      </div>

      {selected.length > 0 && (
        <div style={{ padding: "10px 14px", background: "var(--color-dark-base-secondary)", border: "1px dashed var(--color-accent-100)", borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span className="text-mono-xs" style={{ color: "var(--color-accent-100)" }}>● {selected.length} selecionado(s)</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={adminGhost}>Publicar</button>
            <button style={adminGhost}>Despublicar</button>
            <button style={adminGhost}>Duplicar</button>
            <button onClick={() => setSelected([])} style={adminGhost}>Limpar</button>
            <button style={adminDanger}>Arquivar</button>
          </div>
        </div>
      )}

      <div style={{ border: "1px dashed var(--color-base-800)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "36px 64px 1.6fr 1fr auto auto auto 100px auto", gap: 14, padding: "12px 16px", background: "var(--color-dark-base-secondary)", borderBottom: "1px dashed var(--color-base-800)" }}>
          <input type="checkbox" checked={allOnPage} onChange={toggleAll} aria-label="Selecionar todos" style={{ accentColor: "var(--color-accent-100)" }} />
          {headers.map((h, i) => {
            const active = sortKey === h.k;
            return (
              <span
                key={i}
                onClick={() => h.sortable && cycleSort(h.k as SortKey)}
                className="text-mono-xs"
                style={{ color: active ? "var(--color-accent-100)" : "var(--color-base-500)", textTransform: "uppercase", cursor: h.sortable ? "pointer" : "default", userSelect: "none", display: "flex", alignItems: "center", gap: 4 }}
              >
                {h.l}
                {h.sortable && (
                  <span style={{ color: active ? "var(--color-accent-100)" : "var(--color-base-700)" }}>
                    {active ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
                  </span>
                )}
              </span>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "48px 16px", textAlign: "center" }}>
            <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginBottom: 6 }}>● sem resultados</div>
            <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 16, color: "var(--color-light-base-primary)", letterSpacing: "-.02em", marginBottom: 10 }}>
              Nenhum produto corresponde aos filtros.
            </div>
            {hasFilters && (
              <button onClick={clearFilters} style={{ padding: "7px 12px", background: "transparent", border: "1px dashed var(--color-base-700)", borderRadius: 2, color: "var(--color-base-300)", fontFamily: "var(--font-geist-mono)", fontSize: 11, textTransform: "uppercase", cursor: "pointer" }}>
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          filtered.map((p) => {
            const low = p.stock < 10;
            const on = selected.includes(p.sku);
            return (
              <div key={p.sku} style={{ display: "grid", gridTemplateColumns: "36px 64px 1.6fr 1fr auto auto auto 100px auto", gap: 14, padding: "12px 16px", alignItems: "center", borderBottom: "1px dashed var(--color-base-900)", background: on ? "rgba(240,71,66,.03)" : "transparent" }}>
                <input type="checkbox" checked={on} onChange={() => toggle(p.sku)} aria-label={`Selecionar ${p.sku}`} style={{ accentColor: "var(--color-accent-100)" }} />
                <div style={{ aspectRatio: "1/1", background: `url(${p.img}) center/cover`, border: "1px solid var(--color-base-800)", borderRadius: 2 }} />
                <div>
                  <Link href={`/admin/produtos/${p.sku}`} style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)", letterSpacing: "-.02em", cursor: "pointer", display: "block", textDecoration: "none" }}>
                    {p.n}
                  </Link>
                  <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 3 }}>SKU {p.sku}</div>
                </div>
                <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>{p.cat}</span>
                <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)" }}>{p.price}</span>
                <span className="text-mono-xs" style={{ color: low ? "var(--color-destructive)" : "var(--color-base-400)" }}>{low ? "● " : ""}{p.stock}</span>
                <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>{p.vars}</span>
                <span className="text-mono-xs" style={{ color: p.published ? "var(--color-accent-300)" : "var(--color-base-500)" }}>● {p.published ? "Publicado" : "Rascunho"}</span>
                <span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>{p.updated}</span>
              </div>
            );
          })
        )}
      </div>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>
          A mostrar {filtered.length} {filtered.length === 1 ? "produto" : "produtos"}{hasFilters ? " (filtrado)" : ""}
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {["‹", "1", "2", "3", "…", "16", "›"].map((p, i) => (
            <button key={i} style={{ padding: "6px 11px", cursor: "pointer", background: p === "1" ? "var(--color-accent-100)" : "transparent", border: `1px solid ${p === "1" ? "var(--color-accent-100)" : "var(--color-base-800)"}`, color: p === "1" ? "#fff" : "var(--color-base-400)", fontFamily: "var(--font-geist-mono)", fontSize: 12, borderRadius: 2 }}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
