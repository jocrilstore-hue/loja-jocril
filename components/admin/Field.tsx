"use client";

import type { HTMLInputTypeAttribute } from "react";

type Props = {
  label: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (v: string) => void;
  type?: HTMLInputTypeAttribute;
  hint?: string;
  required?: boolean;
  span?: number;
  placeholder?: string;
  readOnly?: boolean;
};

export default function Field({
  label,
  value,
  defaultValue,
  onChange,
  type = "text",
  hint,
  required,
  span,
  placeholder,
  readOnly,
}: Props) {
  return (
    <div style={span ? { gridColumn: `span ${span}` } : {}}>
      <label
        className="text-mono-xs"
        style={{
          display: "block",
          marginBottom: 6,
          color: "var(--color-base-500)",
          textTransform: "uppercase",
        }}
      >
        {label}{" "}
        {required && (
          <span style={{ color: "var(--color-destructive)" }}>*</span>
        )}
      </label>
      <input
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
        type={type}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{
          width: "100%",
          padding: "9px 12px",
          background: "var(--color-dark-base-primary)",
          border: "1px solid var(--color-base-800)",
          borderRadius: 2,
          color: "var(--color-light-base-primary)",
          fontFamily: "var(--font-geist-sans)",
          fontSize: 14,
          outline: "none",
        }}
      />
      {hint && (
        <div
          className="text-mono-xs"
          style={{ color: "var(--color-base-600)", marginTop: 4 }}
        >
          {hint}
        </div>
      )}
    </div>
  );
}
