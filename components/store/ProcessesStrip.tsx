import Badge from "./Badge";

const PROCESSES = [
  {
    n: "01",
    title: "Corte laser",
    img: "/assets/processes/gravacao.avif",
    caption: "Precisão sub-milimétrica em acrílico, MDF e metal",
  },
  {
    n: "02",
    title: "Fresa CNC",
    img: "/assets/processes/fresa.avif",
    caption: "Peças técnicas em 3 eixos, remoção de material",
  },
  {
    n: "03",
    title: "Moldagem térmica",
    img: "/assets/processes/moldagem.avif",
    caption: "Curvaturas, vacuum forming, peças únicas",
  },
  {
    n: "04",
    title: "Impressão & serigrafia",
    img: "/assets/processes/serigrafia.avif",
    caption: "UV directa em rígidos, tiragens curtas e longas",
  },
];

export default function ProcessesStrip() {
  return (
    <section
      data-screen-label="04 Processos"
      style={{
        padding: "100px 40px",
        background: "var(--color-dark-base-secondary)",
        borderTop: "1px solid var(--color-base-900)",
        borderBottom: "1px solid var(--color-base-900)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{ position: "relative", maxWidth: 1400, margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: 60,
            marginBottom: 48,
            alignItems: "end",
          }}
        >
          <div>
            <Badge size="sm">Processos Integrados</Badge>
            <h2
              className="heading-2"
              style={{
                margin: "20px 0 0 0",
                color: "var(--color-light-base-primary)",
                maxWidth: "16ch",
              }}
            >
              Não revendemos. Produzimos.
            </h2>
          </div>
          <p
            className="text-mono-md"
            style={{
              color: "var(--color-base-300)",
              maxWidth: "60ch",
              margin: 0,
            }}
          >
            Cada produto do catálogo sai da nossa fábrica em Massamá.
            Controlamos toda a cadeia — do corte ao acabamento — o que nos
            permite oferecer prazos curtos e consistência entre lotes.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
          }}
        >
          {PROCESSES.map((p) => (
            <article
              key={p.n}
              style={{
                border: "1px dashed var(--color-base-700)",
                borderRadius: 6,
                overflow: "hidden",
                background: "var(--color-dark-base-primary)",
              }}
            >
              <div
                style={{
                  aspectRatio: "5/3",
                  background: `url(${p.img}) center/cover`,
                }}
              />
              <div
                style={{
                  padding: "14px 16px",
                  borderTop: "1px dashed var(--color-base-700)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                  }}
                >
                  <span
                    className="text-mono-sm"
                    style={{ color: "var(--color-base-500)" }}
                  >
                    <span style={{ color: "var(--color-base-700)" }}>0</span>
                    {p.n.slice(1)}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-geist-sans)",
                      fontSize: 18,
                      letterSpacing: "-.03em",
                      color: "var(--color-light-base-primary)",
                    }}
                  >
                    {p.title}
                  </span>
                </div>
                <div className="text-body" style={{ marginTop: 8 }}>
                  {p.caption}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
