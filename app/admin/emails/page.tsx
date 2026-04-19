"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { adminDisabled } from "@/components/admin/styles";

const templates = [
  { k: "received",  num: "01", kind: "Transacional", title: "Encomenda recebida",           sub: "Confirmação imediata após submissão no catálogo B2B." },
  { k: "confirmed", num: "02", kind: "Transacional", title: "Encomenda confirmada + fatura", sub: "Após revisão pela equipa. Inclui fatura pró-forma e referência MB." },
  { k: "shipped",   num: "03", kind: "Logística",    title: "Encomenda em trânsito",        sub: "Saída do armazém com motorista, matrícula e janela de entrega." },
  { k: "approved",  num: "04", kind: "Conta",        title: "Conta profissional aprovada",  sub: "Onboarding B2B após validação do NIF e da actividade." },
  { k: "quote",     num: "05", kind: "Comercial",    title: "Orçamento pronto",             sub: "Proposta personalizada enviada pelo gestor de conta." },
  { k: "statement", num: "06", kind: "Financeiro",   title: "Extrato mensal",               sub: "Resumo de fim de mês com faturas em aberto e vencimentos." },
  { k: "password",  num: "07", kind: "Segurança",    title: "Recuperação de palavra-passe", sub: "Código OTP com expiração em 15 minutos." },
];

