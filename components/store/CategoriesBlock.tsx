"use client";

import Link from "next/link";
import { useState } from "react";
import Badge from "./Badge";

export type CategoryCardItem = {
  n: string;
  name: string;
  count: number;
  img: string;
  href: string;
};

// Prop-driven. Homepage passes categories fetched from DB + CATEGORY_META.
export default function CategoriesBlock({ cats = [] }: { cats?: CategoryCardItem[] }) {
  const [hover, setHover] = useState<string | null>(null);
  const CATS = cats;
  return (
    <section
      data-screen-label="02 Categorias"
      id="categorias"
      style={{
        padding: "100px 40px 60px",
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
            marginBottom: 40,
          }}
        >
          <div>
            <Badge size="sm">Categorias</Badge>
            <h2
              className="heading-2"
              style={{
                margin: "20px 0 0 0",
                color: "var(--color-light-base-primary)",
                maxWidth: "22ch",
              }}
            >
              Seis famílias de produto, todas produzidas internamente.
            </h2>
          </div>
          <Link
            href="/categorias"
            className="text-mono-sm"
            style={{
              cursor: "pointer",
              color: "var(--color-base-300)",
              whiteSpace: "nowrap",
            }}
          >
            Ver todas as categorias →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {CATS.map((c) => {
            const h = hover === c.n;
            return (
              <Link
                key={c.n}
                href={c.href}
                onMouseEnter={() => setHover(c.n)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer", display: "block" }}
              >
                <article
                  style={{
                    border: `1px dashed ${
                      h ? "var(--color-accent-100)" : "var(--color-base-700)"
                    }`,
                    borderRadius: 6,
                    overflow: "hidden",
                    background: "var(--color-dark-base-secondary)",
                    transition: "border-color .2s var(--ease-in-out)",
                  }}
                >
                  <div
                    style={{
                      aspectRatio: "1 / 1",
                      overflow: "hidden",
                      background: `url(${c.img}) center/cover`,
                      transform: h ? "scale(1.03)" : "scale(1)",
                      transition: "transform .5s var(--ease-out)",
                    }}
                  />
                  <div
                    style={{
                      padding: "16px 18px",
                      borderTop: "1px dashed var(--color-base-700)",
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      gap: 14,
                      alignItems: "center",
                    }}
                  >
                    <span
                      className="text-mono-sm"
                      style={{
                        color: h
                          ? "var(--color-accent-100)"
                          : "var(--color-base-500)",
                      }}
                    >
                      <span style={{ color: "var(--color-base-700)" }}>0</span>
                      {c.n.slice(1)}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-geist-sans)",
                        fontSize: 20,
                        letterSpacing: "-.04em",
                        color: "var(--color-light-base-primary)",
                      }}
                    >
                      {c.name}
                    </span>
                    <span
                      className="text-mono-xs"
                      style={{ color: "var(--color-base-500)" }}
                    >
                      {c.count} ref.
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
