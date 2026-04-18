"use client";

import { useState } from "react";
import Badge from "./Badge";
import Button from "./Button";

type ProductMock = {
  sku: string;
  name: string;
  cat: string;
  material: string;
  from: number;
  tiers: string;
  img: string;
  stock: "in" | "low" | "made";
};

const PRODS: ProductMock[] = [
  {
    sku: "EXP-A3-06P",
    name: "Expositor A3 · 6 prateleiras",
    cat: "Acrílicos Chão",
    material: "Acrílico 5mm",
    from: 42.5,
    tiers: "1+ · 10+ · 100+",
    img: "/assets/portfolio/carm-premium.avif",
    stock: "in",
  },
  {
    sku: "CX-20-T",
    name: "Caixa transparente 20×20×20",
    cat: "Caixas",
    material: "Acrílico 3mm",
    from: 14.9,
    tiers: "5+ · 25+ · 100+",
    img: "/assets/portfolio/beefeater.avif",
    stock: "in",
  },
  {
    sku: "MOL-30×40",
    name: "Moldura suspensa 30×40",
    cat: "Molduras",
    material: "Acrílico 4mm",
    from: 19.8,
    tiers: "2+ · 10+",
    img: "/assets/portfolio/rayban.avif",
    stock: "low",
  },
  {
    sku: "EXP-MESA-4",
    name: "Expositor de mesa 4 níveis",
    cat: "Acrílicos Mesa",
    material: "Acrílico 5mm",
    from: 28.0,
    tiers: "1+ · 10+",
    img: "/assets/portfolio/stoli.avif",
    stock: "in",
  },
  {
    sku: "TOMB-CLASSIC",
    name: "Tombola clássica ø250",
    cat: "Tombolas",
    material: "Acrílico 5mm",
    from: 165.0,
    tiers: "1+",
    img: "/assets/portfolio/glade.avif",
    stock: "made",
  },
  {
    sku: "SIG-PAR-A4",
    name: "Bolsa de parede A4",
    cat: "Sinalética",
    material: "Acrílico 3mm",
    from: 9.8,
    tiers: "10+ · 50+ · 250+",
    img: "/assets/portfolio/bioderma.avif",
    stock: "in",
  },
  {
    sku: "EXP-PAR-FOL",
    name: "Porta-folhetos parede A5",
    cat: "Acrílicos Parede",
    material: "Acrílico 3mm",
    from: 7.5,
    tiers: "10+ · 100+",
    img: "/assets/portfolio/ricola.avif",
    stock: "in",
  },
  {
    sku: "EXP-COS-03",
    name: "Display cosmético 3 níveis",
    cat: "Acrílicos Mesa",
    material: "Acrílico 4mm",
    from: 24.0,
    tiers: "1+ · 20+",
    img: "/assets/portfolio/loreal.avif",
    stock: "low",
  },
];

const STOCK_MAP = {
  in: { color: "var(--color-accent-100)", label: "Em stock" },
  low: { color: "#eab308", label: "Últimas unidades" },
  made: { color: "var(--color-base-500)", label: "Produção por encomenda" },
};

