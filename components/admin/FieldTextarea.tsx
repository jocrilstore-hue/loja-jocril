"use client";

type Props = {
  label: string;
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  rows?: number;
  hint?: string;
};

export default function FieldTextarea({
  label,
  value,
  defaultValue,
  onChange,
  rows = 4,
  hint,
}: Props) {
  return (
    <div>
      <label
        className="text-mono-xs"
        style={{
          display: "block",
          marginBottom: 6,
          color: "var(--color-base-500)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      <textarea
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
        rows={rows}
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
          resize: "vertical",
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
