"use client";

import { useEffect } from "react";
import Badge from "@/components/store/Badge";
import Button from "@/components/store/Button";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import { StoreThemeProvider } from "@/components/store/StoreTheme";

const incidentRef =
  "INC-" +
  Math.random().toString(36).slice(2, 8).toUpperCase() +
  "-" +
  Date.now().toString().slice(-6);

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StoreThemeProvider>
      <StoreHeader />
      <main id="main">
        <section
          data-screen-label="01 500"
          style={{
            minHeight: "calc(100vh - 200px)",
            padding: "80px 40px",
            display: "grid",
            placeItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
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
              opacity: 0.45,
            }}
          >
            500
          </div>

          <div
            style={{
              position: "relative",
              maxWidth: 720,
              width: "100%",
              zIndex: 1,
            }}
          >
            <Badge size="sm">Erro 500 · Falha no servidor</Badge>
            <h1
              className="heading-1"
              style={{ margin: "18px 0 0", color: "var(--color-light-base-primary)" }}
            >
              Algo partiu
              <br />
              do nosso lado.
            </h1>
            <p
              className="text-body"
              style={{
                color: "var(--color-base-300)",
                marginTop: 20,
                maxWidth: "52ch",
              }}
            >
              O nosso sistema não conseguiu completar o pedido. Já recebemos o
              alerta e a equipa técnica está a investigar. Pode tentar novamente
              dentro de alguns minutos.
            </p>

            {/* Incident card */}
            <div
              style={{
                marginTop: 36,
                border: "1px dashed var(--color-base-800)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  padding: "14px 20px",
                  background: "var(--color-dark-base-secondary)",
                  borderBottom: "1px dashed var(--color-base-800)",
                }}
              >
                <span
                  className="text-mono-xs"
                  style={{
                    color: "var(--color-base-500)",
                    textTransform: "uppercase",
                  }}
                >
                  Ref.
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 13,
                    color: "var(--color-accent-100)",
                  }}
                >
                  {incidentRef}
                </span>
              </div>
              {(
                [
                  ["Timestamp", new Date().toLocaleString("pt-PT")],
                  ["Serviço", "checkout-service · api.jocril.pt"],
                  ["Estado", "Investigação em curso"],
                  ["ETA", "≤ 15 minutos"],
                ] as [string, string][]
              ).map(([l, v], i, arr) => (
                <div
                  key={l}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    padding: "12px 20px",
                    borderBottom:
                      i < arr.length - 1
                        ? "1px dashed var(--color-base-900)"
                        : "none",
                  }}
                >
                  <span
                    className="text-mono-xs"
                    style={{
                      color: "var(--color-base-500)",
                      textTransform: "uppercase",
                    }}
                  >
                    {l}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-geist-sans)",
                      fontSize: 14,
                      color: "var(--color-light-base-primary)",
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 24,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <Button variant="primary" onClick={reset}>
                Tentar novamente
              </Button>
              <Button variant="secondary" href="/">
                Ir para a página inicial
              </Button>
              <Button variant="ghost" href="/contacto">
                Contactar suporte
              </Button>
            </div>

            <p
              className="text-mono-xs"
              style={{ color: "var(--color-base-500)", marginTop: 24 }}
            >
              Se o problema persistir, inclua a referência{" "}
              <span style={{ color: "var(--color-accent-100)" }}>
                {incidentRef}
              </span>{" "}
              no contacto com o apoio.
            </p>
          </div>
        </section>
      </main>
      <StoreFooter />
    </StoreThemeProvider>
  );
}
