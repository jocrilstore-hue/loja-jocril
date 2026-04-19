"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useCart } from "@/contexts/cart-context";
import { ThemeToggle } from "./StoreTheme";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

type NavKey = "home" | "produtos" | "categorias" | "sobre" | "contacto";

type Props = {
  active?: NavKey;
  onOpenCart?: () => void;
};

const NAV: { key: Exclude<NavKey, "home">; label: string; href: string }[] = [
  { key: "produtos", label: "Produtos", href: "/produtos" },
  { key: "categorias", label: "Categorias", href: "/categorias" },
  { key: "sobre", label: "Sobre", href: "/sobre" },
  { key: "contacto", label: "Contacto", href: "/contacto" },
];

const CATS: [string, string][] = [
  ["Acrílicos Chão", "/produtos?cat=acrilicos-chao"],
  ["Acrílicos Mesa", "/produtos?cat=acrilicos-mesa"],
  ["Acrílicos Parede", "/produtos?cat=acrilicos-parede"],
  ["Caixas", "/produtos?cat=caixas"],
  ["Molduras", "/produtos?cat=molduras"],
  ["Tombolas", "/produtos?cat=tombolas"],
  ["Expositores", "/produtos?cat=expositores"],
  ["Sinalética", "/produtos?cat=sinaletica"],
  ["Todos os Produtos →", "/produtos"],
];

