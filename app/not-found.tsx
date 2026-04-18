"use client";

import { useState } from "react";
import Link from "next/link";
import Badge from "@/components/store/Badge";
import Button from "@/components/store/Button";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import { StoreThemeProvider } from "@/components/store/StoreTheme";

export default function NotFound() {
  const [query, setQuery] = useState("");

  return (
    <StoreThemeProvider>
      <StoreHeader />
      <main id="main">
        <section
          data-screen-label="01 404"
          style={{
            minHeight: "calc(100vh - 200px)",
            padding: "80px 40px",
            display: "grid",
            placeItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Massive 404 backdrop */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              pointerEvents: "none",
              fontFamily: "var(--font-geist-sans)",
              fontSize: "clamp(400px, 60vw, 900px)",
              color: "var(--color-dark-base-secondary)",
              letterSpacing: "-.08em",
              lineHeight: 0.8,
              opacity: 0.5,
            }}
          >
            404
          </div>

          <div
            style={{
              position: "relative",
              maxWidth: 720,
              width: "100%",
              zIndex: 1,
            }}
          >
            <Badge size="sm">Erro 404 · Página não encontrada</Badge>
            <h1
              className="heading-1"
              style={{ margin: "18px 0 0", color: "var(--color-light-base-primary)" }}
            >
              Esta página
              <br />
              desapareceu
              <br />
              no corte.
            </h1>
            <p
              className="text-body"
              style={{
                color: "var(--color-base-300)",
                marginTop: 20,
                maxWidth: "52ch",
              }}
            >
              O URL que tentou abrir não existe, foi movido, ou nunca foi
              pedido à fresadora. Talvez um destes caminhos o leve para onde
              queria ir.
            </p>

            {/* Suggested paths */}
            <div
              style={{
                marginTop: 36,
                border: "1px dashed var(--color-base-800)",
                borderRadius: 4,
                background:
                  "color-mix(in oklch, var(--color-dark-base-primary) 70%, transparent)",
                backdropFilter: "blur(8px)",
              }}
            >
              {[
                {
                  code: "01",
                  label: "Página inicial",
                  hint: "Voltar à loja",
                  href: "/",
                },
                {
                  code: "02",
                  label: "Catálogo completo",
                  hint: "Todos os produtos standard",
                  href: "/produtos",
                },
                {
                  code: "03",
                  label: "Pedir orçamento",
                  hint: "Peças à medida",
                  href: "/contacto",
                },
                {
                  code: "04",
                  label: "Contactar apoio",
                  hint: "apoio@jocril.pt · 244 827 141",
                  href: "/contacto",
                },
              ].map((r, i, arr) => (
                <Link
                  key={r.code}
                  href={r.href}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "60px 1fr auto",
                    alignItems: "center",
                    padding: "18px 22px",
                    cursor: "pointer",
                    textDecoration: "none",
                    borderBottom:
                      i < arr.length - 1
                        ? "1px dashed var(--color-base-800)"
                        : "none",
                  }}
                >
                  <span
                    className="text-mono-xs"
                    style={{ color: "var(--color-accent-100)" }}
                  >
                    ● {r.code}
                  </span>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-geist-sans)",
                        fontSize: 17,
                        color: "var(--color-light-base-primary)",
                        letterSpacing: "-.015em",
                      }}
                    >
                      {r.label}
                    </div>
                    <div
                      className="text-mono-xs"
                      style={{ color: "var(--color-base-500)", marginTop: 2 }}
                    >
                      {r.hint}
                    </div>
                  </div>
                  <span
                    style={{ color: "var(--color-base-600)", fontSize: 18 }}
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>

            {/* Search fallback */}
            <div style={{ marginTop: 32 }}>
              <div
                className="text-mono-xs"
                style={{
                  color: "var(--color-base-500)",
                  marginBottom: 10,
                  textTransform: "uppercase",
                }}
              >
                Ou procure diretamente
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Acrílico, expositor, tombola…"
                  style={{
                    flex: 1,
                    padding: "14px 16px",
                    background: "var(--color-dark-base-secondary)",
                    border: "1px dashed var(--color-base-700)",
                    borderRadius: 2,
                    color: "var(--color-light-base-primary)",
                    outline: "none",
                    fontFamily: "var(--font-geist-sans)",
                    fontSize: 15,
                    letterSpacing: "-.015em",
                  }}
                />
                <Button
                  variant="primary"
                  href={`/pesquisa?q=${encodeURIComponent(query)}`}
                >
                  Procurar
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <StoreFooter />
    </StoreThemeProvider>
  );
}
