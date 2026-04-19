"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { adminGhost, adminPrimary } from "@/components/admin/styles";
import Link from "next/link";

type Customer = {
  id: number;
  e: string; n: string; type: "B2B" | "B2C";
  orders: number; spent: number; last: string; loc: string; tier: string; tax_id: string | null; created_at: string;
};
type SortKey = keyof Customer;

const selectStyle: CSSProperties = {
  padding: "9px 12px", background: "var(--color-dark-base-secondary)",
  border: "1px solid var(--color-base-800)", borderRadius: 2,
  color: "var(--color-base-300)", fontFamily: "var(--font-geist-mono)", fontSize: 12,
};

const headers: { k: SortKey; l: string; sortable: boolean }[] = [
  { k: "n",      l: "Cliente",     sortable: true },
  { k: "type",   l: "Tipo",        sortable: true },
  { k: "tier",   l: "Escalão",     sortable: true },
  { k: "orders", l: "Encomendas",  sortable: true },
  { k: "spent",  l: "Valor total", sortable: true },
  { k: "last",   l: "Última",      sortable: false },
  { k: "loc",    l: "Local",       sortable: true },
];

export default function AdminClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery]   = useState("");
  const [type, setType]     = useState("any");
  const [tier, setTier]     = useState("any");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
	  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const controller = new AbortController();
    async function loadCustomers() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/admin/customers", { signal: controller.signal });
        const payload = await response.json() as { success: boolean; data?: Customer[]; error?: string };
        if (!response.ok || !payload.success) {
          throw new Error(payload.error ?? "Erro ao carregar clientes");
        }
        setCustomers(payload.data ?? []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Erro ao carregar clientes");
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
    return () => controller.abort();
  }, []);

  const kpis: [string, string][] = useMemo(() => {
    const newCutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const active = customers.filter((c) => c.orders > 0).length;
    const b2b = customers.filter((c) => c.type === "B2B").length;
    return [
      ["Total clientes", String(customers.length)],
      ["Novos (30d)", String(customers.filter((c) => new Date(c.created_at).getTime() >= newCutoff).length)],
      ["Ativos", String(active)],
      ["B2B", String(b2b)],
    ];
  }, [customers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = customers.filter(c => {
      if (type !== "any" && c.type !== type) return false;
      if (tier !== "any" && c.tier !== tier) return false;
      if (q && !(c.n + " " + c.e + " " + c.loc + " " + (c.tax_id ?? "")).toLowerCase().includes(q)) return false;
      return true;
    });
    if (sortKey) {
      const dir = sortDir === "asc" ? 1 : -1;
      rows = [...rows].sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
        return String(av).localeCompare(String(bv), "pt") * dir;
      });
    }
    return rows;
  }, [query, type, tier, sortKey, sortDir]);

  const toggle = (e: string) => setSelected(s => s.includes(e) ? s.filter(x => x !== e) : [...s, e]);
  const allOnPage = filtered.length > 0 && filtered.every(c => selected.includes(c.e));
  const toggleAll = () => setSelected(allOnPage ? [] : filtered.map(c => c.e));
  const cycleSort = (k: SortKey) => {
    if (sortKey !== k) { setSortKey(k); setSortDir("asc"); return; }
    if (sortDir === "asc") setSortDir("desc");
    else { setSortKey(null); setSortDir("asc"); }
  };
  const hasFilters = !!query.trim() || type !== "any" || tier !== "any";
  const clearFilters = () => { setQuery(""); setType("any"); setTier("any"); setSortKey(null); };

	  return (
	    <AdminShell active="customers" breadcrumbs={["Clientes"]}>
      {loading && <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginBottom: 16 }}>A carregar clientes live…</div>}
      {error && <div style={{ color: "var(--color-destructive)", fontFamily: "var(--font-geist-sans)", fontSize: 13, marginBottom: 16 }}>{error}</div>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div className="text-mono-xs" style={{ color: "var(--color-accent-100)" }}>● Clientes</div>
          <h1 style={{ margin: "8px 0 0", fontFamily: "var(--font-geist-sans)", fontSize: 40, letterSpacing: "-.045em", color: "var(--color-light-base-primary)" }}>Clientes</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={adminGhost}>Exportar</button>
          <button style={adminPrimary}>+ Novo cliente</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 16 }}>
        {kpis.map(([l, v]) => (
          <div key={l} style={{ padding: "16px 20px", border: "1px dashed var(--color-base-800)", borderRadius: 4, background: "var(--color-dark-base-secondary)" }}>
            <div className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>{l}</div>
            <div style={{ marginTop: 8, fontFamily: "var(--font-geist-sans)", fontSize: 28, letterSpacing: "-.035em", color: "var(--color-light-base-primary)" }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Procurar por nome, email, NIF…" aria-label="Procurar clientes"
          style={{ flex: "1 1 320px", padding: "9px 12px", background: "var(--color-dark-base-secondary)", border: "1px solid var(--color-base-800)", borderRadius: 2, color: "var(--color-light-base-primary)", fontFamily: "var(--font-geist-sans)", fontSize: 13, minWidth: 260, outline: "none" }}/>
        <select value={type} onChange={e => setType(e.target.value)} aria-label="Filtrar por tipo" style={selectStyle}>
          <option value="any">Qualquer tipo</option>
          <option value="B2B">B2B</option>
          <option value="B2C">B2C</option>
        </select>
        <select value={tier} onChange={e => setTier(e.target.value)} aria-label="Filtrar por escalão" style={selectStyle}>
          <option value="any">Qualquer escalão</option>
          <option value="10+">10+</option>
          <option value="5+">5+</option>
          <option value="1+">1+</option>
          <option value="new">novo</option>
        </select>
        {hasFilters && (
          <button onClick={clearFilters} style={{ padding: "9px 12px", background: "transparent", border: "1px dashed var(--color-base-700)", borderRadius: 2, color: "var(--color-base-400)", fontFamily: "var(--font-geist-mono)", fontSize: 12, cursor: "pointer" }}>
            Limpar filtros
          </button>
        )}
      </div>

      <div style={{ border: "1px dashed var(--color-base-800)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "36px 1.8fr 80px 80px auto auto auto 80px", gap: 14, padding: "12px 16px", background: "var(--color-dark-base-secondary)", borderBottom: "1px dashed var(--color-base-800)" }}>
          <input type="checkbox" checked={allOnPage} onChange={toggleAll} aria-label="Selecionar todos" style={{ accentColor: "var(--color-accent-100)" }}/>
          {headers.map(h => {
            const active = sortKey === h.k;
            return (
              <span key={h.k} onClick={() => h.sortable && cycleSort(h.k)} className="text-mono-xs" style={{ color: active ? "var(--color-accent-100)" : "var(--color-base-500)", textTransform: "uppercase", cursor: h.sortable ? "pointer" : "default", userSelect: "none", display: "flex", alignItems: "center", gap: 4 }}>
                {h.l}
                {h.sortable && <span style={{ color: active ? "var(--color-accent-100)" : "var(--color-base-700)" }}>{active ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>}
              </span>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "48px 16px", textAlign: "center" }}>
            <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginBottom: 6 }}>● sem resultados</div>
            <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 16, color: "var(--color-light-base-primary)", letterSpacing: "-.02em", marginBottom: 10 }}>Nenhum cliente corresponde aos filtros.</div>
            {hasFilters && <button onClick={clearFilters} style={{ padding: "7px 12px", background: "transparent", border: "1px dashed var(--color-base-700)", borderRadius: 2, color: "var(--color-base-300)", fontFamily: "var(--font-geist-mono)", fontSize: 11, textTransform: "uppercase", cursor: "pointer" }}>Limpar filtros</button>}
          </div>
        ) : filtered.map(c => {
	          const on = selected.includes(c.e);
	          const initials = c.n.split(" ").slice(0, 2).map(w => w[0]).join("").slice(0, 2);
          return (
            <div key={c.e} style={{ display: "grid", gridTemplateColumns: "36px 1.8fr 80px 80px auto auto auto 80px", gap: 14, padding: "12px 16px", alignItems: "center", borderBottom: "1px dashed var(--color-base-900)", background: on ? "rgba(240,71,66,.03)" : "transparent" }}>
              <input type="checkbox" checked={on} onChange={() => toggle(c.e)} aria-label={`Selecionar ${c.n}`} style={{ accentColor: "var(--color-accent-100)" }}/>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 34, height: 34, borderRadius: 999, background: c.type === "B2B" ? "var(--color-accent-100)" : "var(--color-base-700)", color: c.type === "B2B" ? "#fff" : "var(--color-base-300)", display: "grid", placeItems: "center", fontFamily: "var(--font-geist-mono)", fontSize: 11 }}>{initials}</div>
                <div>
	                  <Link href={`/admin/clientes/${c.id}`} style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)", letterSpacing: "-.02em", textDecoration: "none", display: "block" }}>{c.n}</Link>
                  <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 2 }}>{c.e}</div>
                </div>
              </div>
              <span className="text-mono-xs" style={{ color: c.type === "B2B" ? "var(--color-accent-100)" : "var(--color-base-400)" }}>{c.type}</span>
              <span className="text-mono-xs" style={{ color: c.tier === "new" ? "var(--color-base-600)" : "var(--color-accent-300)" }}>{c.tier === "new" ? "novo" : c.tier}</span>
              <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>{c.orders}</span>
              <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)" }}>€ {c.spent.toFixed(2).replace(".", ",")}</span>
              <span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>{c.last}</span>
              <span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>{c.loc}</span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>A mostrar {filtered.length} {filtered.length === 1 ? "cliente" : "clientes"}{hasFilters ? " (filtrado)" : ""}</span>
        <div style={{ display: "flex", gap: 4 }}>
          {["‹", "1", "2", "3", "…", "65", "›"].map((p, i) => (
            <button key={i} style={{ padding: "6px 11px", cursor: "pointer", background: p === "1" ? "var(--color-accent-100)" : "transparent", border: `1px solid ${p === "1" ? "var(--color-accent-100)" : "var(--color-base-800)"}`, color: p === "1" ? "#fff" : "var(--color-base-400)", fontFamily: "var(--font-geist-mono)", fontSize: 12, borderRadius: 2 }}>{p}</button>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