export default function FeaturedProducts() {
  const [filter, setFilter] = useState<string>("all");
  const cats = ["all", ...Array.from(new Set(PRODS.map((p) => p.cat)))];
  const items =
    filter === "all" ? PRODS : PRODS.filter((p) => p.cat === filter);

  return (
    <section
      data-screen-label="03 Em destaque"
      style={{
        padding: "60px 40px 100px",
        background: "var(--color-dark-base-primary)",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            gap: 40,
            marginBottom: 36,
          }}
        >
          <div>
            <Badge size="sm">Em destaque</Badge>
            <h2
              className="heading-2"
              style={{
                margin: "20px 0 0 0",
                color: "var(--color-light-base-primary)",
                maxWidth: "24ch",
              }}
            >
              Mais pedidos esta semana.
            </h2>
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              maxWidth: 520,
              justifyContent: "flex-end",
            }}
          >
            {cats.map((c) => {
              const active = filter === c;
              return (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  style={{
                    height: 28,
                    padding: "0 12px",
                    borderRadius: 999,
                    background: active
                      ? "var(--color-light-base-secondary)"
                      : "transparent",
                    color: active
                      ? "var(--color-dark-base-primary)"
                      : "var(--color-base-400)",
                    border: `1px solid ${
                      active ? "transparent" : "var(--color-base-700)"
                    }`,
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 11,
                    letterSpacing: "-.015rem",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  {c === "all" ? "Tudo" : c}
                </button>
              );
            })}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {items.map((p) => (
            <ProductCard key={p.sku} p={p} />
          ))}
        </div>

        <div
          style={{
            marginTop: 40,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button variant="outline" href="/produtos">
            Ver todos os 183 produtos →
          </Button>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p }: { p: ProductMock }) {
  const [hover, setHover] = useState(false);
  const stock = STOCK_MAP[p.stock];
  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: `1px dashed ${
          hover ? "var(--color-accent-100)" : "var(--color-base-700)"
        }`,
        borderRadius: 6,
        overflow: "hidden",
        background: "var(--color-dark-base-secondary)",
        display: "flex",
        flexDirection: "column",
        transition: "border-color .2s var(--ease-in-out)",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "4/3",
          overflow: "hidden",
          background: "var(--color-dark-base-primary)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: `url(${p.img}) center/cover`,
            transform: hover ? "scale(1.04)" : "scale(1)",
            transition: "transform .5s var(--ease-out)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            display: "flex",
            gap: 6,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "3px 8px",
              background: "var(--color-dark-base-secondary)",
              border: "1px solid var(--color-base-700)",
              borderRadius: 2,
              fontFamily: "var(--font-geist-mono)",
              fontSize: 10,
              letterSpacing: "-.01rem",
              textTransform: "uppercase",
              color: "var(--color-base-200)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: stock.color,
              }}
            />
            {stock.label}
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            opacity: hover ? 1 : 0,
            transition: "opacity .2s",
          }}
        >
          <button
            style={{
              height: 30,
              padding: "0 12px",
              background: "var(--color-light-base-secondary)",
              color: "var(--color-dark-base-primary)",
              border: "none",
              borderRadius: 2,
              cursor: "pointer",
              fontFamily: "var(--font-geist-mono)",
              fontSize: 11,
              letterSpacing: "-.015rem",
              textTransform: "uppercase",
            }}
          >
            Ver produto →
          </button>
        </div>
      </div>
      <div
        style={{
          padding: "14px 16px",
          borderTop: "1px dashed var(--color-base-700)",
          display: "grid",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 10,
          }}
        >
          <span
            className="text-mono-xs"
            style={{ color: "var(--color-base-500)" }}
          >
            {p.sku}
          </span>
          <span
            className="text-mono-xs"
            style={{ color: "var(--color-base-500)" }}
          >
            {p.material}
          </span>
        </div>
        <div
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 15,
            letterSpacing: "-.03em",
            color: hover
              ? "var(--color-accent-100)"
              : "var(--color-light-base-primary)",
            lineHeight: 1.2,
            transition: "color .2s",
          }}
        >
          {p.name}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            marginTop: 6,
            paddingTop: 10,
            borderTop: "1px solid var(--color-base-900)",
          }}
        >
          <div>
            <div
              className="text-mono-xs"
              style={{ color: "var(--color-base-500)" }}
            >
              Desde
            </div>
            <div
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 18,
                letterSpacing: "-.04em",
                color: "var(--color-light-base-primary)",
                marginTop: 2,
              }}
            >
              € {p.from.toFixed(2).replace(".", ",")}
            </div>
          </div>
          <span
            className="text-mono-xs"
            style={{
              color: "var(--color-base-600)",
              textAlign: "right",
            }}
          >
            Escalões
            <br />
            {p.tiers}
          </span>
        </div>
      </div>
    </article>
  );
}