function EmailPreview({ templateKey }: { templateKey: string }) {
  const t = templates.find(x => x.k === templateKey)!;
  return (
    <div style={{ border: "1px dashed var(--color-base-800)", borderRadius: 4, background: "var(--color-dark-base-secondary)", overflow: "hidden" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px dashed var(--color-base-800)", background: "var(--color-dark-base-primary)", display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 28, color: "var(--color-accent-100)", letterSpacing: "-.02em" }}>{t.num}</span>
        <div>
          <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 18, color: "var(--color-light-base-primary)", letterSpacing: "-.025em" }}>{t.title}</div>
          <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 4 }}>{t.kind} · PT-PT · 600px</div>
        </div>
      </div>
      <div style={{ padding: "48px 40px", display: "grid", placeItems: "center", minHeight: 400 }}>
        <div style={{ width: 600, maxWidth: "100%", background: "#1a1a1a", border: "1px solid var(--color-base-800)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ padding: "32px 40px", borderBottom: "1px solid var(--color-base-800)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/jocril-logo.svg" style={{ height: 32, filter: "invert(1) brightness(.9)" }} alt="Jocril"/>
          </div>
          <div style={{ padding: "32px 40px" }}>
            <div className="text-mono-xs" style={{ color: "var(--color-accent-100)", marginBottom: 16 }}>● {t.kind.toUpperCase()}</div>
            <h2 style={{ margin: "0 0 12px", fontFamily: "var(--font-geist-sans)", fontSize: 26, letterSpacing: "-.035em", color: "var(--color-light-base-primary)" }}>{t.title}</h2>
            <p style={{ margin: "0 0 24px", fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-base-300)", lineHeight: 1.6 }}>{t.sub}</p>
            <div style={{ padding: "14px 18px", background: "var(--color-dark-base-primary)", border: "1px solid var(--color-base-800)", borderRadius: 2 }}>
              <div className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>Variáveis de exemplo · <span style={{ color: "var(--color-accent-100)" }}>{`{{cliente.nome}}`}</span> · <span style={{ color: "var(--color-accent-100)" }}>{`{{encomenda.id}}`}</span></div>
            </div>
          </div>
          <div style={{ padding: "20px 40px", borderTop: "1px solid var(--color-base-800)" }}>
            <div className="text-mono-xs" style={{ color: "var(--color-base-600)" }}>© Jocril Lda. · geral@jocril.pt · Cancelar subscrição</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminEmailsPage() {
  const [active, setActive] = useState("received");

  return (
    <AdminShell active="emails" breadcrumbs={["Backoffice", "Templates de email"]}>
      <div style={{ marginBottom: 28, paddingBottom: 22, borderBottom: "1px dashed var(--color-base-800)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40 }}>
          <div>
            <h1 style={{ margin: 0, fontFamily: "var(--font-geist-sans)", fontSize: 42, letterSpacing: "-.035em", color: "var(--color-light-base-primary)", fontWeight: 400 }}>
              Templates de email
            </h1>
            <p style={{ margin: "10px 0 0", maxWidth: 600, color: "var(--color-base-400)", fontFamily: "var(--font-geist-sans)", fontSize: 15, letterSpacing: "-.015em", lineHeight: 1.55 }}>
              Sete emails transacionais que constroem toda a comunicação automática com clientes. Escritos em português de Portugal, com a voz tranquila e concreta da Jocril.
            </p>
          </div>
          <div style={{ display: "flex", gap: 32 }}>
            {[["07", "Templates"], ["PT-PT", "Idioma"], ["600px", "Largura"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 22, color: "var(--color-accent-100)", letterSpacing: "-.02em" }}>{n}</div>
                <div className="text-mono-xs" style={{ color: "var(--color-base-600)", textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24, alignItems: "start" }}>
        <aside style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 2 }}>
          <div className="text-mono-xs" style={{ color: "var(--color-base-600)", textTransform: "uppercase", padding: "0 4px 10px" }}>
            Biblioteca · {templates.length}
          </div>
          {templates.map(t => {
            const on = t.k === active;
            return (
              <button key={t.k} onClick={() => setActive(t.k)} style={{ textAlign: "left", padding: "14px 14px", background: on ? "var(--color-dark-base-secondary)" : "transparent", border: `1px solid ${on ? "var(--color-base-800)" : "transparent"}`, borderLeft: `2px solid ${on ? "var(--color-accent-100)" : "transparent"}`, borderRadius: 2, cursor: "pointer", display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="text-mono-xs" style={{ color: on ? "var(--color-accent-100)" : "var(--color-base-600)" }}>{t.num}</span>
                  <span className="text-mono-xs" style={{ color: "var(--color-base-600)", textTransform: "uppercase", fontSize: 10 }}>{t.kind}</span>
                </div>
                <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: on ? "var(--color-light-base-primary)" : "var(--color-base-300)", letterSpacing: "-.02em" }}>{t.title}</div>
                <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 12, color: "var(--color-base-500)", letterSpacing: "-.01em", lineHeight: 1.45 }}>{t.sub}</div>
              </button>
            );
          })}

          <div style={{ marginTop: 18, padding: 14, border: "1px dashed var(--color-base-800)", borderRadius: 2 }}>
            <div className="text-mono-xs" style={{ color: "var(--color-base-600)", textTransform: "uppercase", marginBottom: 6 }}>Dados de teste</div>
            <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 12, color: "var(--color-base-400)", lineHeight: 1.5 }}>
              Todos os templates suportam variáveis <span style={{ fontFamily: "var(--font-geist-mono)", color: "var(--color-accent-100)" }}>{`{{cliente.nome}}`}</span>, <span style={{ fontFamily: "var(--font-geist-mono)", color: "var(--color-accent-100)" }}>{`{{encomenda.id}}`}</span>, etc.
            </div>
          </div>
        </aside>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, padding: "0 4px" }}>
            <div style={{ display: "flex", gap: 8 }}>
              {["● Ativo", "HTML + Texto", "PT-PT"].map(l => (
                <span key={l} className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase", padding: "5px 10px", border: "1px solid var(--color-base-800)", borderRadius: 2 }}>{l}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={adminDisabled} disabled title="Duplicação ainda não ligada">Duplicar</button>
              <button style={adminDisabled} disabled title="Vista em texto puro ainda não ligada">Ver texto puro</button>
              <button style={adminDisabled} disabled title="Edição de templates ainda não ligada">Editar template</button>
            </div>
          </div>
          <EmailPreview templateKey={active} />
        </div>
      </div>
    </AdminShell>
  );
}
