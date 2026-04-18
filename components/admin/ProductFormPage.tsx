"use client";

import { useRef, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import FormCard from "@/components/admin/FormCard";
import Field from "@/components/admin/Field";
import FieldSelect from "@/components/admin/FieldSelect";
import FieldTextarea from "@/components/admin/FieldTextarea";
import ToggleSwitch from "@/components/admin/ToggleSwitch";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { adminGhost, adminPrimary } from "@/components/admin/styles";

type Mode = "create" | "edit";
type SlugState = "ok" | "checking" | "error";

const TABS = [
  { k: "basic",        l: "Informações básicas" },
  { k: "images",       l: "Imagens" },
  { k: "content",      l: "Conteúdo" },
  { k: "seo",          l: "SEO" },
  { k: "applications", l: "Aplicações" },
  { k: "settings",     l: "Definições" },
];

const IMGS = [
  "/assets/portfolio/carm-premium.avif",
  "/assets/portfolio/carm.avif",
  "/assets/portfolio/ricola.avif",
  "/assets/portfolio/beefeater.avif",
  "/assets/portfolio/stoli.avif",
];

const ALL_APPS = ["Retalho","Ponto de venda","Cosmética","Hotelaria","Farmácia","Eventos","Joalharia","Vinho e Bebidas","Alimentar","Exposição"];

export default function ProductFormPage({ mode }: { mode: Mode }) {
  const isEdit = mode === "edit";
  const [tab, setTab] = useState("basic");
  const [slugState, setSlugState] = useState<SlugState>("ok");
  const [skuSlug, setSkuSlug] = useState(isEdit ? "expositor-a3-6-prateleiras" : "");
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState(true);
  const slugTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkSlug = (v: string) => {
    setSlugState("checking");
    if (slugTimer.current) clearTimeout(slugTimer.current);
    slugTimer.current = setTimeout(() => setSlugState(v.includes("duplicado") ? "error" : "ok"), 900);
  };

  const save = (publish: boolean) => {
    setSaved(true);
    setDraft(!publish);
    setTimeout(() => setSaved(false), 2500);
  };

  const breadcrumbs = isEdit
    ? ["Produtos", "Expositor A3 · 6 prateleiras"]
    : ["Produtos", "Novo produto"];

  return (
    <AdminShell active="products" breadcrumbs={breadcrumbs}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div className="text-mono-xs" style={{ color: "var(--color-accent-100)", display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
            <span>● {isEdit ? "Editar produto" : "Novo produto"}</span>
            {isEdit && draft && (
              <span style={{ padding: "2px 8px", border: "1px dashed var(--color-base-700)", borderRadius: 2, color: "var(--color-base-500)" }}>Rascunho</span>
            )}
            {isEdit && !draft && (
              <span style={{ padding: "2px 8px", border: "1px dashed var(--color-accent-300)", borderRadius: 2, color: "var(--color-accent-300)" }}>Publicado</span>
            )}
          </div>
          <h1 style={{ margin: 0, fontFamily: "var(--font-geist-sans)", fontSize: 32, letterSpacing: "-.04em", color: "var(--color-light-base-primary)" }}>
            {isEdit ? "Expositor A3 · 6 prateleiras" : "Novo produto"}
          </h1>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          {saved && <span className="text-mono-xs" style={{ color: "var(--color-accent-300)" }}>✓ Guardado</span>}
          <button style={adminGhost} onClick={() => save(false)}>Guardar rascunho</button>
          <button style={adminPrimary} onClick={() => save(true)}>Publicar</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px dashed var(--color-base-800)", marginBottom: 24, overflowX: "auto" }}>
        {TABS.map((t) => {
          const on = t.k === tab;
          return (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              style={{
                padding: "12px 16px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                borderBottom: `2px solid ${on ? "var(--color-accent-100)" : "transparent"}`,
                color: on ? "var(--color-light-base-primary)" : "var(--color-base-500)",
                fontFamily: "var(--font-geist-mono)",
                fontSize: 12,
                letterSpacing: "-.015rem",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {t.l}
            </button>
          );
        })}
      </div>

      {tab === "basic" && (
        <BasicInfoTab
          isEdit={isEdit}
          slugState={slugState}
          skuSlug={skuSlug}
          setSkuSlug={setSkuSlug}
          checkSlug={checkSlug}
        />
      )}
      {tab === "images" && <ImagesTab />}
      {tab === "content" && <ContentTab />}
      {tab === "seo" && <SeoTab />}
      {tab === "applications" && <ApplicationsTab />}
      {tab === "settings" && <SettingsTab />}
    </AdminShell>
  );
}

function BasicInfoTab({ isEdit, slugState, skuSlug, setSkuSlug, checkSlug }: {
  isEdit: boolean;
  slugState: SlugState;
  skuSlug: string;
  setSkuSlug: (v: string) => void;
  checkSlug: (v: string) => void;
}) {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <FormCard title="Informações gerais" desc="Defina os dados principais do produto.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Nome" defaultValue={isEdit ? "Expositor A3 · 6 prateleiras" : ""} required />
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>
                Slug <span style={{ color: "var(--color-destructive)" }}>*</span>
              </label>
              <button className="text-mono-xs" style={{ background: "none", border: "none", color: "var(--color-accent-100)", cursor: "pointer", padding: 0 }}>
                Gerar automaticamente
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <input
                defaultValue={skuSlug}
                onChange={(e) => { setSkuSlug(e.target.value); checkSlug(e.target.value); }}
                style={{
                  width: "100%",
                  padding: "9px 36px 9px 12px",
                  background: "var(--color-dark-base-primary)",
                  border: `1px solid ${slugState === "error" ? "var(--color-destructive)" : slugState === "ok" && skuSlug ? "var(--color-accent-100)" : "var(--color-base-800)"}`,
                  borderRadius: 2,
                  color: "var(--color-light-base-primary)",
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>
                {slugState === "checking"
                  ? <span style={{ color: "var(--color-base-500)" }}>…</span>
                  : slugState === "error"
                  ? <span style={{ color: "var(--color-destructive)" }}>✗</span>
                  : <span style={{ color: "var(--color-accent-100)" }}>✓</span>}
              </div>
            </div>
          </div>
          <Field label="Código de referência" defaultValue={isEdit ? "EXP-A3-06P" : ""} />
          <Field label="Prefixo SKU" defaultValue={isEdit ? "EXP-A3" : ""} />
          <FieldSelect label="Categoria" defaultValue={isEdit ? "Acrílicos Chão" : undefined} options={["Acrílicos Chão","Acrílicos Mesa","Acrílicos Parede","Caixas","Molduras","Tombolas"]} />
          <FieldSelect label="Material" defaultValue={isEdit ? "Acrílico 5mm" : undefined} options={["Sem material","Acrílico 3mm","Acrílico 5mm","Acrílico 6mm","Madeira MDF"]} />
          <FieldSelect label="Orientação" defaultValue={isEdit ? "Vertical" : undefined} options={["Vertical","Horizontal","Ambas"]} />
          <Field label="Quantidade mínima" defaultValue={isEdit ? "1" : ""} type="number" />
        </div>

        <div style={{ marginTop: 20, padding: 16, border: "1px dashed var(--color-base-800)", borderRadius: 4, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {([
            ["Ativo", "Disponível no site público", true],
            ["Destaque", "Mostrado nas listagens principais", false],
            ["Personalizável", "Aceita medidas especiais", true],
            ["Dupla face", "Permite impressão dos dois lados", false],
            ["Adesivo", "Inclui fita/painel adesivo", false],
            ["Tem fecho", "Inclui fechadura ou mecanismo", false],
            ["Descontos por quantidade", "Exibe tabela de preços progressivos", true],
          ] as [string, string, boolean][]).map(([l, d, on]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", border: "1px solid var(--color-base-900)", borderRadius: 2 }}>
              <div>
                <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-light-base-primary)" }}>{l}</div>
                <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 2 }}>{d}</div>
              </div>
              <ToggleSwitch on={on} />
            </div>
          ))}
        </div>
      </FormCard>
    </div>
  );
}

function ImagesTab() {
  return (
    <FormCard title="Imagens do produto" desc="Arrastar para reordenar. A primeira imagem é a principal.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {IMGS.map((src, i) => (
          <div key={i} style={{ position: "relative", aspectRatio: "1/1", border: `1px dashed ${i === 0 ? "var(--color-accent-100)" : "var(--color-base-700)"}`, borderRadius: 4, overflow: "hidden", background: "var(--color-dark-base-primary)", cursor: "grab" }}>
            <div style={{ width: "100%", height: "100%", background: `url(${src}) center/cover` }} />
            {i === 0 && (
              <span className="text-mono-xs" style={{ position: "absolute", top: 6, left: 6, padding: "2px 6px", background: "var(--color-accent-100)", color: "var(--color-dark-base-primary)", borderRadius: 2 }}>
                PRINCIPAL
              </span>
            )}
            <button style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, background: "rgba(10,10,10,.8)", border: "none", borderRadius: 2, color: "var(--color-base-300)", cursor: "pointer", display: "grid", placeItems: "center" }}>×</button>
          </div>
        ))}
        <button style={{ aspectRatio: "1/1", border: "1px dashed var(--color-base-700)", borderRadius: 4, background: "transparent", color: "var(--color-base-500)", cursor: "pointer", display: "grid", placeItems: "center", gap: 6 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          <span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>ADICIONAR</span>
        </button>
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button style={adminGhost}>Carregar imagens</button>
        <button style={adminGhost}>Importar por URL</button>
      </div>
    </FormCard>
  );
}

function ContentTab() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <FormCard title="Descrição" desc="Conteúdo apresentado na página de produto.">
        <div style={{ display: "grid", gap: 14 }}>
          <FieldTextarea label="Descrição curta" defaultValue="Expositor modular de chão em acrílico transparente de 5mm. 6 prateleiras horizontais. Montagem sem ferramentas. Ideal para ponto de venda." rows={3} />
          <div>
            <label className="text-mono-xs" style={{ display: "block", marginBottom: 8, color: "var(--color-base-500)", textTransform: "uppercase" }}>
              Descrição completa (rich text)
            </label>
            <RichTextEditor defaultValue={"Expositor modular de chão em acrílico transparente de 5mm. Concebido para retalho de média e alta rotação, suporta até 8kg por prateleira. Estrutura colada (sem parafusos visíveis), bordos polidos.\n\nDisponível em quatro dimensões standard e em versão personalizada. Pode ser produzido em branco, preto ou fumé."} />
          </div>
          <FieldTextarea label="Vantagens" defaultValue="Materiais duráveis · Montagem rápida · Sem parafusos visíveis · Acabamentos polidos" rows={2} hint="Uma por linha ou separadas por ·" />
          <FieldTextarea label="Instruções de manutenção" defaultValue="Limpar com pano húmido. Evitar solventes agressivos." rows={2} />
        </div>
      </FormCard>
      <FormCard title="FAQ do produto" desc="Perguntas frequentes específicas deste produto.">
        {[
          { q: "Posso personalizar o tamanho?", a: "Sim, através das variantes personalizadas disponíveis." },
          { q: "O produto inclui embalagem individual?", a: "Sim, todas as peças são embaladas individualmente em plástico protetor." },
        ].map((faq, i) => (
          <div key={i} style={{ display: "grid", gap: 8, padding: 14, border: "1px dashed var(--color-base-800)", borderRadius: 4, marginBottom: 10, background: "var(--color-dark-base-primary)" }}>
            <Field label={`Pergunta ${i + 1}`} defaultValue={faq.q} />
            <FieldTextarea label="Resposta" defaultValue={faq.a} rows={2} />
          </div>
        ))}
        <button style={adminGhost}>+ Adicionar pergunta</button>
      </FormCard>
    </div>
  );
}

