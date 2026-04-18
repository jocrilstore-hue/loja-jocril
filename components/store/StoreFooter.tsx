import Link from "next/link";
import Button from "./Button";

const COLS: { h: string; items: [string, string][] }[] = [
  {
    h: "Loja",
    items: [
      ["Todos os produtos", "/produtos"],
      ["Novidades", "/produtos?sort=novidades"],
      ["Promoções", "/produtos?sort=promocoes"],
      ["Escalões de preço", "/produtos?tier=escaloes"],
    ],
  },
  {
    h: "Categorias",
    items: [
      ["Acrílicos Chão", "/produtos?cat=acrilicos-chao"],
      ["Acrílicos Mesa", "/produtos?cat=acrilicos-mesa"],
      ["Caixas", "/produtos?cat=caixas"],
      ["Molduras", "/produtos?cat=molduras"],
      ["Tombolas", "/produtos?cat=tombolas"],
    ],
  },
  {
    h: "Apoio",
    items: [
      ["Envios e prazos", "/legais/envios"],
      ["Devoluções", "/legais/devolucoes"],
      ["FAQ", "/faq"],
      ["Orçamentos custom", "/contacto"],
    ],
  },
  {
    h: "Empresa",
    items: [
      ["Sobre a Jocril", "/sobre"],
      ["Processos", "/processos"],
      ["Portfolio", "/portfolio"],
      ["Contacto", "/contacto"],
    ],
  },
];

export default function StoreFooter() {
  return (
    <footer
      style={{
        padding: "72px 40px 32px",
        background: "var(--color-dark-base-primary)",
        borderTop: "1px solid var(--color-base-900)",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.4fr repeat(4, 1fr)",
          gap: 48,
        }}
      >
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/jocril-logo.svg"
            style={{
              width: 75,
              height: "auto",
              filter: "var(--logo-filter, invert(1))",
            }}
            alt="Jocril"
          />
          <p
            className="text-mono-md"
            style={{
              color: "var(--color-base-400)",
              margin: "20px 0 24px 0",
              maxWidth: "36ch",
            }}
          >
            Ideias &amp; Precisão. Acrílico, madeira, metal. Vialonga, Portugal.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="pill">Newsletter</Button>
          </div>
          <div style={{ marginTop: 24 }}>
            <div
              className="text-mono-xs"
              style={{ color: "var(--color-base-500)" }}
            >
              Pagamentos aceites
            </div>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {["MBWay", "Multibanco", "Visa", "Mastercard", "Transferência"].map(
                (m) => (
                  <span
                    key={m}
                    style={{
                      padding: "4px 10px",
                      border: "1px solid var(--color-base-800)",
                      borderRadius: 2,
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: 11,
                      letterSpacing: "-.015rem",
                      textTransform: "uppercase",
                      color: "var(--color-base-400)",
                    }}
                  >
                    {m}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
        {COLS.map((c) => (
          <div key={c.h}>
            <div
              className="text-mono-xs"
              style={{ color: "var(--color-base-500)" }}
            >
              {c.h}
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "16px 0 0",
                display: "grid",
                gap: 10,
              }}
            >
              {c.items.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    style={{
                      cursor: "pointer",
                      fontFamily: "var(--font-geist-sans)",
                      fontSize: 14,
                      color: "var(--color-base-200)",
                      textDecoration: "none",
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div
        style={{
          maxWidth: 1400,
          margin: "48px auto 0",
          paddingTop: 20,
          borderTop: "1px solid var(--color-base-900)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          className="text-mono-xs"
          style={{ color: "var(--color-base-600)" }}
        >
          © 1994–2026 Jocril, Lda. · NIF 123456789
        </div>
        <div style={{ display: "flex", gap: 18 }}>
          {(
            [
              ["Termos", "/legais/termos"],
              ["Privacidade", "/legais/privacidade"],
              ["Cookies", "/legais/cookies"],
            ] as [string, string][]
          ).map(([l, h]) => (
            <Link
              key={l}
              href={h}
              className="text-mono-xs"
              style={{
                color: "#737373",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              {l}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
