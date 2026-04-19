"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

type SettingsTabKey = "overview" | "shipping" | "tiers" | "discounts" | "taxes" | "team";

const TABS: [SettingsTabKey, string, string][] = [
  ["overview",  "Geral",     "/admin/definicoes"],
  ["shipping",  "Envios",    "/admin/definicoes/envios"],
  ["tiers",     "Escalões",  "/admin/definicoes/escaloes"],
  ["discounts", "Descontos", "/admin/definicoes/descontos"],
  ["taxes",     "IVA",       "/admin/definicoes/impostos"],
  ["team",      "Equipa",    "/admin/definicoes/equipa"],
];

export function PageHeader({ title, lede, actions }: { title: string; lede?: string; actions?: ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 8 }}>
      <div>
        <h1 style={{ margin: 0, fontFamily: "var(--font-geist-sans)", fontSize: 36, letterSpacing: "-.035em", color: "var(--color-light-base-primary)" }}>{title}</h1>
        {lede && <p className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 8, maxWidth: 640, lineHeight: 1.5 }}>{lede}</p>}
      </div>
      {actions && <div style={{ display: "flex", gap: 8 }}>{actions}</div>}
    </div>
  );
}

export function SettingsTabs({ active }: { active: SettingsTabKey }) {
  return (
    <div style={{ display: "flex", gap: 2, borderBottom: "1px solid var(--color-base-900)", marginBottom: 24 }}>
      {TABS.map(([k, label, href]) => {
        const on = k === active;
        return (
          <Link key={k} href={href} style={{
            padding: "10px 14px", cursor: "pointer", textDecoration: "none",
            borderBottom: `2px solid ${on ? "var(--color-accent-100)" : "transparent"}`,
            marginBottom: -1,
          }}>
            <span className="text-mono-xs" style={{ color: on ? "var(--color-light-base-primary)" : "var(--color-base-500)", textTransform: "uppercase" }}>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function FormRow({ label, hint, children, last }: { label: string; hint?: string; children: ReactNode; last?: boolean }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "240px 1fr", gap: 32,
      padding: "18px 0", borderBottom: last ? "none" : "1px dashed var(--color-base-900)",
    }}>
      <div>
        <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)", letterSpacing: "-.02em" }}>{label}</div>
        {hint && <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 4, lineHeight: 1.5 }}>{hint}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function AdminInput({
  value, placeholder, type = "text", suffix, width, readOnly, disabled, title,
}: {
  value?: string; placeholder?: string; type?: string; suffix?: string; width?: number | string; readOnly?: boolean; disabled?: boolean; title?: string;
}) {
  const inactive = readOnly || disabled;
  return (
    <div title={title} style={{ display: "inline-flex", alignItems: "stretch", border: "1px solid var(--color-base-800)", borderRadius: 2, background: "var(--color-dark-base-primary)", width, opacity: inactive ? 0.72 : 1 }}>
      <input
        defaultValue={value}
        placeholder={placeholder}
        type={type}
        readOnly={readOnly}
        disabled={disabled}
        aria-readonly={readOnly || undefined}
        style={{ flex: 1, padding: "9px 12px", background: "transparent", border: "none", outline: "none", color: inactive ? "var(--color-base-400)" : "var(--color-light-base-primary)", fontFamily: "var(--font-geist-sans)", fontSize: 14, letterSpacing: "-.015em", width: "100%", cursor: inactive ? "default" : "text" }}
      />
      {suffix && (
        <span className="text-mono-xs" style={{ padding: "0 12px", display: "grid", placeItems: "center", color: "var(--color-base-500)", borderLeft: "1px solid var(--color-base-800)" }}>{suffix}</span>
      )}
    </div>
  );
}

export function AdminToggle({ on, label, disabled, title }: { on?: boolean; label?: string; disabled?: boolean; title?: string }) {
  const [checked, setChecked] = useState(on ?? false);
  return (
    <div
      onClick={() => {
        if (!disabled) setChecked(!checked);
      }}
      aria-disabled={disabled || undefined}
      title={title}
      style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.65 : 1 }}
    >
      <div style={{ width: 34, height: 18, borderRadius: 999, padding: 2, background: checked ? "var(--color-accent-100)" : "var(--color-base-800)", transition: "background .15s" }}>
        <div style={{ width: 14, height: 14, borderRadius: 999, background: "#fff", transform: `translateX(${checked ? 16 : 0}px)`, transition: "transform .15s" }}/>
      </div>
      {label && <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-base-300)" }}>{label}</span>}
    </div>
  );
}