function SeoTab() {
  return (
    <FormCard title="SEO" desc="Metadados para motores de busca e partilha social.">
      <div style={{ display: "grid", gap: 14 }}>
        <Field label="Título SEO" defaultValue="Expositor A3 6 Prateleiras em Acrílico | Jocril" hint="Recomendado: 50–60 caracteres" />
        <FieldTextarea label="Meta descrição" defaultValue="Expositor de chão em acrílico 5mm com 6 prateleiras. Ideal para ponto de venda. Stock disponível · Envio 48h · Escalões de preço." rows={3} hint="Recomendado: 150–160 caracteres" />
        <div style={{ padding: 16, border: "1px dashed var(--color-base-700)", borderRadius: 4, background: "var(--color-dark-base-primary)" }}>
          <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginBottom: 10 }}>Pré-visualização Google</div>
          <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 18, color: "#1a0dab", marginBottom: 4, letterSpacing: "-.01em" }}>Expositor A3 6 Prateleiras em Acrílico | Jocril</div>
          <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "#006621", marginBottom: 4 }}>https://jocril.pt/produtos/expositor-a3-6-prateleiras</div>
          <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "#545454", lineHeight: 1.5 }}>Expositor de chão em acrílico 5mm com 6 prateleiras. Ideal para ponto de venda. Stock disponível · Envio 48h · Escalões de preço.</div>
        </div>
      </div>
    </FormCard>
  );
}

