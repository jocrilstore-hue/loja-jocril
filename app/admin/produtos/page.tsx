"use client";

import { useEffect, useMemo, useState } from "react";
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

interface ApiVariant { stock_quantity: number; base_price_including_vat: number; main_image_url: string | null }
interface ApiProduct {
  id: number; name: string; is_active: boolean; created_at: string; updated_at?: string;
  variant_count: Array<{ count: number }>;
  categories: { name: string } | null;
  variants: ApiVariant[];
}

function mapProduct(p: ApiProduct, idx: number): Prod {
  const vs = p.variants ?? [];
  const totalStock = vs.reduce((s, v) => s + (v.stock_quantity ?? 0), 0);
  const prices = vs.map((v) => v.base_price_including_vat).filter(Boolean);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const updDate = new Date(p.updated_at ?? p.created_at);
  return {
    sku: String(p.id),
    n: p.name,
    cat: p.categories?.name ?? "—",
    price: minPrice > 0 ? `€ ${minPrice.toFixed(2).replace(".", ",")}` : "—",
    priceN: minPrice,
    stock: totalStock,
    vars: p.variant_count?.[0]?.count ?? vs.length,
    published: p.is_active,
    updated: updDate.toLocaleDateString("pt-PT", { day: "2-digit", month: "short" }),
    updIdx: idx,
    img: vs.find((v) => v.main_image_url)?.main_image_url ?? "/assets/placeholder.svg",
  };
}

const PAGE_SIZE = 10;

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
  const [products, setProducts] = useState<Prod[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("any");
  const [state, setState] = useState("any");
  const [stockFilter, setStockFilter] = useState("any");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [bulkWorking, setBulkWorking] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setProducts((res.data as ApiProduct[]).map(mapProduct));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cats = useMemo(() => Array.from(new Set(products.map((p) => p.cat))).sort(), [products]);

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
  }, [products, query, cat, state, stockFilter, sortKey, sortDir]);

  useEffect(() => {
    setPage(1);
  }, [query, cat, state, stockFilter, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggle = (k: string) =>
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  const allOnPage = paged.length > 0 && paged.every((p) => selected.includes(p.sku));
  const toggleAll = () => {
    const pageIds = paged.map((p) => p.sku);
    setSelected((current) => {
      if (allOnPage) return current.filter((id) => !pageIds.includes(id));
      return Array.from(new Set([...current, ...pageIds]));
    });
  };
  const cycleSort = (k: SortKey) => {
    if (sortKey !== k) { setSortKey(k); setSortDir("asc"); return; }
    if (sortDir === "asc") setSortDir("desc");
    else { setSortKey(null); setSortDir("asc"); }
  };
  const clearFilters = () => { setQuery(""); setCat("any"); setState("any"); setStockFilter("any"); setSortKey(null); };
  const hasFilters = query.trim() || cat !== "any" || state !== "any" || stockFilter !== "any";

  async function runBulk(action: "publish" | "unpublish" | "archive") {
    setBulkWorking(true);
    setBulkError(null);
    try {
      for (const id of selected) {
        const response = await fetch(`/api/admin/products/${id}`, {
          method: action === "archive" ? "DELETE" : "PATCH",
          headers: action === "archive" ? undefined : { "Content-Type": "application/json" },
          body: action === "archive" ? undefined : JSON.stringify({ is_active: action === "publish" }),
        });
        const payload = await response.json();
        if (!response.ok || !payload.success) {
          throw new Error(payload.error ?? "Erro ao atualizar produtos");
        }
      }

      setProducts((rows) => rows.map((product) => {
        if (!selected.includes(product.sku)) return product;
        return { ...product, published: action === "publish" };
      }));
      setSelected([]);
    } catch (error) {
      setBulkError(error instanceof Error ? error.message : "Erro ao atualizar produtos");
    } finally {
      setBulkWorking(false);
    }
  }

  return (
    <AdminShell active="products" breadcrumbs={["Produtos"]}>
      {loading && (
        <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginBottom: 16 }}>A carregar…</div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div className="text-mono-xs" style={{ color: "var(--color-accent-100)" }}>● Catálogo</div>
          <h1 style={{ margin: "8px 0 0", fontFamily: "var(--font-geist-sans)", fontSize: 40, letterSpacing: "-.045em", color: "var(--color-light-base-primary)" }}>
            Produtos · {products.length}
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
            <button disabled={bulkWorking} onClick={() => runBulk("publish")} style={adminGhost}>Publicar</button>
            <button disabled={bulkWorking} onClick={() => runBulk("unpublish")} style={adminGhost}>Despublicar</button>
            <button disabled title="Duplicar exige regras de clonagem de variantes e imagens." style={{ ...adminGhost, opacity: 0.45, cursor: "not-allowed" }}>Duplicar</button>
            <button onClick={() => setSelected([])} style={adminGhost}>Limpar</button>
            <button disabled={bulkWorking} onClick={() => runBulk("archive")} style={adminDanger}>Arquivar</button>
          </div>
        </div>
      )}
      {bulkError && (
        <div style={{ marginBottom: 8, padding: "10px 14px", border: "1px dashed var(--color-destructive)", borderRadius: 2, color: "var(--color-destructive)", fontFamily: "var(--font-geist-sans)", fontSize: 13 }}>
          {bulkError}
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
          paged.map((p) => {
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
          <button disabled={currentPage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} style={pageButton(false, currentPage === 1)}>‹</button>
          {Array.from({ length: pageCount }, (_, idx) => idx + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} style={pageButton(p === currentPage)}>
              {p}
            </button>
          ))}
          <button disabled={currentPage === pageCount} onClick={() => setPage((p) => Math.min(pageCount, p + 1))} style={pageButton(false, currentPage === pageCount)}>›</button>
        </div>
      </div>
    </AdminShell>
  );
}

function pageButton(active: boolean, disabled = false): CSSProperties {
  return {
    padding: "6px 11px",
    cursor: disabled ? "not-allowed" : "pointer",
    background: active ? "var(--color-accent-100)" : "transparent",
    border: `1px solid ${active ? "var(--color-accent-100)" : "var(--color-base-800)"}`,
    color: active ? "#fff" : "var(--color-base-400)",
    fontFamily: "var(--font-geist-mono)",
    fontSize: 12,
    borderRadius: 2,
    opacity: disabled ? 0.45 : 1,
  };
}
