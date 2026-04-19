import type { ReactNode } from "react";

export default function FormCard({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        border: "1px dashed var(--color-base-800)",
        borderRadius: 4,
        background: "var(--color-dark-base-secondary)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px dashed var(--color-base-800)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 16,
            color: "var(--color-light-base-primary)",
            letterSpacing: "-.02em",
          }}
        >
          {title}
        </div>
        {desc && (
          <div
            className="text-mono-xs"
            style={{ color: "var(--color-base-500)", marginTop: 3 }}
          >
            {desc}
          </div>
        )}
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}
