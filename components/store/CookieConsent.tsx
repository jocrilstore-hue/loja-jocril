"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "./Button";

const STORAGE_KEY = "jocril-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      /* localStorage indisponível — fecha o banner na mesma */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: "var(--z-notification)",
        maxWidth: 720,
        margin: "0 auto",
        padding: "20px 22px",
        background: "var(--color-dark-base-secondary)",
        border: "1px solid var(--color-base-800)",
        borderRadius: 4,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 16,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      }}
    >
      <div style={{ flex: "1 1 280px", minWidth: 240 }}>
        <div
          id="cookie-consent-title"
          className="text-mono-xs"
          style={{ color: "var(--color-base-500)", marginBottom: 10 }}
        >
          Cookies
        </div>
        <p
          id="cookie-consent-desc"
          style={{
            margin: 0,
            fontFamily: "var(--font-geist-sans)",
            fontSize: 14,
            lineHeight: 1.6,
            color: "var(--color-base-300)",
          }}
        >
          Utilizamos cookies estritamente necessários para o funcionamento da
          loja. Cookies opcionais só são ativados com o seu consentimento.
          Recusar cookies não-essenciais não afeta a sua capacidade de comprar.{" "}
          <Link
            href="/legais/cookies"
            style={{
              color: "var(--color-base-100)",
              textDecoration: "underline",
              textUnderlineOffset: 2,
            }}
          >
            Ver Política de Cookies
          </Link>
          .
        </p>
      </div>
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <Button variant="ghost" href="/legais/cookies">
          Preferências
        </Button>
        <Button variant="solid" onClick={accept}>
          Aceitar
        </Button>
      </div>
    </div>
  );
}
