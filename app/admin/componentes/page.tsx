"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminShell";
import { adminDanger, adminGhost, adminPrimary } from "@/components/admin/styles";
import {
  Badge, DataTable, FilterBar, Drawer, Modal, ToastStack,
  EmptyState, Skeleton, DropdownMenu, skeletonCSS,
} from "@/components/admin/ComponentLibrary";

type ToastItem = { id: number; type: "success" | "error" | "warning" | "info"; title: string; body?: string };

function Section({ id, num, title, sub, children }: { id: string; num: string; title: string; sub?: string; children: ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: 48, scrollMarginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 14 }}>
        <span className="text-mono-xs" style={{ color: "var(--color-accent-100)" }}>{num}</span>
        <h2 style={{ margin: 0, fontFamily: "var(--font-geist-sans)", fontSize: 20, letterSpacing: "-.025em", color: "var(--color-light-base-primary)", fontWeight: 400 }}>{title}</h2>
      </div>
      {sub && <p style={{ margin: "0 0 18px", color: "var(--color-base-500)", fontFamily: "var(--font-geist-sans)", fontSize: 13, letterSpacing: "-.015em", maxWidth: 680, lineHeight: 1.5 }}>{sub}</p>}
      {children}
    </section>
  );
}

function DemoCard({ name, children, onClick, danger }: { name: string; children: ReactNode; onClick?: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} style={{ textAlign: "left", padding: 18, background: "var(--color-dark-base-secondary)", border: `1px dashed ${danger ? "rgba(193,18,18,.35)" : "var(--color-base-800)"}`, borderRadius: 4, cursor: "pointer", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="text-mono-xs" style={{ color: danger ? "var(--color-destructive)" : "var(--color-light-base-primary)", textTransform: "uppercase" }}>{name}</span>
        <span style={{ color: "var(--color-base-600)" }}>→</span>
      </div>
      <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-base-500)", letterSpacing: "-.015em", lineHeight: 1.5 }}>{children}</span>
    </button>
  );
}