function ApplicationsTab() {
  const [selected, setSelected] = useState(["Retalho", "Ponto de venda", "Cosmética"]);
  const toggle = (a: string) =>
    setSelected((s) => (s.includes(a) ? s.filter((x) => x !== a) : [...s, a]));
  return (
    <FormCard title="Aplicações" desc="Setores e contextos de uso apresentados na página de produto.">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {ALL_APPS.map((a) => {
          const on = selected.includes(a);
          return (
            <button
              key={a}
              onClick={() => toggle(a)}
              style={{
                padding: "8px 14px",
                cursor: "pointer",
                borderRadius: 2,
                border: `1px dashed ${on ? "var(--color-accent-100)" : "var(--color-base-700)"}`,
                background: on ? "rgba(45,212,205,.08)" : "transparent",
                color: on ? "var(--color-accent-100)" : "var(--color-base-400)",
                fontFamily: "var(--font-geist-mono)",
                fontSize: 12,
                letterSpacing: "-.015rem",
                textTransform: "uppercase",
              }}
            >
              {a} {on && "✓"}
            </button>
          );
        })}
      </div>
      <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 14 }}>
        {selected.length} aplicações selecionadas
      </div>
    </FormCard>
  );
}

function SettingsTab() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <FormCard title="Visibilidade" desc="Controlo de publicação e indexação.">
        <div style={{ display: "grid", gap: 10 }}>
          <Field label="Ordem de apresentação" defaultValue="0" type="number" hint="Posição nas listagens (menor = primeiro)" />
          {([
            ["Indexar nos motores de busca", true],
            ["Permitir partilha em redes sociais", true],
          ] as [string, boolean][]).map(([l, on]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", border: "1px solid var(--color-base-900)", borderRadius: 2 }}>
              <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)" }}>{l}</span>
              <ToggleSwitch on={on} />
            </div>
          ))}
        </div>
      </FormCard>
      <FormCard title="Zona de perigo" desc="Ações irreversíveis.">
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ padding: "8px 14px", background: "transparent", border: "1px dashed var(--color-base-700)", borderRadius: 2, color: "var(--color-base-400)", fontFamily: "var(--font-geist-mono)", fontSize: 12, textTransform: "uppercase", cursor: "pointer" }}>
            Arquivar produto
          </button>
          <button style={{ padding: "8px 14px", background: "transparent", border: "1px dashed rgba(193,18,18,.4)", borderRadius: 2, color: "var(--color-destructive)", fontFamily: "var(--font-geist-mono)", fontSize: 12, textTransform: "uppercase", cursor: "pointer" }}>
            Eliminar produto
          </button>
        </div>
        <div className="text-mono-xs" style={{ color: "var(--color-base-600)", marginTop: 10 }}>
          Eliminar remove o produto e todas as variantes. Esta acção não pode ser desfeita.
        </div>
      </FormCard>
    </div>
  );
}
