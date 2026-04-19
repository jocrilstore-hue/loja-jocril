'use client';

import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import Badge from '@/components/store/Badge';
import ProductCard, { type ProductMock } from '@/components/store/ProductCard';
import FooterCTA from '@/components/store/FooterCTA';

export type PLPClientProps = {
  products: ProductMock[];
  categoryName?: string | null;
  categoryDescription?: string | null;
  totalInCategory?: number;
};

const FILTER_MATERIALS = ['Acrílico 3mm', 'Acrílico 4mm', 'Acrílico 5mm', 'Acrílico 6mm', 'Acrílico + LED'];
const FILTER_DIMS      = ['A6', 'A5', 'A4', 'A3', 'A2', 'DL', 'Ø200', 'Ø300', 'Personalizado'];
const FILTER_CORS      = ['Transparente', 'Branco', 'Preto', 'Fumé', 'Cores'];
const FILTER_STOCK     = ['Em stock', 'Últimas unidades', 'Produção por encomenda'];
const MAT_COUNTS       = [7, 4, 12, 5, 2];
const COR_COUNTS       = [9, 4, 3, 2, 5];
const STOCK_COUNTS     = [14, 3, 8];

export default function PLPClient({
  products,
  categoryName,
  categoryDescription,
  totalInCategory,
}: PLPClientProps) {
  const [sort, setSort] = useState('relevance');
  const [density, setDensity] = useState<'comfortable' | 'dense'>('comfortable');
  const cols = density === 'dense' ? 4 : 3;
  const headerTitle = categoryName ?? 'Todos os produtos';
  const headerDesc = categoryDescription
    ?? 'Catálogo completo de produtos em acrílico produzidos na nossa fábrica em Leiria.';
  const countLabel = totalInCategory ?? products.length;

  return (
    <main id="main">
      {/* Category hero */}
      <section
        data-screen-label="01 PLP hero"
        style={{ padding: '36px 40px 28px', background: 'var(--color-dark-base-primary)', borderBottom: '1px solid var(--color-base-900)' }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', display: 'flex', gap: 8, marginBottom: 24 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Loja</Link>
            <span>/</span>
            <Link href="/categorias" style={{ color: 'inherit', textDecoration: 'none' }}>Categorias</Link>
            <span>/</span>
            <span style={{ color: 'var(--color-light-base-primary)' }}>{headerTitle}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48, alignItems: 'end' }}>
            <div>
              <Badge size="sm">Categoria 01 / 06</Badge>
              <h1 className="heading-1" style={{ margin: '16px 0 0 0', color: 'var(--color-light-base-primary)' }}>
                {headerTitle}
              </h1>
            </div>
            <div>
              <p className="text-mono-md" style={{ color: 'var(--color-base-300)', margin: 0, maxWidth: '50ch' }}>
                {headerDesc}
              </p>
              <div style={{ marginTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <Stat label="Referências" value="32" />
                <Stat label="Em stock" value="24" />
                <Stat label="Prazo médio" value="48h" />
                <Stat label="Desde" value="€ 42,50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky toolbar */}
      <section
        style={{
          padding: '16px 40px',
          borderBottom: '1px dashed var(--color-base-800)',
          background: 'var(--color-dark-base-primary)',
          position: 'sticky',
          top: 145,
          zIndex: 20,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['Tudo', 'Em stock', 'Personalizável', 'Com iluminação', 'Até €50'].map((c, i) => (
              <button
                key={c}
                style={{
                  height: 28, padding: '0 12px', borderRadius: 999,
                  background: i === 0 ? 'var(--color-light-base-secondary)' : 'transparent',
                  color: i === 0 ? 'var(--color-dark-base-primary)' : 'var(--color-base-400)',
                  border: `1px solid ${i === 0 ? 'transparent' : 'var(--color-base-700)'}`,
                  fontFamily: 'var(--font-geist-mono)', fontSize: 11, letterSpacing: '-.015rem',
                  textTransform: 'uppercase', cursor: 'pointer',
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <span className="text-mono-xs" style={{ color: 'var(--color-base-600)', marginLeft: 'auto' }}>
            {products.length} de {countLabel} produtos
          </span>
          <DensityToggle density={density} setDensity={setDensity} />
          <SortSelect sort={sort} setSort={setSort} />
        </div>
      </section>

      {/* Body: sidebar + grid */}
      <section
        data-screen-label="02 PLP body"
        style={{ padding: '32px 40px 80px', background: 'var(--color-dark-base-primary)' }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32 }}>
          <aside>
            <FilterPanel />
          </aside>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>
              {products.map((p) => <ProductCard key={p.sku} p={p} />)}
            </div>
            <Pagination />
          </div>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 24, letterSpacing: '-.04em', color: 'var(--color-light-base-primary)', marginTop: 4 }}>{value}</div>
    </div>
  );
}

function DensityToggle({ density, setDensity }: { density: 'comfortable' | 'dense'; setDensity: (d: 'comfortable' | 'dense') => void }) {
  return (
    <div style={{ display: 'inline-flex', border: '1px solid var(--color-base-700)', borderRadius: 2, overflow: 'hidden' }}>
      {([{ k: 'comfortable', label: '3×' }, { k: 'dense', label: '4×' }] as const).map((d) => (
        <button
          key={d.k}
          onClick={() => setDensity(d.k)}
          style={{
            height: 28, padding: '0 10px',
            background: density === d.k ? 'var(--color-light-base-secondary)' : 'transparent',
            color: density === d.k ? 'var(--color-dark-base-primary)' : 'var(--color-base-400)',
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-geist-mono)', fontSize: 11, letterSpacing: '-.015rem', textTransform: 'uppercase',
          }}
        >
          {d.label}
        </button>
      ))}
    </div>
  );
}

function SortSelect({ sort, setSort }: { sort: string; setSort: (s: string) => void }) {
  return (
    <label
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, height: 28,
        padding: '0 10px 0 12px', border: '1px solid var(--color-base-700)', borderRadius: 2,
      }}
    >
      <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>Ordenar</span>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        style={{
          background: 'transparent', border: 'none', outline: 'none',
          color: 'var(--color-light-base-primary)',
          fontFamily: 'var(--font-geist-mono)', fontSize: 11, letterSpacing: '-.015rem',
          textTransform: 'uppercase', cursor: 'pointer',
        }}
      >
        <option value="relevance" style={{ background: '#171717' }}>Relevância</option>
        <option value="price-asc" style={{ background: '#171717' }}>Preço ↑</option>
        <option value="price-desc" style={{ background: '#171717' }}>Preço ↓</option>
        <option value="newest" style={{ background: '#171717' }}>Mais recentes</option>
      </select>
    </label>
  );
}

function FilterPanel() {
  const [open, setOpen] = useState({ material: true, dimensoes: true, preco: true, cor: false, stock: false });
  const [material, setMaterial] = useState(['Acrílico 5mm']);
  const [dim, setDim] = useState<string[]>([]);
  const [price, setPrice] = useState(100);

  const toggle = (k: keyof typeof open) => setOpen({ ...open, [k]: !open[k] });
  const toggleArr = (arr: string[], set: (a: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div style={{ position: 'sticky', top: 200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <Badge size="xs">Filtros</Badge>
        <button
          style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            fontFamily: 'var(--font-geist-mono)', fontSize: 11, letterSpacing: '-.015rem',
            textTransform: 'uppercase', color: 'var(--color-accent-100)',
          }}
        >
          Limpar tudo
        </button>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
        {material.map((m) => (
          <span
            key={m}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px',
              border: '1px dashed var(--color-accent-100)', borderRadius: 2,
              fontFamily: 'var(--font-geist-mono)', fontSize: 10, letterSpacing: '-.01rem',
              textTransform: 'uppercase', color: 'var(--color-accent-100)',
            }}
          >
            {m} ×
          </span>
        ))}
      </div>

      <FilterGroup label="Material" open={open.material} toggle={() => toggle('material')}>
        {FILTER_MATERIALS.map((m, i) => (
          <CheckRow
            key={m}
            label={m}
            checked={material.includes(m)}
            onToggle={() => toggleArr(material, setMaterial, m)}
            count={MAT_COUNTS[i]}
          />
        ))}
      </FilterGroup>
      <FilterGroup label="Dimensões" open={open.dimensoes} toggle={() => toggle('dimensoes')}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 4 }}>
          {FILTER_DIMS.map((d) => (
            <button
              key={d}
              onClick={() => toggleArr(dim, setDim, d)}
              style={{
                padding: '6px 4px',
                border: `1px dashed ${dim.includes(d) ? 'var(--color-accent-100)' : 'var(--color-base-700)'}`,
                background: dim.includes(d) ? 'rgba(45,212,205,.08)' : 'transparent',
                color: dim.includes(d) ? 'var(--color-accent-100)' : 'var(--color-base-300)',
                borderRadius: 2, cursor: 'pointer',
                fontFamily: 'var(--font-geist-mono)', fontSize: 11, letterSpacing: '-.015rem', textTransform: 'uppercase',
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup label="Preço" open={open.preco} toggle={() => toggle('preco')}>
        <div style={{ padding: '8px 2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>€ 0</span>
            <span className="text-mono-xs" style={{ color: 'var(--color-light-base-primary)' }}>€ {price}</span>
            <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>€ 500</span>
          </div>
          <input
            type="range" min={0} max={500} step={5} value={price}
            onChange={(e) => setPrice(+e.target.value)}
            style={{ width: '100%', accentColor: 'var(--color-accent-100)' }}
          />
        </div>
      </FilterGroup>
      <FilterGroup label="Cor" open={open.cor} toggle={() => toggle('cor')}>
        {FILTER_CORS.map((c, i) => <CheckRow key={c} label={c} count={COR_COUNTS[i]} />)}
      </FilterGroup>
      <FilterGroup label="Disponibilidade" open={open.stock} toggle={() => toggle('stock')} isLast>
        {FILTER_STOCK.map((s, i) => <CheckRow key={s} label={s} count={STOCK_COUNTS[i]} />)}
      </FilterGroup>
    </div>
  );
}

function FilterGroup({
  label, open, toggle, children, isLast,
}: {
  label: string; open: boolean; toggle: () => void; children: ReactNode; isLast?: boolean;
}) {
  return (
    <div style={{ borderTop: '1px solid var(--color-base-800)', borderBottom: isLast ? '1px solid var(--color-base-800)' : 'none' }}>
      <button
        onClick={toggle}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 0', background: 'transparent', border: 'none',
          color: 'var(--color-light-base-primary)',
          fontFamily: 'var(--font-geist-mono)', fontSize: 12, letterSpacing: '-.015rem',
          textTransform: 'uppercase', cursor: 'pointer',
        }}
      >
        {label}
        <span style={{ color: 'var(--color-base-500)' }}>{open ? '−' : '+'}</span>
      </button>
      {open && <div style={{ paddingBottom: 14 }}>{children}</div>}
    </div>
  );
}

function CheckRow({
  label, count, checked, onToggle,
}: {
  label: string; count: number; checked?: boolean; onToggle?: () => void;
}) {
  const [local, setLocal] = useState(!!checked);
  const isOn = checked !== undefined ? checked : local;
  return (
    <div
      onClick={() => (onToggle ? onToggle() : setLocal(!local))}
      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', cursor: 'pointer' }}
    >
      <span
        style={{
          width: 14, height: 14, borderRadius: 2,
          border: `1px solid ${isOn ? 'var(--color-accent-100)' : 'var(--color-base-600)'}`,
          background: isOn ? 'var(--color-accent-100)' : 'transparent',
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}
      >
        {isOn && (
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round">
            <path d="M5 12l5 5L20 7" />
          </svg>
        )}
      </span>
      <span style={{ flex: 1, fontFamily: 'var(--font-geist-sans)', fontSize: 13, color: 'var(--color-base-200)' }}>{label}</span>
      <span className="text-mono-xs" style={{ color: 'var(--color-base-600)' }}>{count}</span>
    </div>
  );
}

function Pagination() {
  return (
    <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <button style={pagBtn(false)}>←</button>
      {[1, 2, 3, 4].map((n, i) => (
        <button key={n} style={pagBtn(i === 0)}>{n}</button>
      ))}
      <span style={{ color: 'var(--color-base-600)', padding: '0 6px' }}>…</span>
      <button style={pagBtn(false)}>→</button>
    </div>
  );
}

function pagBtn(active: boolean): CSSProperties {
  return {
    width: 32, height: 32,
    background: active ? 'var(--color-light-base-secondary)' : 'transparent',
    color: active ? 'var(--color-dark-base-primary)' : 'var(--color-base-300)',
    border: `1px solid ${active ? 'transparent' : 'var(--color-base-700)'}`,
    borderRadius: 2, cursor: 'pointer',
    fontFamily: 'var(--font-geist-mono)', fontSize: 12, letterSpacing: '-.015rem',
  };
}