function Pagination() {
  return (
    <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span className="text-mono-xs" style={{ color: "var(--color-base-600)" }}>4 de 847 encomendas</span>
      <div style={{ display: "flex", gap: 4 }}>
        {["‹", "1", "2", "3", "…", "212", "›"].map((p, i) => (
          <button key={i} style={{ minWidth: 28, height: 28, background: p === "1" ? "var(--color-accent-100)" : "transparent", color: p === "1" ? "#fff" : "var(--color-base-400)", border: `1px solid ${p === "1" ? "var(--color-accent-100)" : "var(--color-base-800)"}`, borderRadius: 2, cursor: "pointer", fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>{p}</button>
        ))}
      </div>
    </div>
  );
}

const INDEX = [
  ["01", "Tabelas",  "#tables"],  ["02", "Filtros",  "#filters"],
  ["03", "Diálogos", "#overlays"],["04", "Toasts",   "#toasts"],
  ["05", "Estados",  "#states"],  ["06", "Menus",    "#dropdowns"],
  ["07", "Badges",   "#badges"],  ["08", "Botões",   "#buttons"],
];

const sampleRows = [
  { id: "#10034", cliente: "Pensão Mar Azul",       total: "€ 342,80",   estado: "paga",     data: "16 Out" },
  { id: "#10033", cliente: "Restaurante O Farol",   total: "€ 1 284,50", estado: "pendente", data: "16 Out" },
  { id: "#10032", cliente: "Café Central",          total: "€ 89,40",    estado: "paga",     data: "15 Out" },
  { id: "#10031", cliente: "Talho Mendes",          total: "€ 512,00",   estado: "enviada",  data: "15 Out" },
];

export default function AdminComponentesPage() {
  const [tab, setTab]           = useState("all");
  const [drawer, setDrawer]     = useState(false);
  const [modal, setModal]       = useState(false);
  const [destructive, setDestructive] = useState(false);
  const [toasts, setToasts]     = useState<ToastItem[]>([]);

  const addToast = (type: ToastItem["type"], title: string, body?: string) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, type, title, body }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4500);
  };
  const dismiss = (id: number) => setToasts(t => t.filter(x => x.id !== id));

  type Row = typeof sampleRows[number];
  const columns = [
    { key: "id",      label: "Encomenda", width: "130px", mono: true as const,  sortable: true },
    { key: "cliente", label: "Cliente",   sortable: true },
    { key: "total",   label: "Total",     width: "120px", mono: true as const, sortable: true },
    { key: "estado",  label: "Estado",    width: "120px", render: (r: Row) => <Badge tone={r.estado === "paga" ? "accent" : r.estado === "pendente" ? "warn" : "neutral"}>{r.estado}</Badge> },
    { key: "data",    label: "Data",      width: "100px", mono: true as const, color: "var(--color-base-400)" },
    { key: "actions", label: "",          width: "32px",  render: () => (
      <DropdownMenu items={[
        { label: "Ver detalhes", shortcut: "↵" },
        { label: "Duplicar" },
        { label: "Exportar PDF" },
        { separator: true },
        { label: "Cancelar", destructive: true },
      ]}/>
    )},
  ];

  return (
    <AdminShell active="components" breadcrumbs={["Backoffice", "Biblioteca de componentes"]}>
      {/* Header */}
      <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: "1px dashed var(--color-base-800)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40 }}>
          <div>
            <h1 style={{ margin: 0, fontFamily: "var(--font-geist-sans)", fontSize: 44, letterSpacing: "-.035em", color: "var(--color-light-base-primary)", fontWeight: 400 }}>
              Biblioteca de componentes
            </h1>
            <p style={{ margin: "10px 0 0", maxWidth: 640, color: "var(--color-base-400)", fontFamily: "var(--font-geist-sans)", fontSize: 15, letterSpacing: "-.015em", lineHeight: 1.55 }}>
              Primitivos reutilizáveis que constroem todo o backoffice. Oito famílias, um vocabulário visual consistente, comportamento previsível.
            </p>
          </div>
          <div style={{ display: "flex", gap: 32 }}>
            {[["08", "Famílias"], ["38", "Variantes"], ["v2.4", "Versão"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 26, color: "var(--color-accent-100)", letterSpacing: "-.02em" }}>{n}</div>
                <div className="text-mono-xs" style={{ color: "var(--color-base-600)", textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <nav style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 1, background: "var(--color-base-900)", border: "1px solid var(--color-base-900)", borderRadius: 2 }}>
          {INDEX.map(([n, l, h]) => (
            <a key={n} href={h} style={{ padding: "10px 12px", background: "var(--color-dark-base-primary)", textDecoration: "none", display: "flex", flexDirection: "column", gap: 2 }}>
              <span className="text-mono-xs" style={{ color: "var(--color-base-600)" }}>{n}</span>
              <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-base-300)", letterSpacing: "-.015em" }}>{l}</span>
            </a>
          ))}
        </nav>
      </div>

      <Section id="tables" num="01" title="Tabelas de dados" sub="Padrão unificado: cabeçalho ordenável, seleção múltipla, ações por linha, paginação.">
        <DataTable columns={columns} rows={sampleRows} selectable onRowClick={() => addToast("info", "Linha aberta", "A navegar para o detalhe…")}/>
        <Pagination/>
      </Section>

      <Section id="filters" num="02" title="Filtros e pesquisa" sub="Barras superiores para listagens: separadores de estado, filtros rápidos, pesquisa com atalho ⌘K.">
        <AdminCard title="Filtros de encomendas" padded>
          <FilterBar
            tabs={[
              { k: "all",  label: "Todas",      count: 847 },
              { k: "pend", label: "Pendentes",  count: 12 },
              { k: "proc", label: "A preparar", count: 34 },
              { k: "sent", label: "Enviadas",   count: 801 },
            ]}
            activeTab={tab}
            onTab={setTab}
            filters={["Canal", "Zona", "Data"]}
            search="Pesquisar encomendas…"
          />
          <div className="text-mono-xs" style={{ color: "var(--color-base-600)", paddingTop: 8, borderTop: "1px dashed var(--color-base-900)" }}>
            Separador ativo: <span style={{ color: "var(--color-accent-100)" }}>{tab}</span>
          </div>
        </AdminCard>
      </Section>

      <Section id="overlays" num="03" title="Diálogos e painéis" sub="Sobreposições para acções destrutivas, edição rápida, e detalhes contextuais sem perder o contexto.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <DemoCard name="Modal · Confirmação" onClick={() => setModal(true)}>
            Diálogo centrado para confirmações neutras. Foco automático, fecho com Esc ou clique fora.
          </DemoCard>
          <DemoCard name="Modal · Destrutivo" onClick={() => setDestructive(true)} danger>
            Variante vermelha para acções irreversíveis. Requer confirmação explícita.
          </DemoCard>
          <DemoCard name="Drawer · Lateral" onClick={() => setDrawer(true)}>
            Painel deslizante da direita (520px). Ideal para edição rápida sem sair da listagem.
          </DemoCard>
        </div>
      </Section>

      <Section id="toasts" num="04" title="Notificações (toasts)" sub="Confirmações não-bloqueantes no canto inferior direito. Auto-dispensam em 4.5s ou manualmente.">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={adminGhost} onClick={() => addToast("success", "Produto guardado", "Alterações aplicadas a 12 variantes.")}>+ Sucesso</button>
          <button style={adminGhost} onClick={() => addToast("error", "Falha ao importar", "3 linhas com SKU duplicado. Ver relatório.")}>+ Erro</button>
          <button style={adminGhost} onClick={() => addToast("warning", "Stock crítico", "Cerveja SB Stella 33cl abaixo de 24 unidades.")}>+ Aviso</button>
          <button style={adminGhost} onClick={() => addToast("info", "Exportação pronta", "relatorio-vendas-out25.pdf")}>+ Informação</button>
        </div>
      </Section>

      <Section id="states" num="05" title="Estados vazios e carregamento" sub="Feedback para quando não há dados, ou enquanto os dados estão a chegar. Nunca deixar o ecrã em branco.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <AdminCard title="Estado vazio">
            <EmptyState
              icon="∅"
              title="Sem encomendas neste período"
              description="Ajuste o intervalo de datas ou limpe os filtros para ver todas as encomendas."
              action={<button style={adminPrimary}>Limpar filtros</button>}
            />
          </AdminCard>
          <AdminCard title="Estado de carregamento (skeleton)">
            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "130px 1fr 120px 100px", gap: 16, alignItems: "center" }}>
                  <Skeleton width={90} height={12}/>
                  <Skeleton width="70%" height={14}/>
                  <Skeleton width={80} height={14}/>
                  <Skeleton width={60} height={12}/>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </Section>

      <Section id="dropdowns" num="06" title="Menus pendentes" sub="Acções secundárias por linha/registo. Atalhos de teclado anotados à direita.">
        <AdminCard title="Trigger · ⋯ (ponto-ponto-ponto)" padded>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <DropdownMenu items={[
              { label: "Editar",    shortcut: "E" },
              { label: "Duplicar", shortcut: "⌘D" },
              { label: "Arquivar", shortcut: "⌘⇧A" },
              { separator: true },
              { label: "Eliminar", destructive: true, shortcut: "⌫" },
            ]}/>
            <span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>← clique para abrir</span>
          </div>
        </AdminCard>
      </Section>

      <Section id="badges" num="07" title="Badges e indicadores" sub="Estados, contagens e escalões. Sempre curtos, sempre em maiúsculas.">
        <AdminCard title="" padded>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <Badge tone="accent">Paga</Badge>
            <Badge tone="warn">Pendente</Badge>
            <Badge tone="danger">Cancelada</Badge>
            <Badge tone="neutral">Rascunho</Badge>
            <Badge tone="accent">Nova</Badge>
            <Badge tone="warn">Stock crítico</Badge>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["T0 Público", "T1 Bronze", "T2 Prata", "T3 Ouro", "T4 Platina"].map(t => <Badge key={t} tone="neutral">{t}</Badge>)}
          </div>
        </AdminCard>
      </Section>

      <Section id="buttons" num="08" title="Botões" sub="Três níveis hierárquicos. Usar apenas um primário por vista.">
        <AdminCard title="" padded>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 16, alignItems: "center" }}>
            <span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>Primário</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={adminPrimary}>Guardar</button>
              <button style={adminPrimary}>+ Nova encomenda</button>
            </div>
            <span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>Ghost</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={adminGhost}>Cancelar</button>
              <button style={adminGhost}>Exportar CSV</button>
              <button style={adminGhost}>Filtrar</button>
            </div>
            <span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>Destrutivo</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={adminDanger}>Eliminar</button>
              <button style={adminDanger}>Remover utilizador</button>
            </div>
          </div>
        </AdminCard>
      </Section>

      {/* Live instances */}
      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Editar encomenda #10033" actions={<>
        <button style={adminGhost} onClick={() => setDrawer(false)}>Cancelar</button>
        <button style={adminPrimary} onClick={() => { setDrawer(false); addToast("success", "Encomenda guardada", "Alterações aplicadas a #10033."); }}>Guardar</button>
      </>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {[["Cliente", "Restaurante O Farol"], ["Estado", "Pendente"], ["Data de entrega prevista", "18 Out 2025"]].map(([l, v]) => (
            <div key={l}>
              <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginBottom: 6, textTransform: "uppercase" }}>{l}</div>
              <input defaultValue={v} style={{ width: "100%", padding: "10px 12px", background: "var(--color-dark-base-primary)", border: "1px solid var(--color-base-800)", borderRadius: 2, color: "var(--color-light-base-primary)", fontFamily: "var(--font-geist-sans)", fontSize: 13, outline: "none", boxSizing: "border-box" }}/>
            </div>
          ))}
        </div>
      </Drawer>

      <Modal open={modal} onClose={() => setModal(false)} title="Marcar como enviada?" actions={<>
        <button style={adminGhost} onClick={() => setModal(false)}>Cancelar</button>
        <button style={adminPrimary} onClick={() => { setModal(false); addToast("success", "Encomenda enviada", "#10033 marcada como enviada. Cliente notificado por email."); }}>Confirmar envio</button>
      </>}>
        A encomenda #10033 será marcada como enviada e o cliente receberá uma notificação por email com o código de rastreio.
      </Modal>

      <Modal open={destructive} onClose={() => setDestructive(false)} intent="destructive" title="Eliminar produto?" actions={<>
        <button style={adminGhost} onClick={() => setDestructive(false)}>Cancelar</button>
        <button style={adminDanger} onClick={() => { setDestructive(false); addToast("error", "Produto eliminado", "Vinho Verde Soalheiro (2023) removido do catálogo."); }}>Eliminar definitivamente</button>
      </>}>
        Esta acção é irreversível. O produto será removido do catálogo, mas as encomendas históricas manterão a referência. 34 clientes têm este produto em listas de compra guardadas.
      </Modal>

      <ToastStack items={toasts} onDismiss={dismiss}/>
      <style>{skeletonCSS}</style>
    </AdminShell>
  );
}
