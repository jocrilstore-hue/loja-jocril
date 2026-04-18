import type { CSSProperties } from "react";

export const adminPrimary: CSSProperties = {
  padding: "8px 14px",
  background: "var(--color-accent-100)",
  color: "#fff",
  border: "1px solid var(--color-accent-100)",
  borderRadius: 2,
  fontFamily: "var(--font-geist-mono)",
  fontSize: 12,
  letterSpacing: "-.015rem",
  textTransform: "uppercase",
  cursor: "pointer",
};

export const adminGhost: CSSProperties = {
  padding: "8px 14px",
  background: "transparent",
  color: "var(--color-base-300)",
  border: "1px solid var(--color-base-800)",
  borderRadius: 2,
  fontFamily: "var(--font-geist-mono)",
  fontSize: 12,
  letterSpacing: "-.015rem",
  textTransform: "uppercase",
  cursor: "pointer",
};

export const adminDanger: CSSProperties = {
  padding: "8px 14px",
  background: "transparent",
  color: "var(--color-destructive)",
  border: "1px solid rgba(193,18,18,.4)",
  borderRadius: 2,
  fontFamily: "var(--font-geist-mono)",
  fontSize: 12,
  letterSpacing: "-.015rem",
  textTransform: "uppercase",
  cursor: "pointer",
};
