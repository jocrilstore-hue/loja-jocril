"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export const skeletonCSS = `@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`;

/* ─── Badge ─── */
type BadgeTone = "accent" | "warn" | "danger" | "neutral";
const BADGE_COLOR: Record<BadgeTone, string> = {
  accent:  "var(--color-accent-100)",
  warn:    "var(--color-accent-300)",
  danger:  "var(--color-destructive)",
  neutral: "var(--color-base-500)",
};
export function Badge({ tone, children }: { tone: BadgeTone; children: ReactNode }) {
  const color = BADGE_COLOR[tone];
  return (
    <span className="text-mono-xs" style={{ padding: "3px 8px", border: `1px solid ${color}`, borderRadius: 2, color, textTransform: "uppercase" }}>
      {children}
    </span>
  );
}

/* ─── DataTable ─── */
type Column<T> = {
  key: string;
  label: string;
  width?: string;
  mono?: boolean;
  sortable?: boolean;
  color?: string;
  render?: (row: T, i: number) => ReactNode;
};
export function DataTable<T extends Record<string, unknown>>({
  columns, rows, selectable, onRowClick,
}: {
  columns: Column<T>[];
  rows: T[];
  selectable?: boolean;
  onRowClick?: (row: T, i: number) => void;
}) {
  const [sel, setSel] = useState(new Set<number>());
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const gridCols = (selectable ? "32px " : "") + columns.map(c => c.width || "1fr").join(" ");
  const cycle = (k: string) => {
    if (sortKey !== k) { setSortKey(k); setSortDir("asc"); return; }
    if (sortDir === "asc") setSortDir("desc");
    else { setSortKey(null); setSortDir("asc"); }
  };
  const toggle = (i: number) => {
    const s = new Set(sel);
    s.has(i) ? s.delete(i) : s.add(i);
    setSel(s);
  };
  const toggleAll = () => {
    if (sel.size === rows.length) setSel(new Set());
    else setSel(new Set(rows.map((_, i) => i)));
  };

  return (
    <div style={{ border: "1px dashed var(--color-base-800)", borderRadius: 4, overflow: "hidden", background: "var(--color-dark-base-secondary)" }}>
      <div style={{ display: "grid", gridTemplateColumns: gridCols, padding: "12px 18px", borderBottom: "1px dashed var(--color-base-800)", background: "var(--color-dark-base-primary)", alignItems: "center" }}>
        {selectable && (
          <input type="checkbox" checked={sel.size === rows.length && rows.length > 0} onChange={toggleAll} style={{ accentColor: "var(--color-accent-100)" }}/>
        )}
        {columns.map(c => (
          <span key={c.key} onClick={() => c.sortable && cycle(c.key)} className="text-mono-xs" style={{
            color: sortKey === c.key ? "var(--color-accent-100)" : "var(--color-base-500)",
            textTransform: "uppercase", cursor: c.sortable ? "pointer" : "default",
            userSelect: "none", display: "flex", gap: 4, alignItems: "center",
          }}>
            {c.label}
            {c.sortable && <span style={{ color: sortKey === c.key ? "var(--color-accent-100)" : "var(--color-base-700)" }}>
              {sortKey === c.key ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
            </span>}
          </span>
        ))}
      </div>
      {rows.map((r, i) => (
        <div key={i} onClick={() => onRowClick?.(r, i)} style={{
          display: "grid", gridTemplateColumns: gridCols, padding: "14px 18px",
          alignItems: "center", cursor: onRowClick ? "pointer" : "default",
          borderBottom: i < rows.length - 1 ? "1px dashed var(--color-base-900)" : "none",
          background: sel.has(i) ? "color-mix(in oklch, var(--color-accent-100) 8%, transparent)" : "transparent",
        }}>
          {selectable && (
            <input type="checkbox" checked={sel.has(i)} onChange={e => { e.stopPropagation(); toggle(i); }} onClick={e => e.stopPropagation()} style={{ accentColor: "var(--color-accent-100)" }}/>
          )}
          {columns.map(c => (
            <div key={c.key} style={{ fontFamily: c.mono ? "var(--font-geist-mono)" : "var(--font-geist-sans)", fontSize: c.mono ? 12 : 14, color: c.color || "var(--color-light-base-primary)", letterSpacing: "-.015em" }}>
              {c.render ? c.render(r, i) : String(r[c.key] ?? "")}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── FilterBar ─── */
export function FilterBar({ tabs, activeTab, onTab, search, filters }: {
  tabs: { k: string; label: string; count?: number }[];
  activeTab: string;
  onTab?: (k: string) => void;
  search?: string | false;
  filters?: string[];
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 16, flexWrap: "wrap" }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {tabs.map(t => {
          const on = t.k === activeTab;
          return (
            <button key={t.k} onClick={() => onTab?.(t.k)} style={{
              padding: "7px 12px", border: `1px solid ${on ? "transparent" : "var(--color-base-800)"}`, borderRadius: 2, cursor: "pointer",
              background: on ? "var(--color-light-base-secondary)" : "transparent",
              color: on ? "var(--color-dark-base-primary)" : "var(--color-base-400)",
              fontFamily: "var(--font-geist-mono)", fontSize: 12, textTransform: "uppercase", letterSpacing: "-.015rem",
            }}>{t.label}{t.count !== undefined && ` · ${t.count}`}</button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {filters?.map(f => (
          <button key={f} style={{ padding: "7px 12px", background: "transparent", border: "1px dashed var(--color-base-700)", borderRadius: 2, color: "var(--color-base-300)", fontFamily: "var(--font-geist-mono)", fontSize: 12, textTransform: "uppercase", cursor: "pointer", display: "flex", gap: 6, alignItems: "center" }}>
            {f} <span style={{ color: "var(--color-base-600)" }}>▾</span>
          </button>
        ))}
        {search !== false && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", border: "1px solid var(--color-base-800)", borderRadius: 2, background: "var(--color-dark-base-primary)", minWidth: 260 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-base-500)" strokeWidth="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            <input placeholder={typeof search === "string" ? search : "Pesquisar…"} style={{ background: "transparent", border: "none", outline: "none", color: "var(--color-light-base-primary)", fontFamily: "var(--font-geist-sans)", fontSize: 13, flex: 1 }}/>
            <span className="text-mono-xs" style={{ color: "var(--color-base-700)", padding: "1px 5px", border: "1px solid var(--color-base-800)", borderRadius: 2 }}>⌘K</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Drawer ─── */
export function Drawer({ open, onClose, title, children, actions }: {
  open: boolean; onClose?: () => void; title: string; children: ReactNode; actions?: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose?.();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.55)", backdropFilter: "blur(4px)" }}/>
      <aside style={{ position: "relative", width: 520, height: "100%", background: "var(--color-dark-base-secondary)", borderLeft: "1px solid var(--color-base-800)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px dashed var(--color-base-800)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="text-mono-sm" style={{ color: "var(--color-light-base-primary)", textTransform: "uppercase" }}>{title}</span>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--color-base-500)", cursor: "pointer", fontSize: 20 }}>×</button>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>{children}</div>
        {actions && <div style={{ padding: "16px 24px", borderTop: "1px dashed var(--color-base-800)", display: "flex", justifyContent: "flex-end", gap: 8 }}>{actions}</div>}
      </aside>
    </div>
  );
}

/* ─── Modal ─── */
export function Modal({ open, onClose, title, children, actions, intent = "neutral" }: {
  open: boolean; onClose?: () => void; title: string; children: ReactNode; actions?: ReactNode; intent?: "neutral" | "destructive";
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose?.();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "grid", placeItems: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.65)", backdropFilter: "blur(4px)" }}/>
      <div style={{ position: "relative", width: 480, background: "var(--color-dark-base-secondary)", border: "1px solid var(--color-base-800)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px dashed var(--color-base-800)", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: intent === "destructive" ? "var(--color-destructive)" : "var(--color-accent-100)" }}>●</span>
          <span className="text-mono-sm" style={{ color: "var(--color-light-base-primary)", textTransform: "uppercase" }}>{title}</span>
        </div>
        <div style={{ padding: "20px 22px", color: "var(--color-base-300)", fontFamily: "var(--font-geist-sans)", fontSize: 14, lineHeight: 1.55 }}>{children}</div>
        {actions && <div style={{ padding: "14px 22px", borderTop: "1px dashed var(--color-base-800)", display: "flex", justifyContent: "flex-end", gap: 8 }}>{actions}</div>}
      </div>
    </div>
  );
}

/* ─── ToastStack ─── */
type ToastItem = { id: number; type: "success" | "error" | "warning" | "info"; title: string; body?: string };
const TOAST_ICON: Record<string, { color: string; char: string }> = {
  success: { color: "var(--color-accent-100)", char: "✓" },
  error:   { color: "var(--color-destructive)", char: "!" },
  warning: { color: "var(--color-accent-300)", char: "▲" },
  info:    { color: "var(--color-base-400)", char: "i" },
};
export function ToastStack({ items, onDismiss }: { items: ToastItem[]; onDismiss: (id: number) => void }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, display: "flex", flexDirection: "column", gap: 8, zIndex: 200 }}>
      {items.map(t => {
        const { color, char } = TOAST_ICON[t.type] || TOAST_ICON.info;
        return (
          <div key={t.id} style={{ display: "grid", gridTemplateColumns: "24px 1fr 20px", gap: 12, alignItems: "start", padding: "14px 16px", background: "var(--color-dark-base-secondary)", border: "1px solid var(--color-base-800)", borderLeft: `2px solid ${color}`, borderRadius: 4, minWidth: 320, maxWidth: 420, boxShadow: "0 8px 24px rgba(0,0,0,.3)" }}>
            <span style={{ width: 20, height: 20, borderRadius: "50%", background: color, color: "var(--color-dark-base-primary)", display: "grid", placeItems: "center", fontSize: 11, fontFamily: "var(--font-geist-mono)" }}>{char}</span>
            <div>
              <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)", letterSpacing: "-.015em" }}>{t.title}</div>
              {t.body && <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 3, lineHeight: 1.5 }}>{t.body}</div>}
            </div>
            <button onClick={() => onDismiss(t.id)} style={{ background: "transparent", border: "none", color: "var(--color-base-600)", cursor: "pointer", fontSize: 14, padding: 0 }}>×</button>
          </div>
        );
      })}
    </div>
  );
}

/* ─── EmptyState ─── */
export function EmptyState({ icon, title, description, action }: { icon?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div style={{ padding: "64px 40px", display: "grid", placeItems: "center", textAlign: "center" }}>
      <div style={{ width: 56, height: 56, border: "1px dashed var(--color-base-700)", borderRadius: "50%", display: "grid", placeItems: "center", color: "var(--color-base-500)", marginBottom: 20 }}>
        {icon || "◎"}
      </div>
      <h3 style={{ margin: 0, fontFamily: "var(--font-geist-sans)", fontSize: 20, letterSpacing: "-.025em", color: "var(--color-light-base-primary)" }}>{title}</h3>
      {description && <p className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 8, maxWidth: 380, lineHeight: 1.5 }}>{description}</p>}
      {action && <div style={{ marginTop: 24 }}>{action}</div>}
    </div>
  );
}

/* ─── Skeleton ─── */
export function Skeleton({ width = "100%", height = 14, rounded = 2 }: { width?: number | string; height?: number; rounded?: number }) {
  return (
    <div style={{ width, height, borderRadius: rounded, background: "linear-gradient(90deg, var(--color-dark-base-primary) 0%, var(--color-base-900) 50%, var(--color-dark-base-primary) 100%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s ease-in-out infinite" }}/>
  );
}

/* ─── DropdownMenu ─── */
type MenuItem = { label?: string; shortcut?: string; destructive?: boolean; onClick?: () => void; separator?: boolean };
export function DropdownMenu({ trigger, items }: { trigger?: ReactNode; items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setOpen(!open)} style={{ background: "transparent", border: "none", color: "var(--color-base-500)", cursor: "pointer", padding: "4px 8px" }}>
        {trigger || "⋯"}
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 50, minWidth: 200, background: "var(--color-dark-base-secondary)", border: "1px solid var(--color-base-800)", borderRadius: 4, boxShadow: "0 8px 24px rgba(0,0,0,.4)", padding: 4 }}>
          {items.map((it, i) => it.separator ? (
            <div key={i} style={{ height: 1, background: "var(--color-base-900)", margin: "4px 0" }}/>
          ) : (
            <button key={i} onClick={() => { it.onClick?.(); setOpen(false); }} style={{ width: "100%", textAlign: "left", padding: "8px 12px", background: "transparent", border: "none", cursor: "pointer", borderRadius: 2, fontFamily: "var(--font-geist-sans)", fontSize: 13, color: it.destructive ? "var(--color-destructive)" : "var(--color-base-300)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{it.label}</span>
              {it.shortcut && <span className="text-mono-xs" style={{ color: "var(--color-base-600)" }}>{it.shortcut}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
