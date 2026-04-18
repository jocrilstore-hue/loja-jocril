export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 32,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          className="text-mono-xs"
          style={{
            color: "var(--color-accent-100)",
            marginBottom: 12,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: "var(--color-accent-300)",
              display: "inline-block",
            }}
          />
          LOJA ONLINE · SCAFFOLD
        </div>
        <h1
          className="heading-1"
          style={{
            margin: 0,
            fontSize: 72,
            letterSpacing: "-0.08em",
            lineHeight: 1,
            color: "var(--color-light-base-primary)",
          }}
        >
          Jocril
        </h1>
        <p
          style={{
            marginTop: 16,
            color: "var(--color-base-500)",
            fontFamily: "var(--font-geist-mono)",
            fontSize: 13,
            letterSpacing: "-0.015rem",
          }}
        >
          Ideias &amp; Precisão · Next.js 16 · dark theme active · Geist loaded
        </p>
      </div>
    </main>
  );
}
