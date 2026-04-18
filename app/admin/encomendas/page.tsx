"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { adminDanger, adminGhost, adminPrimary } from "@/components/admin/styles";

type Status = "pending" | "paid" | "prep" | "shipped" | "delivered" | "returned";
type Order = {
  n: string; c: string; e: string; it: number; v: number;
  s: Status; d: string; dayIdx: number; pay: string;
};
type SortKey = "n" | "c" | "it" | "v" | "pay" | "s" | "d";

const orders: Order[] = [
  { n: "JOC-25-04821", c: "Maria Silva",          e: "maria@agencia.pt",          it: 3,  v: 186.40,  s: "paid",      d: "17 Abr · 10:42", dayIdx: 0, pay: "MBWay" },
  { n: "JOC-25-04820", c: "Ricardo Mota",         e: "ricardo.m@gmail.com",       it: 1,  v: 54.00,   s: "prep",      d: "17 Abr · 10:14", dayIdx: 0, pay: "Multibanco" },
  { n: "JOC-25-04819", c: "Agência Ponto&Linha",  e: "contas@pontolinha.pt",      it: 12, v: 1284.00, s: "paid",      d: "17 Abr · 09:22", dayIdx: 0, pay: "Transferência" },
  { n: "JOC-25-04818", c: "Beefeater PT",         e: "procurement@beefeater.pt",  it: 2,  v: 422.00,  s: "shipped",   d: "17 Abr · 08:02", dayIdx: 0, pay: "Cartão" },
  { n: "JOC-25-04817", c: "Daniel Ferreira",      e: "danferreira@mail.pt",       it: 5,  v: 268.50,  s: "prep",      d: "16 Abr · 19:30", dayIdx: 1, pay: "MBWay" },
  { n: "JOC-25-04816", c: "Joana Pinto",          e: "j.pinto@outlook.pt",        it: 1,  v: 48.00,   s: "pending",   d: "16 Abr · 18:12", dayIdx: 1, pay: "MBWay" },
  { n: "JOC-25-04815", c: "Ricola Ibérica",       e: "orders@ricola.es",          it: 8,  v: 832.00,  s: "shipped",   d: "16 Abr · 15:04", dayIdx: 1, pay: "Transferência" },
  { n: "JOC-25-04814", c: "Bruno Almeida",        e: "bruno.a@mail.pt",           it: 2,  v: 128.00,  s: "delivered", d: "16 Abr · 14:48", dayIdx: 1, pay: "MBWay" },
  { n: "JOC-25-04813", c: "CARM Vinhos",          e: "shop@carm.pt",              it: 6,  v: 648.00,  s: "delivered", d: "16 Abr · 11:20", dayIdx: 1, pay: "Transferência" },
  { n: "JOC-25-04812", c: "Sara Martins",         e: "sara.m@gmail.com",          it: 1,  v: 52.00,   s: "returned",  d: "16 Abr · 10:02", dayIdx: 1, pay: "Cartão" },
  { n: "JOC-25-04811", c: "Heineken PT",          e: "compras@heineken.pt",       it: 4,  v: 1200.00, s: "paid",      d: "16 Abr · 09:48", dayIdx: 1, pay: "Transferência" },
  { n: "JOC-25-04810", c: "Miguel Teixeira",      e: "m.teixeira@mail.com",       it: 1,  v: 68.00,   s: "pending",   d: "16 Abr · 09:02", dayIdx: 1, pay: "MBWay" },
];

const statusMap: Record<Status, { l: string; c: string }> = {
  pending:   { l: "A aguardar", c: "var(--color-base-500)" },
  paid:      { l: "Paga",        c: "var(--color-accent-300)" },
  prep:      { l: "Preparação",  c: "var(--color-accent-100)" },
  shipped:   { l: "Expedida",    c: "var(--color-secondary)" },
  delivered: { l: "Entregue",    c: "var(--color-base-300)" },
  returned:  { l: "Devolvida",   c: "var(--color-destructive)" },
};

const headers: { k: SortKey; l: string; sortable: boolean }[] = [
  { k: "n",   l: "Nº",        sortable: true },
  { k: "c",   l: "Cliente",   sortable: true },
  { k: "it",  l: "Artigos",   sortable: true },
  { k: "v",   l: "Total",     sortable: true },
  { k: "pay", l: "Pagamento", sortable: true },
  { k: "s",   l: "Estado",    sortable: true },
  { k: "d",   l: "Data",      sortable: false },
];

