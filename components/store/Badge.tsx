import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  size?: "xs" | "sm";
  color?: "neutral" | "accent";
};

export default function Badge({
  children,
  size = "sm",
  color = "neutral",
}: Props) {
  const sizeCls = size === "xs" ? "text-mono-xs" : "text-mono-sm";
  const colorStyle =
    color === "accent"
      ? { color: "var(--color-accent-100)" }
      : { color: "var(--color-base-500)" };

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: "var(--color-accent-300)",
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      <span className={sizeCls} style={colorStyle}>
        {children}
      </span>
    </span>
  );
}
