import Badge from "@/components/store/Badge";

const ETA = "17 Abril · 22h00 WET";

export default function ManutencaoPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-dark-base-primary)",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
      }}
    >
      {/* Minimal header */}
      <header
        style={{
          padding: "18px 40px",
          borderBottom: "1px dashed var(--color-base-800)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 2,
              background: "var(--color-dark-base-secondary)",
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--font-geist-sans)",
              fontSize: 13,
              color: "var(--color-accent-100)",
              fontStyle: "italic",
            }}
          >
            J
          </div>
          <span
            className="text-mono-xs"
            style={{ color: "var(--color-base-400)" }}
          >
            JOCRIL · LOJA ONLINE
          </span>
        </div>
        <span
          className="text-mono-xs"
          style={{ color: "var(--color-accent-100)" }}
        >
          ● Em manutenção
        </span>
      </header>

      {/* Body */}
      <section
        data-screen-label="01 Maintenance"
        style={{ padding: "80px 40px", display: "grid", placeItems: "center" }}
      >
        <div style={{ maxWidth: 780, width: "100%" }}>
          <Badge size="sm">Atualização programada</Badge>
          <h1
            className="heading-1"
            style={{ margin: "18px 0 0", color: "var(--color-light-base-primary)" }}
          >
            Voltamos já.
          </h1>
          <p
            className="text-body"
            style={{
              color: "var(--color-base-300)",
              marginTop: 24,
              maxWidth: "56ch",
              fontSize: 19,
            }}
          >
            Estamos a efetuar uma atualização de sistema para melhorar o
            desempenho do catálogo e adicionar novos escalões de preço. A loja
            voltará ao ar em breve.
          </p>

          {/* Countdown */}
          <div
            style={{
              marginTop: 40,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
            }}
          >
            {(
              [
                ["00", "Dias"],
                ["01", "Horas"],
                ["42", "Min"],
                ["18", "Seg"],
              ] as [string, string][]
            ).map(([v, l]) => (
              <div
                key={l}
                style={{
                  padding: "22px 20px",
                  border: "1px dashed var(--color-base-800)",
                  borderRadius: 2,
                  background: "var(--color-dark-base-secondary)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-geist-sans)",
                    fontSize: 56,
                    lineHeight: 1,
                    letterSpacing: "-.04em",
                    color: "var(--color-light-base-primary)",
                  }}
                >
                  {v}
                </div>
                <div
                  className="text-mono-xs"
                  style={{
                    color: "var(--color-base-500)",
                    marginTop: 8,
                    textTransform: "uppercase",
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>

          {/* Status bar */}
          <div
            style={{
              marginTop: 32,
              padding: "18px 22px",
              border: "1px dashed var(--color-base-800)",
              borderRadius: 2,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 24,
            }}
          >
            {(
              [
                ["Estado", "Deploy em curso"],
                ["Previsão", ETA],
                ["Status page", "status.jocril.pt"],
              ] as [string, string][]
            ).map(([l, v]) => (
              <div key={l}>
                <div
                  className="text-mono-xs"
                  style={{
                    color: "var(--color-base-500)",
                    textTransform: "uppercase",
                  }}
                >
                  {l}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-geist-sans)",
                    fontSize: 15,
                    color: "var(--color-light-base-primary)",
                    marginTop: 4,
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>

          <p
            className="text-mono-xs"
            style={{ color: "var(--color-base-500)", marginTop: 28 }}
          >
            Encomendas urgentes? Escreva para{" "}
            <span style={{ color: "var(--color-accent-100)" }}>
              apoio@jocril.pt
            </span>{" "}
            ou ligue{" "}
            <span style={{ color: "var(--color-accent-100)" }}>
              +351 244 827 141
            </span>
            .
          </p>
        </div>
      </section>

      <footer
        style={{
          padding: "18px 40px",
          borderTop: "1px dashed var(--color-base-800)",
        }}
        className="text-mono-xs"
      >
        <span style={{ color: "var(--color-base-500)" }}>
          © Jocril, Lda. · NIF 500 842 160
        </span>
      </footer>
    </div>
  );
}
