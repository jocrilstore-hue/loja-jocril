"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";

const loginInput: CSSProperties = {
  width: "100%", padding: "12px 14px",
  background: "var(--color-dark-base-secondary)",
  border: "1px solid var(--color-base-800)", borderRadius: 2,
  color: "var(--color-light-base-primary)",
  fontFamily: "var(--font-geist-sans)", fontSize: 14, outline: "none",
};

export default function AdminLoginPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-dark-base-primary)", color: "var(--color-light-base-primary)", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      {/* LEFT — form */}
      <section style={{ padding: 48, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/jocril-logo.svg" style={{ width: 75, height: "auto", filter: "var(--logo-filter, invert(1))" }} alt="Jocril"/>
          <span className="text-mono-xs" style={{ color: "var(--color-base-500)", padding: "3px 8px", border: "1px dashed var(--color-base-700)", borderRadius: 2 }}>Backoffice · v2.4</span>
        </div>

        <div style={{ maxWidth: 400, margin: "auto 0" }}>
          <div className="text-mono-xs" style={{ color: "var(--color-accent-100)", marginBottom: 12 }}>● Acesso restrito · Pessoal autorizado</div>
          <h1 style={{ margin: 0, fontFamily: "var(--font-geist-sans)", fontSize: 56, lineHeight: .95, letterSpacing: "-.05em", color: "var(--color-light-base-primary)" }}>
            Entre no <span style={{ color: "var(--color-accent-100)" }}>backoffice</span>.
          </h1>
          <p className="text-body" style={{ marginTop: 14, color: "var(--color-base-400)" }}>Utilize a sua conta Jocril Staff. Autenticação de dois fatores obrigatória.</p>

          <div style={{ marginTop: 36, display: "grid", gap: 12 }}>
            <div>
              <label className="text-mono-xs" style={{ display: "block", marginBottom: 6, color: "var(--color-base-500)" }}>Email de colaborador</label>
              <input defaultValue="maria.inacio@jocril.pt" style={loginInput}/>
            </div>
            <div>
              <label className="text-mono-xs" style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "var(--color-base-500)" }}>
                <span>Palavra-passe</span>
                <a style={{ color: "var(--color-accent-100)", cursor: "pointer" }}>Esqueceu-se?</a>
              </label>
              <input type="password" defaultValue="••••••••••••" style={loginInput}/>
            </div>
            <div>
              <label className="text-mono-xs" style={{ display: "block", marginBottom: 6, color: "var(--color-base-500)" }}>Código 2FA</label>
              <div style={{ display: "flex", gap: 6 }}>
                {["4", "1", "9", "2", "0", "6"].map((d, i) => (
                  <input key={i} defaultValue={d} maxLength={1} style={{ ...loginInput, width: 52, textAlign: "center", fontFamily: "var(--font-geist-mono)", fontSize: 18 }}/>
                ))}
              </div>
            </div>

            <button style={{ padding: "12px 14px", background: "var(--color-accent-100)", color: "#fff", border: "1px solid var(--color-accent-100)", borderRadius: 2, fontFamily: "var(--font-geist-mono)", fontSize: 13, letterSpacing: "-.015rem", textTransform: "uppercase", cursor: "pointer", marginTop: 8 }}>
              Entrar no backoffice →
            </button>

            <div style={{ marginTop: 14, padding: "12px 14px", border: "1px dashed var(--color-base-800)", borderRadius: 2, display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ color: "var(--color-accent-300)" }}>●</span>
              <span className="text-mono-xs" style={{ color: "var(--color-base-400)", flex: 1 }}>Última sessão · 17 Abr · IP 178.166.12.•• · Firefox/macOS</span>
            </div>
          </div>
        </div>

        <div className="text-mono-xs" style={{ color: "var(--color-base-600)", display: "flex", justifyContent: "space-between" }}>
          <span>© Jocril Lda. 2026</span>
          <span>Suporte · it@jocril.pt</span>
        </div>
      </section>

      {/* RIGHT — decorative */}
      <section style={{ position: "relative", borderLeft: "1px dashed var(--color-base-800)", background: "var(--color-dark-base-secondary)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent 0 39px, rgba(240,71,66,.04) 39px 40px), repeating-linear-gradient(90deg, transparent 0 39px, rgba(240,71,66,.04) 39px 40px)" }}/>
        <div style={{ position: "relative", padding: 48, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div />
          <div>
            <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginBottom: 14 }}>Backoffice Jocril · 2.4.1</div>
            <h2 style={{ margin: 0, fontFamily: "var(--font-geist-sans)", fontSize: 72, lineHeight: .9, letterSpacing: "-.05em", color: "var(--color-light-base-primary)" }}>
              Gerir <span style={{ fontStyle: "italic", color: "var(--color-accent-100)" }}>produtos</span>,<br/>encomendas e<br/>clientes num só lugar.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, border: "1px dashed var(--color-base-800)", borderRadius: 4 }}>
            {[["14", "por despachar"], ["3", "pagamentos pendentes"], ["12", "stock crítico"]].map((s, i) => (
              <div key={i} style={{ padding: "18px 20px", borderRight: i < 2 ? "1px dashed var(--color-base-800)" : "none" }}>
                <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 32, letterSpacing: "-.04em", color: "var(--color-accent-100)" }}>{s[0]}</div>
                <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 6 }}>{s[1]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