export default function AdminEncomendasPage() {
  const [status, setStatus]     = useState<Status | "all">("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery]       = useState("");
  const [dateRange, setDateRange] = useState("any");
  const [payment, setPayment]   = useState("any");
  const [sortKey, setSortKey]   = useState<SortKey | null>(null);
  const [sortDir, setSortDir]   = useState<"asc" | "desc">("asc");

  const baseForTabs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter(o => {
      if (payment !== "any" && o.pay !== payment) return false;
      if (dateRange === "today" && o.dayIdx !== 0) return false;
      if (dateRange === "7d" && o.dayIdx > 6) return false;
      if (dateRange === "30d" && o.dayIdx > 29) return false;
      if (q && !(o.n + " " + o.c + " " + o.e).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, payment, dateRange]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = orders.filter(o => {
      if (status !== "all" && o.s !== status) return false;
      if (payment !== "any" && o.pay !== payment) return false;
      if (dateRange === "today" && o.dayIdx !== 0) return false;
      if (dateRange === "7d" && o.dayIdx > 6) return false;
      if (dateRange === "30d" && o.dayIdx > 29) return false;
      if (q && !(o.n + " " + o.c + " " + o.e).toLowerCase().includes(q)) return false;
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
  }, [query, status, payment, dateRange, sortKey, sortDir]);

  const tabs = [
    { k: "all",      t: "Todas",       n: baseForTabs.length },
    { k: "pending",  t: "A aguardar",  n: baseForTabs.filter(o => o.s === "pending").length },
    { k: "paid",     t: "Pagas",       n: baseForTabs.filter(o => o.s === "paid").length },
    { k: "prep",     t: "Preparação",  n: baseForTabs.filter(o => o.s === "prep").length },
    { k: "shipped",  t: "Expedidas",   n: baseForTabs.filter(o => o.s === "shipped").length },
    { k: "returned", t: "Devoluções",  n: baseForTabs.filter(o => o.s === "returned").length },
  ];

  const toggle = (n: string) => setSelected(s => s.includes(n) ? s.filter(x => x !== n) : [...s, n]);
  const allOnPage = filtered.length > 0 && filtered.every(o => selected.includes(o.n));
  const toggleAll = () => setSelected(allOnPage ? [] : filtered.map(o => o.n));
  const cycleSort = (k: SortKey) => {
    if (sortKey !== k) { setSortKey(k); setSortDir("asc"); return; }
    if (sortDir === "asc") setSortDir("desc");
    else { setSortKey(null); setSortDir("asc"); }
  };
  const hasFilters = status !== "all" || !!query.trim() || dateRange !== "any" || payment !== "any";
  const clearFilters = () => { setStatus("all"); setQuery(""); setDateRange("any"); setPayment("any"); setSortKey(null); };

  const selectCss = { padding: "9px 12px", background: "var(--color-dark-base-secondary)", border: "1px solid var(--color-base-800)", borderRadius: 2, color: "var(--color-base-300)", fontFamily: "var(--font-geist-mono)", fontSize: 12 } as const;

  return (
    <AdminShell active="orders" breadcrumbs={["Encomendas"]}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div className="text-mono-xs" style={{ color: "var(--color-accent-100)" }}>● Encomendas</div>
          <h1 style={{ margin: "8px 0 0", fontFamily: "var(--font-geist-sans)", fontSize: 40, letterSpacing: "-.045em", color: "var(--color-light-base-primary)" }}>Encomendas</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={adminGhost}>Exportar CSV</button>
          <button style={adminPrimary}>+ Nova encomenda</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: "1px dashed var(--color-base-800)" }}>
        {tabs.map(t => {
          const on = t.k === status;
          return (
            <button key={t.k} onClick={() => setStatus(t.k as Status | "all")} style={{ padding: "12px 18px", background: "transparent", border: "none", cursor: "pointer", borderBottom: `2px solid ${on ? "var(--color-accent-100)" : "transparent"}`, color: on ? "var(--color-light-base-primary)" : "var(--color-base-500)", fontFamily: "var(--font-geist-mono)", fontSize: 12, letterSpacing: "-.015rem", textTransform: "uppercase" }}>
              {t.t} <span style={{ color: "var(--color-base-700)", marginLeft: 6 }}>{String(t.n).padStart(2, "0")}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Procurar por nº, cliente ou email…" aria-label="Procurar encomendas"
          style={{ flex: "1 1 320px", padding: "9px 12px", background: "var(--color-dark-base-secondary)", border: "1px solid var(--color-base-800)", borderRadius: 2, color: "var(--color-light-base-primary)", fontFamily: "var(--font-geist-sans)", fontSize: 13, minWidth: 240, outline: "none" }}/>
        <select value={dateRange} onChange={e => setDateRange(e.target.value)} aria-label="Filtrar por data" style={selectCss}>
          <option value="any">Qualquer data</option>
          <option value="today">Hoje</option>
          <option value="7d">Últimos 7 dias</option>
          <option value="30d">Últimos 30 dias</option>
        </select>
        <select value={payment} onChange={e => setPayment(e.target.value)} aria-label="Filtrar por pagamento" style={selectCss}>
          <option value="any">Qualquer pagamento</option>
          <option value="MBWay">MBWay</option>
          <option value="Multibanco">Multibanco</option>
          <option value="Cartão">Cartão</option>
          <option value="Transferência">Transferência</option>
        </select>
        {hasFilters && (
          <button onClick={clearFilters} style={{ padding: "9px 12px", background: "transparent", border: "1px dashed var(--color-base-700)", borderRadius: 2, color: "var(--color-base-400)", fontFamily: "var(--font-geist-mono)", fontSize: 12, cursor: "pointer" }}>
            Limpar filtros
          </button>
        )}
      </div>

      {selected.length > 0 && (
        <div style={{ padding: "10px 14px", background: "var(--color-dark-base-secondary)", border: "1px dashed var(--color-accent-100)", borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span className="text-mono-xs" style={{ color: "var(--color-accent-100)" }}>● {selected.length} selecionada(s)</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={adminGhost}>Marcar como expedida</button>
            <button style={adminGhost}>Imprimir guias</button>
            <button onClick={() => setSelected([])} style={adminGhost}>Limpar</button>
            <button style={adminDanger}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={{ border: "1px dashed var(--color-base-800)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "36px 1.2fr 1.5fr auto auto 1fr 1fr 120px", gap: 14, padding: "12px 16px", background: "var(--color-dark-base-secondary)", borderBottom: "1px dashed var(--color-base-800)" }}>
          <input type="checkbox" checked={allOnPage} onChange={toggleAll} aria-label="Selecionar todas" style={{ accentColor: "var(--color-accent-100)" }}/>
          {headers.map(h => {
            const active = sortKey === h.k;
            return (
              <span key={h.k} onClick={() => h.sortable && cycleSort(h.k)} className="text-mono-xs" style={{ color: active ? "var(--color-accent-100)" : "var(--color-base-500)", textTransform: "uppercase", cursor: h.sortable ? "pointer" : "default", userSelect: "none", display: "flex", alignItems: "center", gap: 4 }}>
                {h.l}{h.sortable && <span style={{ color: active ? "var(--color-accent-100)" : "var(--color-base-700)" }}>{active ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>}
              </span>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "48px 16px", textAlign: "center" }}>
            <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginBottom: 6 }}>● sem resultados</div>
            <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 16, color: "var(--color-light-base-primary)", letterSpacing: "-.02em", marginBottom: 10 }}>Nenhuma encomenda corresponde aos filtros.</div>
            {hasFilters && <button onClick={clearFilters} style={{ padding: "7px 12px", background: "transparent", border: "1px dashed var(--color-base-700)", borderRadius: 2, color: "var(--color-base-300)", fontFamily: "var(--font-geist-mono)", fontSize: 11, textTransform: "uppercase", cursor: "pointer" }}>Limpar filtros</button>}
          </div>
        ) : filtered.map(o => {
          const s = statusMap[o.s];
          const on = selected.includes(o.n);
          return (
            <div key={o.n} style={{ display: "grid", gridTemplateColumns: "36px 1.2fr 1.5fr auto auto 1fr 1fr 120px", gap: 14, padding: "14px 16px", alignItems: "center", borderBottom: "1px dashed var(--color-base-900)", background: on ? "rgba(240,71,66,.03)" : "transparent" }}>
              <input type="checkbox" checked={on} onChange={() => toggle(o.n)} aria-label={`Selecionar ${o.n}`} style={{ accentColor: "var(--color-accent-100)" }}/>
              <Link href={`/admin/encomendas/${o.n}`} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "var(--color-accent-100)", textDecoration: "none" }}>{o.n}</Link>
              <div>
                <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)", letterSpacing: "-.02em" }}>{o.c}</div>
                <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 2 }}>{o.e}</div>
              </div>
              <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>× {o.it}</span>
              <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)" }}>€ {o.v.toFixed(2).replace(".", ",")}</span>
              <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>{o.pay}</span>
              <span className="text-mono-xs" style={{ color: s.c }}>● {s.l}</span>
              <span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>{o.d}</span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>A mostrar {filtered.length} {filtered.length === 1 ? "encomenda" : "encomendas"}{hasFilters ? " (filtrado)" : ""}</span>
        <div style={{ display: "flex", gap: 4 }}>
          {["‹", "1", "2", "3", "4", "…", "39", "›"].map((p, i) => (
            <button key={i} style={{ padding: "6px 11px", cursor: "pointer", background: p === "1" ? "var(--color-accent-100)" : "transparent", border: `1px solid ${p === "1" ? "var(--color-accent-100)" : "var(--color-base-800)"}`, color: p === "1" ? "#fff" : "var(--color-base-400)", fontFamily: "var(--font-geist-mono)", fontSize: 12, borderRadius: 2 }}>{p}</button>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
