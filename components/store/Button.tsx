"use client";

import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";

export type ButtonVariant =
  | "outline"
  | "solid"
  | "pill"
  | "ghost"
  | "primary"
  | "secondary";

type Props = {
  variant?: ButtonVariant;
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  icon?: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  style?: CSSProperties;
};

export default function Button({
  variant = "outline",
  children,
  onClick,
  href,
  icon,
  type = "button",
  disabled,
  style,
}: Props) {
  const canonical =
    ({ primary: "solid", secondary: "outline", ghost: "ghost" } as const)[
      variant as "primary" | "secondary" | "ghost"
    ] ?? variant;

  const baseBtn: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    height: 31,
    padding: "0 14px",
    fontFamily: "var(--font-geist-mono)",
    fontSize: 12,
    letterSpacing: "-.015rem",
    textTransform: "uppercase",
    textDecoration: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    transition:
      "background .15s var(--ease-in-out), color .15s var(--ease-in-out)",
    whiteSpace: "nowrap",
    opacity: disabled ? 0.5 : 1,
  };

  const styles: Record<string, CSSProperties> = {
    outline: {
      ...baseBtn,
      background: "var(--color-dark-base-primary)",
      border: "1px solid var(--color-base-600)",
      color: "var(--color-light-base-primary)",
      borderRadius: 2,
    },
    solid: {
      ...baseBtn,
      background: "var(--color-light-base-secondary)",
      border: "1px solid transparent",
      color: "var(--color-dark-base-primary)",
      borderRadius: 2,
    },
    pill: {
      ...baseBtn,
      background: "var(--color-dark-base-primary)",
      border: "1px solid var(--color-base-600)",
      color: "var(--color-light-base-primary)",
      borderRadius: 999,
    },
    ghost: {
      ...baseBtn,
      background: "transparent",
      border: "1px solid transparent",
      color: "var(--color-base-300)",
      borderRadius: 2,
    },
  };

  const [hover, setHover] = useState(false);
  const base = styles[canonical] ?? styles.outline;
  const hoverStyle: CSSProperties =
    hover && !disabled
      ? {
          background: "var(--color-light-base-secondary)",
          color: "var(--color-dark-base-primary)",
        }
      : {};

  const merged = { ...base, ...hoverStyle, ...style };

  const content = (
    <>
      {children}
      {icon && <span style={{ display: "inline-flex" }}>{icon}</span>}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        style={merged}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {content}
      </Link>
    );
  }
  return (
    <button
      type={type}
      disabled={disabled}
      style={merged}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {content}
    </button>
  );
}
