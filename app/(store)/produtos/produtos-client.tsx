'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Badge from '@/components/store/Badge';
import ProductCard, { type ProductMock } from '@/components/store/ProductCard';
import FooterCTA from '@/components/store/FooterCTA';

export type PLPClientProps = {
  products: ProductMock[];
  categoryName?: string | null;
  categoryDescription?: string | null;
  totalInCategory?: number;
  initialSort?: SortKey;
  initialMaxPrice?: number;
};

const FILTER_DIMS      = ['A6', 'A5', 'A4', 'A3', 'A2', 'DL', 'Ø200', 'Ø300', 'Personalizado'];
const FILTER_CORS      = ['Transparente', 'Branco', 'Preto', 'Fumé', 'Cores'];
const FILTER_STOCK     = ['Em stock', 'Últimas unidades', 'Produção por encomenda'];
const COR_COUNTS       = [9, 4, 3, 2, 5];
const STOCK_COUNTS     = [14, 3, 8];
type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'newest';
type MaterialOption = { label: string; count: number };

const STOCK_FILTERS: Record<string, ProductMock['stock']> = {
  'Em stock': 'in',
  'Últimas unidades': 'low',
  'Produção por encomenda': 'made',
};

const QUICK_FILTERS = ['Tudo', 'Em stock', 'Personalizável', 'Com iluminação', 'Até €50'] as const;

