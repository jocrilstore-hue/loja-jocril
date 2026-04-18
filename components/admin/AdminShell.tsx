"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";

export type AdminActiveKey =
  | "dash"
  | "orders"
  | "products"
  | "customers"
  | "product-list"
  | "product-form"
  | "admin"
  | "variant-form"
  | "price"
  | "ship"
  | "discounts"
  | "taxes"
  | "team"
  | "settings"
  | "emails"
  | "components"
  | "tiers"
  | null;

type Props = {
  active?: AdminActiveKey;
  breadcrumbs?: string[];
  children: ReactNode;
};

export default function AdminShell({ active, breadcrumbs, children }: Props) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-dark-base-primary)",
        color: "var(--color-light-base-primary)",
      }}
    >
      <AdminHeader />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          minHeight: "calc(100vh - 60px)",
        }}
      >
        <AdminSidebar active={active ?? null} />
        <main
          id="main"
          style={{
            padding: 32,
            borderLeft: "1px solid var(--color-base-900)",
          }}
        >
          {breadcrumbs && <AdminBreadcrumbs crumbs={breadcrumbs} />}
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminHeader() {
  return (
    <header
      style={{
        height: 60,
        padding: "0 24px",
        borderBottom: "1px solid var(--color-base-900)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "var(--color-dark-base-primary)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <Link
          href="/"
          title="Ir para a loja"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/jocril-logo.svg"
            style={{
              width: 75,
              height: "auto",
              filter: "var(--logo-filter, invert(1)) brightness(.95)",
            }}
            alt="Jocril"
          />
        </Link>
        <span
          className="text-mono-xs"
          style={{
            color: "var(--color-base-500)",
            padding: "4px 10px",
            border: "1px dashed var(--color-base-700)",
            borderRadius: 2,
          }}
        >
          Backoffice · v2.4
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "7px 12px",
            border: "1px solid var(--color-base-800)",
            borderRadius: 2,
            minWidth: 300,
            background: "var(--color-dark-base-secondary)",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-base-500)"
            strokeWidth="1.5"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <span
            className="text-mono-xs"
            style={{ color: "var(--color-base-500)", flex: 1 }}
          >
            Pesquisar encomendas, produtos, clientes…
          </span>
          <span
            className="text-mono-xs"
            style={{
              color: "var(--color-base-700)",
              padding: "1px 5px",
              border: "1px solid var(--color-base-800)",
              borderRadius: 2,
            }}
          >
            ⌘K
          </span>
        </div>
        <Link
          href="/"
          className="text-mono-xs"
          style={{
            background: "transparent",
            border: "1px solid var(--color-base-800)",
            color: "var(--color-base-400)",
            padding: "8px 12px",
            borderRadius: 2,
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: "-.015rem",
            textDecoration: "none",
          }}
        >
          <span style={{ color: "var(--color-accent-300)" }}>●</span> Ver loja
        </Link>
        <AdminAvatarMenu />
      </div>
    </header>
  );
}

type SidebarItem = { k: AdminActiveKey; t: string; href: string; n?: string };

const SECTIONS: { label: string; items: SidebarItem[] }[] = [
  {
    label: "Principal",
    items: [
      { k: "dash", t: "Painel", href: "/admin" },
      { k: "orders", t: "Encomendas", href: "/admin/encomendas", n: "14" },
      { k: "products", t: "Produtos", href: "/admin/produtos", n: "183" },
      { k: "customers", t: "Clientes", href: "/admin/clientes", n: "642" },
    ],
  },
  {
    label: "Produtos",
    items: [
      { k: "product-list", t: "Lista de produtos", href: "/admin/produtos" },
      { k: "product-form", t: "Criar produto", href: "/admin/produtos/novo" },
      { k: "admin", t: "Editor de produto", href: "/admin/produtos/1" },
      {
        k: "variant-form",
        t: "Editor de variante",
        href: "/admin/produtos/1/variante/1",
      },
      { k: "price", t: "Escalões de preço", href: "/admin/escaloes-preco" },
    ],
  },
  {
    label: "Configuração",
    items: [
      { k: "ship", t: "Envios e zonas", href: "/admin/definicoes/envios" },
      {
        k: "discounts",
        t: "Descontos",
        href: "/admin/definicoes/descontos",
      },
      { k: "taxes", t: "IVA e impostos", href: "/admin/definicoes/impostos" },
      { k: "team", t: "Equipa", href: "/admin/definicoes/equipa" },
      { k: "settings", t: "Definições gerais", href: "/admin/definicoes" },
    ],
  },
];

function AdminSidebar({ active }: { active: AdminActiveKey }) {
  return (
    <aside
      style={{
        padding: "24px 16px",
        background: "var(--color-dark-base-primary)",
      }}
    >
      {SECTIONS.map((s) => (
        <div key={s.label} style={{ marginBottom: 28 }}>
          <div
            className="text-mono-xs"
            style={{
              color: "var(--color-base-600)",
              padding: "0 8px 8px",
              borderBottom: "1px dashed var(--color-base-900)",
              marginBottom: 4,
            }}
          >
            {s.label}
          </div>
          {s.items.map((it) => {
            const on = it.k === active;
            return (
              <Link
                key={`${s.label}-${it.k}`}
                href={it.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 10px",
                  cursor: "pointer",
                  borderRadius: 2,
                  textDecoration: "none",
                  background: on
                    ? "var(--color-dark-base-secondary)"
                    : "transparent",
                  borderLeft: `2px solid ${
                    on ? "var(--color-accent-100)" : "transparent"
                  }`,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-geist-sans)",
                    fontSize: 14,
                    color: on
                      ? "var(--color-light-base-primary)"
                      : "var(--color-base-300)",
                    letterSpacing: "-.02em",
                  }}
                >
                  {it.t}
                </span>
                {it.n && (
                  <span
                    className="text-mono-xs"
                    style={{
                      color: on
                        ? "var(--color-accent-100)"
                        : "var(--color-base-600)",
                    }}
                  >
                    {it.n}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}

function AdminBreadcrumbs({ crumbs }: { crumbs: string[] }) {
  return (
    <div
      className="text-mono-xs"
      style={{
        color: "var(--color-base-600)",
        marginBottom: 18,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {crumbs.map((c, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <span style={{ color: "var(--color-base-800)" }}>/</span>
          )}
          <span
            style={{
              color:
                i === crumbs.length - 1
                  ? "var(--color-light-base-primary)"
                  : "var(--color-base-500)",
            }}
          >
            {c}
          </span>
        </Fragment>
      ))}
    </div>
  );
}

function AdminAvatarMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(!open)}
        title="A minha conta"
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          background: "var(--color-accent-100)",
          color: "var(--color-dark-base-primary)",
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-geist-mono)",
          fontSize: 12,
          cursor: "pointer",
          border: open
            ? "2px solid var(--color-light-base-primary)"
            : "2px solid transparent",
        }}
      >
        MI
      </div>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            zIndex: 200,
            minWidth: 200,
            background: "var(--color-dark-base-secondary)",
            border: "1px solid var(--color-base-800)",
            borderRadius: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,.5)",
            padding: 4,
          }}
        >
          <div
            style={{
              padding: "10px 12px 8px",
              borderBottom: "1px dashed var(--color-base-800)",
              marginBottom: 4,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 14,
                color: "var(--color-light-base-primary)",
              }}
            >
              Maria Inácio
            </div>
            <div
              className="text-mono-xs"
              style={{ color: "var(--color-base-500)", marginTop: 2 }}
            >
              Administrador
            </div>
          </div>
          {(
            [
              ["Ver loja", "/"],
              ["Minha conta", "/conta"],
              ["Definições", "/admin/definicoes"],
            ] as [string, string][]
          ).map(([l, h]) => (
            <Link
              key={l}
              href={h}
              style={{
                display: "block",
                padding: "8px 12px",
                fontFamily: "var(--font-geist-sans)",
                fontSize: 13,
                color: "var(--color-base-300)",
                textDecoration: "none",
                borderRadius: 2,
              }}
            >
              {l}
            </Link>
          ))}
          <div
            style={{
              height: 1,
              background: "var(--color-base-800)",
              margin: "4px 0",
            }}
          />
          <Link
            href="/admin/login"
            style={{
              display: "block",
              padding: "8px 12px",
              fontFamily: "var(--font-geist-sans)",
              fontSize: 13,
              color: "var(--color-base-500)",
              textDecoration: "none",
              borderRadius: 2,
            }}
          >
            Terminar sessão
          </Link>
        </div>
      )}
    </div>
  );
}

/** Reusable card block for admin sub-pages. */
export function AdminCard({
  title,
  right,
  children,
  padded,
}: {
  title: string;
  right?: ReactNode;
  children: ReactNode;
  padded?: boolean;
}) {
  return (
    <div
      style={{
        border: "1px dashed var(--color-base-800)",
        borderRadius: 4,
        background: "var(--color-dark-base-secondary)",
      }}
    >
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px dashed var(--color-base-800)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          className="text-mono-sm"
          style={{
            color: "var(--color-base-300)",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
        {right}
      </div>
      <div style={padded ? { padding: 18 } : {}}>{children}</div>
    </div>
  );
}