export default function StoreHeader({ active, onOpenCart }: Props) {
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { cart } = useCart();
  const cartCount = cart.totalItems;

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  return (
    <>
      <a href="#main" className="skip-link">
        Saltar para o conteúdo
      </a>
      <header className="store-header">
        <div className="store-util-bar">
          <span>Envio para Portugal continental · MBWay · Multibanco</span>
          <span style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <a style={{ cursor: "pointer" }}>PT</a>
            <span style={{ color: "var(--color-base-800)" }}>/</span>
            <a style={{ cursor: "pointer", color: "var(--color-base-700)" }}>EN</a>
            <span style={{ color: "var(--color-base-800)" }}>·</span>
            <a href="https://jocril.pt" style={{ cursor: "pointer" }}>
              jocril.pt ↗
            </a>
          </span>
        </div>

        <div className="store-header-main">
          <Link
            href="/"
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/jocril-logo.svg"
              style={{
                width: 75,
                height: "auto",
                filter: "var(--logo-filter, invert(1))",
              }}
              alt="Jocril"
            />
            <span
              className="text-mono-xs"
              style={{
                color: "var(--color-base-500)",
                paddingLeft: 12,
                borderLeft: "1px solid var(--color-base-800)",
              }}
            >
              Loja Online
            </span>
          </Link>

          <nav className="store-header-nav">
            {NAV.map((it) => {
              const isHover = hoverKey === it.key;
              const isActive = active === it.key;
              return (
                <Link
                  key={it.key}
                  href={it.href}
                  onMouseEnter={() => setHoverKey(it.key)}
                  onMouseLeave={() => setHoverKey(null)}
                  style={{
                    cursor: "pointer",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 12,
                    letterSpacing: "-.015rem",
                    textTransform: "uppercase",
                    color:
                      isActive || isHover
                        ? "var(--color-accent-100)"
                        : "var(--color-base-300)",
                    position: "relative",
                    paddingBottom: 3,
                    transition: "color .2s var(--ease-in-out)",
                  }}
                >
                  {it.label}
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      height: 1,
                      background: "var(--color-accent-100)",
                      width: isHover || isActive ? "100%" : 0,
                      transition: "width .3s var(--ease-in-out)",
                    }}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="store-header-search">
            <SearchField />
          </div>

          <div className="store-header-actions">
            <ThemeToggle />
            <AccountMenu />
            <CartButton count={cartCount} onClick={onOpenCart} />
            <button
              className="store-burger"
              aria-label="Menu"
              onClick={() => setDrawerOpen(true)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="store-header-tertiary">
          {CATS.map(([c, h], i) => (
            <Link
              key={c}
              href={h}
              style={{
                color:
                  i === 0 ? "var(--color-light-base-primary)" : undefined,
              }}
            >
              {c}
            </Link>
          ))}
        </div>
      </header>

      <div
        className="store-drawer-backdrop"
        data-open={drawerOpen}
        onClick={() => setDrawerOpen(false)}
      />
      <aside
        className="store-drawer"
        data-open={drawerOpen}
        aria-hidden={!drawerOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            borderBottom: "1px dashed var(--color-base-800)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/jocril-logo.svg"
            style={{
              width: 75,
              height: "auto",
              filter: "var(--logo-filter, invert(1))",
            }}
            alt="Jocril"
          />
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Fechar"
            style={{
              width: 32,
              height: 32,
              display: "grid",
              placeItems: "center",
              background: "transparent",
              border: "1px solid var(--color-base-800)",
              borderRadius: 2,
              color: "var(--color-base-300)",
              cursor: "pointer",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div
          style={{
            padding: "18px 20px",
            borderBottom: "1px dashed var(--color-base-900)",
          }}
        >
          <SearchField compact onSearch={() => setDrawerOpen(false)} />
        </div>

        <nav
          style={{
            padding: "18px 20px",
            display: "grid",
            gap: 4,
            borderBottom: "1px dashed var(--color-base-900)",
          }}
        >
          <div
            className="text-mono-xs"
            style={{ color: "var(--color-base-500)", marginBottom: 8 }}
          >
            Menu
          </div>
          {NAV.map((it) => (
            <Link
              key={it.key}
              href={it.href}
              onClick={() => setDrawerOpen(false)}
              style={{
                padding: "12px 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "var(--font-geist-sans)",
                fontSize: 18,
                letterSpacing: "-.02em",
                color: "var(--color-light-base-primary)",
                borderBottom: "1px dashed var(--color-base-900)",
              }}
            >
              {it.label}
              <span style={{ color: "var(--color-base-600)" }}>→</span>
            </Link>
          ))}
        </nav>

        <nav
          style={{
            padding: "18px 20px",
            display: "grid",
            gap: 0,
            borderBottom: "1px dashed var(--color-base-900)",
          }}
        >
          <div
            className="text-mono-xs"
            style={{ color: "var(--color-base-500)", marginBottom: 8 }}
          >
            Categorias
          </div>
          {CATS.map(([c, h]) => (
            <Link
              key={c}
              href={h}
              onClick={() => setDrawerOpen(false)}
              style={{
                padding: "10px 0",
                fontFamily: "var(--font-geist-mono)",
                fontSize: 12,
                letterSpacing: "-.015rem",
                textTransform: "uppercase",
                color: "var(--color-base-300)",
              }}
            >
              {c}
            </Link>
          ))}
        </nav>

        <div
          style={{
            padding: "18px 20px",
            display: "flex",
            gap: 10,
            alignItems: "center",
            borderBottom: "1px dashed var(--color-base-900)",
          }}
        >
          <Link
            href="/conta"
            style={{
              flex: 1,
              padding: "12px 14px",
              border: "1px solid var(--color-base-800)",
              borderRadius: 2,
              fontFamily: "var(--font-geist-mono)",
              fontSize: 12,
              letterSpacing: "-.015rem",
              textTransform: "uppercase",
              color: "var(--color-light-base-primary)",
              textAlign: "center",
            }}
          >
            Conta
          </Link>
          <Link
            href="/carrinho"
            style={{
              flex: 1,
              padding: "12px 14px",
              background: "var(--color-light-base-secondary)",
              color: "var(--color-dark-base-primary)",
              borderRadius: 2,
              fontFamily: "var(--font-geist-mono)",
              fontSize: 12,
              letterSpacing: "-.015rem",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            Carrinho · {cartCount}
          </Link>
        </div>

        <div
          style={{
            padding: "18px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "auto",
          }}
        >
          <span
            className="text-mono-xs"
            style={{ color: "var(--color-base-500)" }}
          >
            Tema
          </span>
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}

function SearchField({ compact, onSearch }: { compact?: boolean; onSearch?: () => void }) {
  const router = useRouter();
  const [focus, setFocus] = useState(false);
  const [query, setQuery] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    onSearch?.();
    router.push(`/pesquisa?q=${encodeURIComponent(cleanQuery)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        height: compact ? 40 : 36,
        padding: "0 14px",
        border: `1px dashed ${
          focus ? "var(--color-accent-100)" : "var(--color-base-700)"
        }`,
        borderRadius: 2,
        background: "var(--color-dark-base-primary)",
        transition: "border-color .15s",
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-base-500)"
        strokeWidth="1.75"
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder="Procurar produtos, referências…"
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          color: "var(--color-light-base-primary)",
          fontFamily: "var(--font-geist-mono)",
          fontSize: 12,
          letterSpacing: "-.015rem",
          minWidth: 0,
        }}
      />
      {!compact && (
        <span
          className="text-mono-xs kbd-hint"
          style={{
            color: "var(--color-base-600)",
            border: "1px solid var(--color-base-800)",
            borderRadius: 2,
            padding: "2px 5px",
          }}
        >
          ⌘ K
        </span>
      )}
    </form>
  );
}

function AccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  const role = (user?.publicMetadata as { role?: string } | undefined)?.role;
  const isAdmin = role === "admin" || role === "super_admin" || (!!email && ADMIN_EMAILS.includes(email));
  const displayName = user?.fullName || user?.username || email || "";

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, []);

  const iconBtnStyle: React.CSSProperties = {
    width: 36,
    height: 36,
    display: "grid",
    placeItems: "center",
    background: open ? "var(--color-dark-base-secondary)" : "transparent",
    border: "1px solid var(--color-base-800)",
    borderRadius: 2,
    color: "var(--color-base-300)",
    cursor: "pointer",
    transition: "background .15s",
    textDecoration: "none",
  };

  const userIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );

  if (!isLoaded || !isSignedIn) {
    return (
      <Link href="/entrar" aria-label="Entrar" style={iconBtnStyle}>
        {userIcon}
      </Link>
    );
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Conta"
        aria-expanded={open}
        aria-haspopup="true"
        style={iconBtnStyle}
      >
        {userIcon}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            zIndex: 50,
            minWidth: 220,
            background: "var(--color-dark-base-secondary)",
            border: "1px solid var(--color-base-800)",
            borderRadius: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,.4)",
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
                letterSpacing: "-.01em",
              }}
            >
              {displayName}
            </div>
            <div
              className="text-mono-xs"
              style={{ color: "var(--color-base-500)", marginTop: 2 }}
            >
              {email}
            </div>
          </div>

          {[
            { label: "A minha conta", href: "/conta", icon: "◈" },
            { label: "Encomendas", href: "/conta", icon: "◻" },
            { label: "Moradas", href: "/conta", icon: "◎" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: 2,
                textDecoration: "none",
                fontFamily: "var(--font-geist-sans)",
                fontSize: 13,
                color: "var(--color-base-300)",
                letterSpacing: "-.01em",
              }}
            >
              <span style={{ color: "var(--color-base-600)", fontSize: 11 }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}

          {isAdmin && (
            <>
              <div
                style={{
                  height: 1,
                  background: "var(--color-base-800)",
                  margin: "4px 0",
                }}
              />
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: 2,
                  textDecoration: "none",
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 12,
                  letterSpacing: "-.015rem",
                  textTransform: "uppercase",
                  color: "var(--color-accent-100)",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: "var(--color-accent-300)",
                    flexShrink: 0,
                  }}
                />
                Área de administração
                <span style={{ marginLeft: "auto", color: "var(--color-base-600)" }}>
                  ↗
                </span>
              </Link>
            </>
          )}

          <div
            style={{
              height: 1,
              background: "var(--color-base-800)",
              margin: "4px 0",
            }}
          />
          <button
            type="button"
            onClick={() => { setOpen(false); signOut({ redirectUrl: "/" }); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              borderRadius: 2,
              width: "100%",
              background: "transparent",
              border: "none",
              textAlign: "left",
              textDecoration: "none",
              cursor: "pointer",
              fontFamily: "var(--font-geist-sans)",
              fontSize: 13,
              color: "var(--color-base-500)",
              letterSpacing: "-.01em",
            }}
          >
            <span style={{ color: "var(--color-base-600)", fontSize: 11 }}>
              →
            </span>
            Terminar sessão
          </button>
        </div>
      )}
    </div>
  );
}

function CartButton({ count, onClick }: { count: number; onClick?: () => void }) {
  return (
    <Link
      href="/carrinho"
      onClick={onClick}
      className="store-cart-btn"
      aria-label={`Carrinho · ${count} ${count === 1 ? "artigo" : "artigos"}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: 36,
        padding: "0 14px",
        background: "var(--color-light-base-secondary)",
        color: "var(--color-dark-base-primary)",
        border: "none",
        borderRadius: 2,
        cursor: "pointer",
        textDecoration: "none",
        fontFamily: "var(--font-geist-mono)",
        fontSize: 12,
        letterSpacing: "-.015rem",
        textTransform: "uppercase",
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      <span className="store-cart-label">Carrinho</span>
      <span
        style={{
          minWidth: 18,
          height: 18,
          padding: "0 5px",
          display: "grid",
          placeItems: "center",
          background: "var(--color-dark-base-primary)",
          color: "var(--color-light-base-primary)",
          borderRadius: 999,
          fontSize: 10,
        }}
      >
        {count}
      </span>
    </Link>
  );
}