function normalize(value: string | undefined) {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function hasTerm(product: ProductMock, term: string) {
  const haystack = normalize(`${product.name} ${product.cat} ${product.material} ${product.dim ?? ''}`);
  return haystack.includes(normalize(term));
}

export default function PLPClient({
  products,
  categoryName,
  categoryDescription,
  totalInCategory,
  initialSort = 'relevance',
  initialMaxPrice,
}: PLPClientProps) {
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [density, setDensity] = useState<'comfortable' | 'dense'>('comfortable');
  const [quickFilter, setQuickFilter] = useState<(typeof QUICK_FILTERS)[number]>('Tudo');
  const [activeMaterials, setActiveMaterials] = useState<string[]>([]);
  const [activeDims, setActiveDims] = useState<string[]>([]);
  const [activeCors, setActiveCors] = useState<string[]>([]);
  const [activeStock, setActiveStock] = useState<ProductMock['stock'][]>([]);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice ?? 500);
  const cols = density === 'dense' ? 4 : 3;
  const headerTitle = categoryName ?? 'Todos os produtos';
  const headerDesc = categoryDescription
    ?? 'Catálogo completo de produtos em acrílico produzidos na nossa fábrica em Massamá.';
  const countLabel = totalInCategory ?? products.length;
  const materialOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const product of products) {
      const material = product.material?.trim();
      if (!material) continue;
      counts.set(material, (counts.get(material) ?? 0) + 1);
    }
    return Array.from(counts, ([label, count]) => ({ label, count }))
      .sort((a, b) => a.label.localeCompare(b.label, 'pt-PT'));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const next = products.filter((product) => {
      if (activeMaterials.length > 0 && !activeMaterials.includes(product.material)) return false;
      if (activeDims.length > 0 && !activeDims.some((dim) => product.dim === dim || hasTerm(product, dim))) return false;
      if (activeCors.length > 0 && !activeCors.some((cor) => hasTerm(product, cor))) return false;
      if (activeStock.length > 0 && !activeStock.includes(product.stock)) return false;
      if (product.from > maxPrice) return false;

      if (quickFilter === 'Em stock' && product.stock !== 'in') return false;
      if (quickFilter === 'Personalizável' && product.stock !== 'made' && !hasTerm(product, 'personal')) return false;
      if (quickFilter === 'Com iluminação' && !hasTerm(product, 'iluminacao') && !hasTerm(product, 'LED')) return false;
      if (quickFilter === 'Até €50' && product.from > 50) return false;

      return true;
    });

    if (sort === 'price-asc') return next.toSorted((a, b) => a.from - b.from);
    if (sort === 'price-desc') return next.toSorted((a, b) => b.from - a.from);
    if (sort === 'newest') {
      return next.toSorted((a, b) => {
        const aId = Number((a as ProductMock & { id?: string }).id ?? 0);
        const bId = Number((b as ProductMock & { id?: string }).id ?? 0);
        return bId - aId;
      });
    }
    return next;
  }, [activeCors, activeDims, activeMaterials, activeStock, maxPrice, products, quickFilter, sort]);

  const toggleFilter = (value: string, current: string[], setter: (next: string[]) => void) => {
    setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };
  const toggleStock = (value: ProductMock['stock']) => {
    setActiveStock((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };
  const clearFilters = () => {
    setQuickFilter('Tudo');
    setActiveMaterials([]);
    setActiveDims([]);
    setActiveCors([]);
    setActiveStock([]);
    setMaxPrice(500);
  };

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
            {QUICK_FILTERS.map((c) => (
              <button
                key={c}
                onClick={() => setQuickFilter(c)}
                style={{
                  height: 28, padding: '0 12px', borderRadius: 999,
                  background: quickFilter === c ? 'var(--color-light-base-secondary)' : 'transparent',
                  color: quickFilter === c ? 'var(--color-dark-base-primary)' : 'var(--color-base-400)',
                  border: `1px solid ${quickFilter === c ? 'transparent' : 'var(--color-base-700)'}`,
                  fontFamily: 'var(--font-geist-mono)', fontSize: 11, letterSpacing: '-.015rem',
                  textTransform: 'uppercase', cursor: 'pointer',
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <span className="text-mono-xs" style={{ color: 'var(--color-base-600)', marginLeft: 'auto' }}>
            {filteredProducts.length} de {countLabel} produtos
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
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 48 }}>
          <aside>
            <FilterPanel
              activeMaterials={activeMaterials}
              activeDims={activeDims}
              activeCors={activeCors}
              activeStock={activeStock}
              maxPrice={maxPrice}
              materialOptions={materialOptions}
              onToggleMaterial={(value) => toggleFilter(value, activeMaterials, setActiveMaterials)}
              onToggleDim={(value) => toggleFilter(value, activeDims, setActiveDims)}
              onToggleCor={(value) => toggleFilter(value, activeCors, setActiveCors)}
              onToggleStock={toggleStock}
              onMaxPriceChange={setMaxPrice}
              onClear={clearFilters}
            />
          </aside>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>
              {filteredProducts.map((p) => <ProductCard key={p.sku} p={p} />)}
            </div>
            {filteredProducts.length === 0 && (
              <div style={{ marginTop: 20, padding: 20, border: '1px dashed var(--color-base-800)', borderRadius: 4, color: 'var(--color-base-400)', fontFamily: 'var(--font-geist-sans)', fontSize: 14 }}>
                Nenhum produto corresponde aos filtros selecionados.
              </div>
            )}
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

function SortSelect({ sort, setSort }: { sort: SortKey; setSort: (s: SortKey) => void }) {
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
        onChange={(e) => setSort(e.target.value as SortKey)}
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

function FilterPanel({
  activeMaterials,
  activeDims,
  activeCors,
  activeStock,
  maxPrice,
  materialOptions,
  onToggleMaterial,
  onToggleDim,
  onToggleCor,
  onToggleStock,
  onMaxPriceChange,
  onClear,
}: {
  activeMaterials: string[];
  activeDims: string[];
  activeCors: string[];
  activeStock: ProductMock['stock'][];
  maxPrice: number;
  materialOptions: MaterialOption[];
  onToggleMaterial: (value: string) => void;
  onToggleDim: (value: string) => void;
  onToggleCor: (value: string) => void;
  onToggleStock: (value: ProductMock['stock']) => void;
  onMaxPriceChange: (value: number) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState({ material: true, dimensoes: true, preco: true, cor: false, stock: false });

  const toggle = (k: keyof typeof open) => setOpen({ ...open, [k]: !open[k] });
  const chips = [
    ...activeMaterials,
    ...activeDims,
    ...activeCors,
    ...activeStock.map((stock) => Object.entries(STOCK_FILTERS).find(([, value]) => value === stock)?.[0] ?? stock),
  ];

  return (
    <div style={{ position: 'sticky', top: 200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <Badge size="xs">Filtros</Badge>
        <button
          onClick={onClear}
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
        {chips.map((m) => (
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
        {materialOptions.length === 0 && (
          <span className="text-mono-xs" style={{ color: 'var(--color-base-600)' }}>
            Sem materiais disponíveis.
          </span>
        )}
        {materialOptions.map((m) => (
          <CheckRow
            key={m.label}
            label={m.label}
            checked={activeMaterials.includes(m.label)}
            onToggle={() => onToggleMaterial(m.label)}
            count={m.count}
          />
        ))}
      </FilterGroup>
      <FilterGroup label="Dimensões" open={open.dimensoes} toggle={() => toggle('dimensoes')}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 4 }}>
          {FILTER_DIMS.map((d) => (
            <button
              key={d}
              onClick={() => onToggleDim(d)}
              style={{
                padding: '6px 4px',
                border: `1px dashed ${activeDims.includes(d) ? 'var(--color-accent-100)' : 'var(--color-base-700)'}`,
                background: activeDims.includes(d) ? 'rgba(45,212,205,.08)' : 'transparent',
                color: activeDims.includes(d) ? 'var(--color-accent-100)' : 'var(--color-base-300)',
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
            <span className="text-mono-xs" style={{ color: 'var(--color-light-base-primary)' }}>€ {maxPrice}</span>
            <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>€ 500</span>
          </div>
          <input
            type="range" min={0} max={500} step={5} value={maxPrice}
            onChange={(e) => onMaxPriceChange(+e.target.value)}
            style={{ width: '100%', accentColor: 'var(--color-accent-100)' }}
          />
        </div>
      </FilterGroup>
      <FilterGroup label="Cor" open={open.cor} toggle={() => toggle('cor')}>
        {FILTER_CORS.map((c, i) => (
          <CheckRow
            key={c}
            label={c}
            checked={activeCors.includes(c)}
            onToggle={() => onToggleCor(c)}
            count={COR_COUNTS[i]}
          />
        ))}
      </FilterGroup>
      <FilterGroup label="Disponibilidade" open={open.stock} toggle={() => toggle('stock')} isLast>
        {FILTER_STOCK.map((s, i) => (
          <CheckRow
            key={s}
            label={s}
            checked={activeStock.includes(STOCK_FILTERS[s])}
            onToggle={() => onToggleStock(STOCK_FILTERS[s])}
            count={STOCK_COUNTS[i]}
          />
        ))}
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

