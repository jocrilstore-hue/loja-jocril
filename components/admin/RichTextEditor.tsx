"use client";

type Props = {
  defaultValue?: string;
};

const TOOLBAR = ["B", "I", "U", "H₂", "H₃", "•", "1.", "—", "↩", "⇥"];

export default function RichTextEditor({ defaultValue }: Props) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: "6px 8px",
          border: "1px solid var(--color-base-800)",
          borderBottom: "none",
          borderRadius: "2px 2px 0 0",
          background: "var(--color-dark-base-primary)",
        }}
      >
        {TOOLBAR.map((t) => (
          <button
            key={t}
            type="button"
            style={{
              width: 28,
              height: 24,
              background: "transparent",
              border: "1px solid transparent",
              borderRadius: 2,
              color: "var(--color-base-400)",
              fontFamily: "var(--font-geist-mono)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <textarea
        rows={6}
        defaultValue={defaultValue}
        style={{
          width: "100%",
          padding: "12px 14px",
          background: "var(--color-dark-base-primary)",
          border: "1px solid var(--color-base-800)",
          borderRadius: "0 0 2px 2px",
          color: "var(--color-light-base-primary)",
          fontFamily: "var(--font-geist-sans)",
          fontSize: 14,
          lineHeight: 1.6,
          outline: "none",
          resize: "vertical",
        }}
      />
    </div>
  );
}
