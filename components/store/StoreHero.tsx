import Badge from "./Badge";
import Button from "./Button";

export default function StoreHero() {
  return (
    <section
      data-screen-label="01 Home"
      style={{
        position: "relative",
        padding: "72px 40px 56px",
        background: "var(--color-dark-base-primary)",
        borderBottom: "1px solid var(--color-base-900)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: 1400,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.35fr 1fr",
          gap: 56,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 48,
            minHeight: 520,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            <Badge size="sm">Loja Online · Catálogo</Badge>
            <span
              className="text-mono-xs"
              style={{ color: "var(--color-base-600)" }}
            >
              183 referências em stock
            </span>
          </div>

          <div>
            <h1
              className="heading-1"
              style={{
                margin: 0,
                color: "var(--color-light-base-primary)",
              }}
            >
              Expositores
              <br />
              em acrílico,
              <br />
              <span style={{ color: "var(--color-accent-100)" }}>
                prontos a enviar.
              </span>
            </h1>
            <p
              className="text-mono-md"
              style={{
                marginTop: 28,
                color: "var(--color-base-400)",
                maxWidth: "46ch",
              }}
            >
              Catálogo de expositores, caixas, molduras e sinalética em acrílico
              — produzidos na nossa fábrica em Vialonga. Envio 48h para stock,
              5–10 dias úteis por encomenda.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Button variant="solid" href="/produtos">
              Ver catálogo →
            </Button>
            <Button variant="outline" href="/contacto">
              Orçamento custom
            </Button>
            <span
              className="text-mono-xs"
              style={{
                color: "var(--color-base-600)",
                marginLeft: "auto",
              }}
            >
              <span style={{ color: "var(--color-accent-100)" }}>●</span> Em
              produção · lote #1247
            </span>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            border: "1px dashed var(--color-base-600)",
            borderRadius: 6,
            overflow: "hidden",
            background: "var(--color-dark-base-secondary)",
            minHeight: 520,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              flex: 1,
              background:
                "url(/assets/portfolio/carm-premium.avif) center/cover",
              minHeight: 340,
            }}
          />
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px dashed var(--color-base-700)",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 16,
              alignItems: "end",
            }}
          >
            <div>
              <div
                className="text-mono-xs"
                style={{ color: "var(--color-base-500)" }}
              >
                Destaque · Acrílicos Chão
              </div>
              <div
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 22,
                  letterSpacing: "-.02em",
                  color: "var(--color-light-base-primary)",
                  marginTop: 8,
                }}
              >
                Expositor modular A3
              </div>
              <div className="text-body" style={{ marginTop: 6 }}>
                Acrílico 5mm · 6 prateleiras · 4 dimensões
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                className="text-mono-xs"
                style={{ color: "var(--color-base-500)" }}
              >
                Desde
              </div>
              <div
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 32,
                  letterSpacing: "-.04em",
                  color: "var(--color-light-base-primary)",
                  marginTop: 4,
                }}
              >
                € 42,50
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
