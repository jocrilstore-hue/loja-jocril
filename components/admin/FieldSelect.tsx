"use client";

type Props = {
  label: string;
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  options: string[];
};

export default function FieldSelect({
  label,
  value,
  defaultValue,
  onChange,
  options,
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
      <select
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
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
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
