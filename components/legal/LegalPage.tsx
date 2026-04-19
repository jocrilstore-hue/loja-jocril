"use client";

import { useEffect, useState, type ReactNode } from "react";
import Badge from "@/components/store/Badge";

interface LegalSection {
  id: string;
  kicker?: string;
  title: string;
  body?: string[];
  list?: string[];
  table?: {
    cols: string;
    head: string[];
    rows: string[][];
  };
}

interface Props {
  kicker: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
  footerSections?: ReactNode;
}

export default function LegalPage({
  kicker,
  title,
  intro,
  updated,
  sections,
  footerSections,
}: Props) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 140;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= y) {
          setActive(sections[i].id);
          return;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  return (
    <main id="main">
      {/* Hero */}
      <section
        style={{
          padding: "64px 40px 48px",
          borderBottom: "1px dashed var(--color-base-800)",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: 40,
            alignItems: "end",
          }}
        >
          <div>
            <Badge size="sm">{kicker}</Badge>
            <h1
              className="heading-1"
              style={{ margin: "16px 0 0", color: "var(--color-light-base-primary)" }}
            >
              {title}
            </h1>
          </div>
          <div>
            <p
              className="text-body"
              style={{
                color: "var(--color-base-300)",
                maxWidth: "48ch",
                marginBottom: 14,
              }}
            >
              {intro}
            </p>
            <div
              className="text-mono-xs"
              style={{
                color: "var(--color-base-500)",
                display: "flex",
                gap: 18,
                flexWrap: "wrap",
              }}
            >
              <span>● Última atualização · {updated}</span>
              <span style={{ color: "var(--color-base-700)" }}>·</span>
              <span>Documento vinculativo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section style={{ padding: "48px 40px 96px" }}>
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            gap: 64,
          }}
        >
          {/* ToC rail */}
          <aside style={{ position: "sticky", top: 96, alignSelf: "start" }}>
            <div
              className="text-mono-xs"
              style={{
                color: "var(--color-base-500)",
                paddingBottom: 10,
                borderBottom: "1px dashed var(--color-base-800)",
                marginBottom: 10,
                textTransform: "uppercase",
              }}
            >
              Índice
            </div>
            <ol
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "grid",
                gap: 2,
              }}
            >
              {sections.map((s, i) => {
                const on = s.id === active;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "28px 1fr",
                        gap: 8,
                        alignItems: "baseline",
                        padding: "8px 10px",
                        borderRadius: 2,
                        cursor: "pointer",
                        textDecoration: "none",
                        borderLeft: `2px solid ${
                          on ? "var(--color-accent-100)" : "transparent"
                        }`,
                        background: on
                          ? "var(--color-dark-base-secondary)"
                          : "transparent",
                      }}
                    >
                      <span
                        className="text-mono-xs"
                        style={{
                          color: on
                            ? "var(--color-accent-100)"
                            : "var(--color-base-600)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-geist-sans)",
                          fontSize: 13,
                          color: on
                            ? "var(--color-light-base-primary)"
                            : "var(--color-base-400)",
                          letterSpacing: "-.015em",
                          lineHeight: 1.35,
                        }}
                      >
                        {s.title}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
            <div
              style={{
                marginTop: 28,
                padding: 16,
                border: "1px dashed var(--color-base-800)",
                borderRadius: 2,
              }}
            >
              <div
                className="text-mono-xs"
                style={{ color: "var(--color-accent-100)", marginBottom: 6 }}
              >
                ● Dúvidas?
              </div>
              <div
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 13,
                  color: "var(--color-base-300)",
                  lineHeight: 1.5,
                }}
              >
                Contacte o nosso DPO através de{" "}
                <a
                  href="mailto:dpo@jocril.pt"
                  style={{ color: "var(--color-accent-100)" }}
                >
                  dpo@jocril.pt
                </a>
                .
              </div>
            </div>
          </aside>

          {/* Content */}
          <article style={{ maxWidth: 760 }}>
            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                style={{
                  scrollMarginTop: 120,
                  marginBottom: 48,
                  paddingBottom: 36,
                  borderBottom:
                    i < sections.length - 1
                      ? "1px dashed var(--color-base-900)"
                      : "none",
                }}
              >
                <div
                  className="text-mono-xs"
                  style={{ color: "var(--color-accent-100)", marginBottom: 10 }}
                >
                  {String(i + 1).padStart(2, "0")} · {s.kicker || "Secção"}
                </div>
                <h2
                  className="heading-2"
                  style={{
                    margin: 0,
                    color: "var(--color-light-base-primary)",
                  }}
                >
                  {s.title}
                </h2>
                {s.body && (
                  <div style={{ marginTop: 16 }}>
                    {s.body.map((p, j) => (
                      <p
                        key={j}
                        style={{
                          fontFamily: "var(--font-geist-sans)",
                          fontSize: 16,
                          lineHeight: 1.65,
                          color: "var(--color-base-300)",
                          margin: "12px 0",
                        }}
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                )}
                {s.list && (
                  <ul
                    style={{
                      margin: "16px 0",
                      padding: 0,
                      listStyle: "none",
                      borderTop: "1px dashed var(--color-base-800)",
                    }}
                  >
                    {s.list.map((item, j) => (
                      <li
                        key={j}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "28px 1fr",
                          gap: 10,
                          padding: "12px 0",
                          borderBottom: "1px dashed var(--color-base-800)",
                        }}
                      >
                        <span
                          className="text-mono-xs"
                          style={{ color: "var(--color-accent-100)" }}
                        >
                          ●
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-geist-sans)",
                            fontSize: 15,
                            color: "var(--color-base-300)",
                            lineHeight: 1.55,
                          }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.table && (
                  <div
                    style={{
                      marginTop: 16,
                      border: "1px dashed var(--color-base-800)",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: s.table.cols,
                        padding: "10px 16px",
                        background: "var(--color-dark-base-secondary)",
                        borderBottom: "1px dashed var(--color-base-800)",
                      }}
                    >
                      {s.table.head.map((h, k) => (
                        <span
                          key={k}
                          className="text-mono-xs"
                          style={{
                            color: "var(--color-base-500)",
                            textTransform: "uppercase",
                          }}
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                    {s.table.rows.map((row, k) => (
                      <div
                        key={k}
                        style={{
                          display: "grid",
                          gridTemplateColumns: s.table!.cols,
                          padding: "12px 16px",
                          borderBottom:
                            k < s.table!.rows.length - 1
                              ? "1px dashed var(--color-base-900)"
                              : "none",
                        }}
                      >
                        {row.map((cell, j) => (
                          <span
                            key={j}
                            style={{
                              fontFamily:
                                j === 0
                                  ? "var(--font-geist-mono)"
                                  : "var(--font-geist-sans)",
                              fontSize: j === 0 ? 12 : 14,
                              color:
                                j === 0
                                  ? "var(--color-accent-100)"
                                  : "var(--color-light-base-primary)",
                              letterSpacing:
                                j === 0 ? "-.015rem" : "-.015em",
                            }}
                          >
                            {cell}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}

            {footerSections}

            {/* Company block */}
            <div
              style={{
                marginTop: 48,
                padding: 24,
                border: "1px dashed var(--color-base-800)",
                borderRadius: 4,
                background: "var(--color-dark-base-secondary)",
              }}
            >
              <div
                className="text-mono-xs"
                style={{
                  color: "var(--color-base-500)",
                  marginBottom: 12,
                  textTransform: "uppercase",
                }}
              >
                Informações da empresa
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {(
                  [
                    [
                      "Razão social",
                      "Jocril — Sociedade Transformadora de Acrílicos, Lda.",
                    ],
                    ["NIF", "500 842 160"],
                    ["Matrícula", "C.R.C. Leiria"],
                    [
                      "Sede",
                      "Rua da Tipografia 14 · 2415-560 Leiria · Portugal",
                    ],
                    ["Telefone", "+351 244 827 141"],
                    ["Email DPO", "dpo@jocril.pt"],
                  ] as [string, string][]
                ).map(([l, v]) => (
                  <div key={l}>
                    <div
                      className="text-mono-xs"
                      style={{ color: "var(--color-base-500)" }}
                    >
                      {l}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-geist-sans)",
                        fontSize: 14,
                        color: "var(--color-light-base-primary)",
                        marginTop: 3,
                      }}
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
