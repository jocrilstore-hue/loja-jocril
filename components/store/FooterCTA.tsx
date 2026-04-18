import Badge from "./Badge";
import Button from "./Button";

export default function FooterCTA() {
  return (
    <section
      data-screen-label="05 CTA"
      style={{
        padding: "100px 40px",
        background: "var(--color-dark-base-primary)",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          border: "1px dashed var(--color-base-600)",
          borderRadius: 8,
          padding: "56px 48px",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr auto",
          gap: 48,
          alignItems: "center",
          background: "var(--color-dark-base-secondary)",
        }}
      >
        <div>
          <Badge size="sm">Precisa de algo sob-medida?</Badge>
          <h2
            className="heading-2"
            style={{
              margin: "16px 0 0 0",
              color: "var(--color-light-base-primary)",
              maxWidth: "18ch",
            }}
          >
            Cada projecto começa com um{" "}
            <span style={{ color: "var(--color-accent-100)" }}>
              desenho técnico
            </span>
            .
          </h2>
        </div>
        <p
          className="text-mono-md"
          style={{
            color: "var(--color-base-300)",
            margin: 0,
            maxWidth: "44ch",
          }}
        >
          Além do catálogo, produzimos peças totalmente customizadas para marcas
          nacionais e internacionais. Do protótipo à série de 10 000 unidades.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            alignItems: "stretch",
          }}
        >
          <Button variant="solid" href="/contacto">
            Pedir orçamento →
          </Button>
          <Button variant="outline" href="https://jocril.pt">
            Ver jocril.pt ↗
          </Button>
        </div>
      </div>
    </section>
  );
}
