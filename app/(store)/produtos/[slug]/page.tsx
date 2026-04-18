'use client';

import { useState } from 'react';
import Link from 'next/link';
import Badge from '@/components/store/Badge';
import Button from '@/components/store/Button';
import ProductCard, { type ProductMock } from '@/components/store/ProductCard';
import FooterCTA from '@/components/store/FooterCTA';

const PDP_PRODUCT = {
  sku: 'EXP-A3-06P',
  name: 'Expositor A3 · 6 prateleiras',
  tagline: 'Expositor modular em acrílico de chão, para retalho e ponto de venda.',
  cat: 'Acrílicos Chão',
  material: 'Acrílico 5mm',
  from: 42.50,
  rating: 4.8, reviews: 47,
  stock: { qty: 124, label: 'Em stock', leadTime: 'Envio em 48h' },
  images: [
    '/assets/portfolio/carm-premium.avif',
    '/assets/portfolio/carm.avif',
    '/assets/portfolio/stoli.avif',
    '/assets/portfolio/beefeater.avif',
    '/assets/portfolio/ricola.avif',
  ],
  variants: {
    color: [
      { k: 'clear', label: 'Transparente', swatch: 'linear-gradient(135deg,#d8e9ec,#b3d1d4)' },
      { k: 'white', label: 'Branco',        swatch: '#f5f5f5' },
      { k: 'black', label: 'Preto',         swatch: '#111' },
      { k: 'smoke', label: 'Fumé',          swatch: 'linear-gradient(135deg,#4a4a4a,#2a2a2a)' },
    ],
    size: [
      { k: 'a4',     label: 'A4',            dim: '210 × 297 · 800h',   price: 32.80 as number | null },
      { k: 'a3',     label: 'A3',            dim: '297 × 420 · 1200h',  price: 42.50 as number | null },
      { k: 'a2',     label: 'A2',            dim: '420 × 594 · 1600h',  price: 68.00 as number | null },
      { k: 'custom', label: 'Personalizado', dim: 'Medidas à escolha',   price: null  as number | null },
    ],
  },
  priceTiers: [
    { min: 1,   max: 9    as number | null, unit: 42.50, discount: 0  },
    { min: 10,  max: 49   as number | null, unit: 38.20, discount: 10 },
    { min: 50,  max: 99   as number | null, unit: 34.80, discount: 18 },
    { min: 100, max: 499  as number | null, unit: 29.80, discount: 30 },
    { min: 500, max: null as number | null, unit: 24.50, discount: 42 },
  ],
};

const RELATED: ProductMock[] = [
  { sku: 'EXP-A4-04P',   name: 'Expositor A4 · 4 prateleiras',  cat: 'Acrílicos Chão', material: 'Acrílico 5mm',       from: 32.80,  tiers: '1+ · 10+', img: '/assets/portfolio/carm.avif',        stock: 'in'   },
  { sku: 'EXP-CHAO-5N',  name: 'Expositor chão 5 níveis',        cat: 'Acrílicos Chão', material: 'Acrílico 6mm',       from: 186.00, tiers: '1+ · 5+',  img: '/assets/portfolio/stoli.avif',       stock: 'made' },
  { sku: 'EXP-CILIND',   name: 'Expositor cilíndrico ø300',      cat: 'Acrílicos Chão', material: 'Acrílico 5mm',       from: 95.00,  tiers: '1+',        img: '/assets/portfolio/glade.avif',       stock: 'in'   },
  { sku: 'DSP-PAR-LUZ',  name: 'Display com iluminação LED',     cat: 'Acrílicos Chão', material: 'Acrílico 5mm + LED', from: 128.00, tiers: '1+',        img: '/assets/portfolio/rayban.avif',      stock: 'in'   },
];

type SizeVariant = typeof PDP_PRODUCT.variants.size[number];
type PriceTier   = typeof PDP_PRODUCT.priceTiers[number];

export default function PDPPage() {
  const [img, setImg]     = useState(0);
  const [color, setColor] = useState('clear');
  const [size, setSize]   = useState('a3');
  const [qty, setQty]     = useState(10);
  const [tab, setTab]     = useState('specs');

  const curSize = PDP_PRODUCT.variants.size.find((s) => s.k === size)!;
  const tier    = PDP_PRODUCT.priceTiers.find((t) => qty >= t.min && (!t.max || qty <= t.max)) ?? PDP_PRODUCT.priceTiers[0];
  const unit    = curSize.price ? tier.unit * (curSize.price / 42.50) : null;
  const total   = unit ? unit * qty : null;

  return (
    <>
      <main id="main" style={{ background: 'var(--color-dark-base-primary)' }}>
        {/* breadcrumbs */}
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '20px 40px' }}>
          <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', display: 'flex', gap: 8 }}>
            <Link href="/produtos" style={{ color: 'inherit', textDecoration: 'none' }}>Loja</Link><span>/</span>
            <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit' }}>Acrílicos Chão</button><span>/</span>
            <span style={{ color: 'var(--color-light-base-primary)' }}>{PDP_PRODUCT.name}</span>
            <button onClick={() => window.history.back()} style={{ marginLeft: 'auto', color: 'var(--color-base-400)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-geist-mono)', fontSize: 'inherit' }}>← Voltar à categoria</button>
          </div>
        </div>

        {/* gallery + info */}
        <section data-screen-label="01 PDP gallery+info" style={{ maxWidth: 1440, margin: '0 auto', padding: '8px 40px 40px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40 }}>
          <Gallery images={PDP_PRODUCT.images} cur={img} setCur={setImg} />
          <InfoRail
            product={PDP_PRODUCT}
            color={color} setColor={setColor}
            size={size}   setSize={setSize}
            qty={qty}     setQty={setQty}
            curSize={curSize} tier={tier} unit={unit} total={total}
          />
        </section>

        {/* meta strip */}
        <section style={{ borderTop: '1px dashed var(--color-base-800)', borderBottom: '1px dashed var(--color-base-800)' }}>
          <div style={{ maxWidth: 1440, margin: '0 auto', padding: '18px 40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
            <MetaItem icon="📦" label="Envio 48h"           sub="Stock standard · Portugal continental" />
            <MetaItem icon="🔧" label="Produção interna"    sub="Fábrica Vialonga · corte laser + colagem" />
            <MetaItem icon="💶" label="Escalões de preço"   sub={`Até ${PDP_PRODUCT.priceTiers.at(-1)!.discount}% em grandes quantidades`} />
            <MetaItem icon="↺"  label="Devolução 14 dias"  sub="Peças standard · em estado original" />
          </div>
        </section>

        {/* tabs */}
        <section data-screen-label="02 PDP tabs" style={{ maxWidth: 1440, margin: '0 auto', padding: '56px 40px' }}>
          <div style={{ borderBottom: '1px solid var(--color-base-800)', display: 'flex', gap: 28, marginBottom: 32 }}>
            {[
              { k: 'specs',   label: 'Especificações' },
              { k: 'dim',     label: 'Dimensões' },
              { k: 'tiers',   label: 'Escalões de preço' },
              { k: 'faq',     label: 'FAQ' },
              { k: 'reviews', label: `Avaliações (${PDP_PRODUCT.reviews})` },
            ].map((t) => (
              <button key={t.k} onClick={() => setTab(t.k)} style={{
                padding: '12px 0', background: 'transparent', border: 'none', cursor: 'pointer',
                borderBottom: `2px solid ${tab === t.k ? 'var(--color-accent-100)' : 'transparent'}`,
                color: tab === t.k ? 'var(--color-light-base-primary)' : 'var(--color-base-400)',
                fontFamily: 'var(--font-geist-mono)', fontSize: 12, letterSpacing: '-.015rem', textTransform: 'uppercase',
              }}>{t.label}</button>
            ))}
          </div>
          {tab === 'specs'   && <SpecsPanel />}
          {tab === 'dim'     && <DimPanel />}
          {tab === 'tiers'   && <TiersPanel tiers={PDP_PRODUCT.priceTiers} />}
          {tab === 'faq'     && <FaqPanel />}
          {tab === 'reviews' && <ReviewsPanel />}
        </section>

        {/* related */}
        <section data-screen-label="03 PDP related" style={{ maxWidth: 1440, margin: '0 auto', padding: '24px 40px 80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 28 }}>
            <div>
              <Badge size="sm">Produtos relacionados</Badge>
              <h3 className="heading-2" style={{ margin: '14px 0 0', color: 'var(--color-light-base-primary)' }}>Da mesma família</h3>
            </div>
            <Link href="/produtos" className="text-mono-sm" style={{ color: 'var(--color-base-300)', textDecoration: 'none' }}>Ver categoria →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {RELATED.map((p) => <ProductCard key={p.sku} p={p} />)}
          </div>
        </section>
      </main>

      <FooterCTA />
    </>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Gallery({ images, cur, setCur }: { images: string[]; cur: number; setCur: (i: number) => void }) {
  return (
    <div style={{ position: 'sticky', top: 160, alignSelf: 'start' }}>
      <div style={{
        position: 'relative', aspectRatio: '4/5',
        border: '1px dashed var(--color-base-700)', borderRadius: 6, overflow: 'hidden',
        background: `url(${images[cur]}) center/cover`,
      }}>
        <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 6 }}>
          <span style={{ padding: '4px 10px', background: 'rgba(10,10,10,.82)', border: '1px solid var(--color-base-700)', borderRadius: 2, fontFamily: 'var(--font-geist-mono)', fontSize: 10, letterSpacing: '-.01rem', textTransform: 'uppercase', color: 'var(--color-accent-100)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--color-accent-300)' }}/>
            Em stock · Envio 48h
          </span>
        </div>
        <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
          <button style={{ padding: '6px 12px', background: 'rgba(10,10,10,.85)', color: 'var(--color-light-base-primary)', border: '1px solid var(--color-base-600)', borderRadius: 2, cursor: 'pointer', fontFamily: 'var(--font-geist-mono)', fontSize: 11, letterSpacing: '-.015rem', textTransform: 'uppercase' }}>
            Ampliar ↗
          </button>
        </div>
        <div style={{ position: 'absolute', bottom: 16, left: 16, fontFamily: 'var(--font-geist-mono)', fontSize: 11, letterSpacing: '-.015rem', color: 'var(--color-base-400)' }}>
          <span style={{ color: 'var(--color-light-base-primary)' }}>0{cur + 1}</span> / 0{images.length}
        </div>
      </div>
      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: `repeat(${images.length}, 1fr)`, gap: 8 }}>
        {images.map((im, i) => (
          <button key={i} onClick={() => setCur(i)} style={{
            aspectRatio: '1/1', padding: 0,
            border: `1px dashed ${i === cur ? 'var(--color-accent-100)' : 'var(--color-base-700)'}`,
            borderRadius: 4, cursor: 'pointer',
            background: `${i === cur ? 'rgba(45,212,205,.08)' : 'transparent'} url(${im}) center/cover`,
          }}/>
        ))}
      </div>
    </div>
  );
}

function InfoRail({ product, color, setColor, size, setSize, qty, setQty, curSize, tier, unit, total }: {
  product: typeof PDP_PRODUCT;
  color: string; setColor: (c: string) => void;
  size: string;  setSize: (s: string) => void;
  qty: number;   setQty: (q: number) => void;
  curSize: SizeVariant; tier: PriceTier;
  unit: number | null; total: number | null;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <Badge size="xs">{product.cat} · {product.material}</Badge>
        <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>SKU {product.sku}</span>
      </div>
      <h1 className="heading-1" style={{ margin: '6px 0 14px', color: 'var(--color-light-base-primary)' }}>{product.name}</h1>
      <p className="text-body" style={{ margin: 0, maxWidth: '42ch', color: 'var(--color-base-300)' }}>{product.tagline}</p>

      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Stars value={product.rating} />
        <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>{product.rating} · {product.reviews} avaliações</span>
      </div>

      {/* variants */}
      <div style={{ marginTop: 28, border: '1px dashed var(--color-base-700)', borderRadius: 6, padding: 20, background: 'var(--color-dark-base-secondary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>Cor</span>
          <span className="text-mono-xs" style={{ color: 'var(--color-light-base-primary)' }}>{product.variants.color.find((c) => c.k === color)?.label}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {product.variants.color.map((c) => {
            const on = color === c.k;
            return (
              <button key={c.k} onClick={() => setColor(c.k)} title={c.label} style={{
                width: 36, height: 36, borderRadius: 999, padding: 3,
                border: `1px solid ${on ? 'var(--color-accent-100)' : 'var(--color-base-700)'}`,
                background: 'transparent', cursor: 'pointer',
              }}>
                <span style={{ display: 'block', width: '100%', height: '100%', borderRadius: 999, background: c.swatch }}/>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>Dimensão</span>
          <span className="text-mono-xs" style={{ color: 'var(--color-base-400)' }}>{curSize.dim}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {product.variants.size.map((s) => {
            const on = size === s.k;
            return (
              <button key={s.k} onClick={() => setSize(s.k)} style={{
                padding: '10px 8px', cursor: 'pointer',
                border: `1px dashed ${on ? 'var(--color-accent-100)' : 'var(--color-base-700)'}`,
                background: on ? 'rgba(45,212,205,.08)' : 'var(--color-dark-base-primary)',
                color: on ? 'var(--color-accent-100)' : 'var(--color-light-base-primary)',
                borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start',
              }}>
                <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 15, letterSpacing: '-.02em' }}>{s.label}</span>
                <span className="text-mono-xs" style={{ color: on ? 'var(--color-accent-100)' : 'var(--color-base-500)' }}>
                  {s.price ? `€ ${s.price.toFixed(2).replace('.', ',')}` : 'Orçamento'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* qty + price */}
      <div style={{ marginTop: 14, border: '1px dashed var(--color-base-700)', borderRadius: 6, padding: 20, background: 'var(--color-dark-base-secondary)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 20, alignItems: 'center' }}>
          <QtyStepper qty={qty} setQty={setQty} size="lg" />
          <div style={{ textAlign: 'right' }}>
            <div className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>
              Escalão {tier.min}+ {tier.discount > 0 && <span style={{ color: 'var(--color-accent-100)' }}>· −{tier.discount}%</span>}
            </div>
            <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 36, letterSpacing: '-.04em', color: 'var(--color-light-base-primary)', marginTop: 2 }}>
              {unit ? `€ ${unit.toFixed(2).replace('.', ',')}` : 'Orçamento'}
              <span className="text-mono-xs" style={{ color: 'var(--color-base-500)', marginLeft: 8 }}>/ un</span>
            </div>
            {total != null && (
              <div className="text-mono-xs" style={{ color: 'var(--color-base-400)', marginTop: 2 }}>
                Total {qty} un · <span style={{ color: 'var(--color-light-base-primary)' }}>€ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
          <button style={{
            height: 48, padding: '0 20px', background: 'var(--color-light-base-secondary)',
            color: 'var(--color-dark-base-primary)', border: 'none', borderRadius: 2, cursor: 'pointer',
            fontFamily: 'var(--font-geist-mono)', fontSize: 13, letterSpacing: '-.015rem', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            Adicionar ao carrinho →
          </button>
          <button title="Guardar" style={{ width: 48, height: 48, background: 'transparent', border: '1px solid var(--color-base-700)', borderRadius: 2, cursor: 'pointer', color: 'var(--color-base-300)', display: 'grid', placeItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>

        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          <InfoRow label="Stock actual" value={`${product.stock.qty} un`} />
          <InfoRow label="Prazo de envio" value={product.stock.leadTime} right />
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
        <Button variant="outline">Pedir amostra</Button>
        <Button variant="outline">Orçamento em grandes quantidades</Button>
      </div>
    </div>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <div style={{ display: 'inline-flex', gap: 2 }}>
      {[1,2,3,4,5].map((n) => (
        <svg key={n} width="14" height="14" viewBox="0 0 24 24" fill={n <= value ? 'var(--color-accent-100)' : 'transparent'} stroke="var(--color-accent-100)" strokeWidth="1.5">
          <polygon points="12,2 15.1,8.8 22.5,9.5 17,14.5 18.8,22 12,17.8 5.2,22 7,14.5 1.5,9.5 8.9,8.8"/>
        </svg>
      ))}
    </div>
  );
}

function QtyStepper({ qty, setQty, size }: { qty: number; setQty: (q: number) => void; size: 'sm' | 'lg' }) {
  const h = size === 'lg' ? 44 : 32;
  const w = size === 'lg' ? 40 : 30;
  const wInp = size === 'lg' ? 60 : 42;
  const fs = size === 'lg' ? 18 : 16;
  return (
    <div style={{ display: 'inline-flex', border: '1px solid var(--color-base-700)', borderRadius: 2, alignItems: 'center' }}>
      <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: w, height: h, background: 'transparent', color: 'var(--color-light-base-primary)', border: 'none', cursor: 'pointer', fontSize: fs }}>−</button>
      <input value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} style={{ width: wInp, height: h, textAlign: 'center', background: 'transparent', border: 'none', outline: 'none', color: 'var(--color-light-base-primary)', fontFamily: 'var(--font-geist-sans)', fontSize: size === 'lg' ? 18 : 15, letterSpacing: size === 'lg' ? '-.03em' : '-.02em' }}/>
      <button onClick={() => setQty(qty + 1)} style={{ width: w, height: h, background: 'transparent', color: 'var(--color-light-base-primary)', border: 'none', cursor: 'pointer', fontSize: fs }}>+</button>
    </div>
  );
}

function InfoRow({ label, value, right }: { label: string; value: string; right?: boolean }) {
  return (
    <div style={{ padding: '10px 12px', border: '1px solid var(--color-base-900)', borderRadius: 2, textAlign: right ? 'right' : 'left' }}>
      <div className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 14, letterSpacing: '-.02em', color: 'var(--color-light-base-primary)', marginTop: 3 }}>{value}</div>
    </div>
  );
}

function MetaItem({ icon, label, sub }: { icon: string; label: string; sub: string }) {
  return (
    <div style={{ display: 'flex', gap: 14 }}>
      <span style={{ fontSize: 20, lineHeight: 1 }}>{icon}</span>
      <div>
        <div className="text-mono-sm" style={{ color: 'var(--color-light-base-primary)' }}>{label}</div>
        <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', marginTop: 4 }}>{sub}</div>
      </div>
    </div>
  );
}

function SpecsPanel() {
  const rows: [string, string][] = [
    ['Referência',           'EXP-A3-06P'],
    ['Material',             'Acrílico (PMMA) fundido 5mm'],
    ['Dimensões externas',   '297 × 420 × 1200 mm (L × P × A)'],
    ['Número de prateleiras','6'],
    ['Carga por prateleira', 'até 8 kg'],
    ['Acabamento',           'Bordos polidos · colagem estrutural'],
    ['Origem',               'Produção Jocril · Vialonga, Portugal'],
    ['Personalização',       'Gravação laser · impressão UV · corte à medida'],
    ['Garantia',             '2 anos'],
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 48 }}>
      <div>
        <h4 className="text-mono-sm" style={{ color: 'var(--color-base-500)', margin: '0 0 18px' }}>Ficha técnica</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {rows.map(([k, v]) => (
              <tr key={k} style={{ borderTop: '1px solid var(--color-base-900)' }}>
                <td style={{ padding: '14px 0', color: 'var(--color-base-400)', fontFamily: 'var(--font-geist-mono)', fontSize: 12, letterSpacing: '-.015rem', textTransform: 'uppercase', width: '40%' }}>{k}</td>
                <td style={{ padding: '14px 0', color: 'var(--color-light-base-primary)', fontFamily: 'var(--font-geist-sans)', fontSize: 14 }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h4 className="text-mono-sm" style={{ color: 'var(--color-base-500)', margin: '0 0 18px' }}>Descrição</h4>
        <p className="text-body" style={{ lineHeight: 1.6, color: 'var(--color-base-200)' }}>
          Expositor modular de chão em acrílico transparente de 5mm. Concebido para retalho de média e alta rotação, suporta até 8kg por prateleira. Estrutura colada (sem parafusos visíveis), bordos polidos à chama para um acabamento cristalino.
        </p>
        <p className="text-body" style={{ lineHeight: 1.6, color: 'var(--color-base-200)', marginTop: 12 }}>
          Disponível em quatro dimensões standard e em versão personalizada. Pode ainda ser produzido em branco, preto ou fumé. Para tiragens acima das 50 unidades o acabamento inclui embalagem individual em plástico protector e etiquetagem.
        </p>
      </div>
    </div>
  );
}

function DimPanel() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
      <div style={{ border: '1px dashed var(--color-base-700)', borderRadius: 6, padding: 32, background: 'var(--color-dark-base-secondary)', aspectRatio: '4/3', display: 'grid', placeItems: 'center' }}>
        <svg viewBox="0 0 400 300" width="100%" height="auto" style={{ maxWidth: 420 }}>
          <g stroke="var(--color-base-500)" strokeWidth="1" fill="none">
            <rect x="100" y="40" width="200" height="220" stroke="var(--color-accent-100)" />
            {[1,2,3,4,5].map((i) => <line key={i} x1="100" x2="300" y1={40 + i * 37} y2={40 + i * 37} />)}
            <line x1="70" y1="40" x2="90" y2="40" /><line x1="70" y1="260" x2="90" y2="260" /><line x1="80" y1="40" x2="80" y2="260" />
            <line x1="100" y1="280" x2="100" y2="290" /><line x1="300" y1="280" x2="300" y2="290" /><line x1="100" y1="285" x2="300" y2="285" />
          </g>
          <g fill="var(--color-base-400)" fontFamily="var(--font-geist-mono)" fontSize="10">
            <text x="60" y="155" textAnchor="end">1200 mm</text>
            <text x="200" y="300" textAnchor="middle">297 × 420 mm</text>
          </g>
          <g fill="var(--color-accent-100)" fontFamily="var(--font-geist-mono)" fontSize="9">
            <text x="105" y="52">01 · Topo</text>
            <text x="105" y="252">06 · Base</text>
          </g>
        </svg>
      </div>
      <div>
        <h4 className="text-mono-sm" style={{ color: 'var(--color-base-500)', margin: '0 0 18px' }}>Dimensões por variante</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-base-700)' }}>
              {['Ref','Larg','Prof','Altura','Peso'].map((h) => (
                <th key={h} style={{ padding: '10px 0', textAlign: 'left', fontFamily: 'var(--font-geist-mono)', fontSize: 11, letterSpacing: '-.015rem', textTransform: 'uppercase', color: 'var(--color-base-500)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['EXP-A4-04P','210','297','800','2.4 kg'],
              ['EXP-A3-06P','297','420','1200','4.1 kg'],
              ['EXP-A2-08P','420','594','1600','7.2 kg'],
            ].map((r) => (
              <tr key={r[0]} style={{ borderBottom: '1px solid var(--color-base-900)' }}>
                {r.map((c, i) => (
                  <td key={i} style={{ padding: '12px 0', fontFamily: i === 0 ? 'var(--font-geist-mono)' : 'var(--font-geist-sans)', fontSize: i === 0 ? 11 : 14, letterSpacing: i === 0 ? '-.015rem' : '-.02em', color: i === 0 ? 'var(--color-accent-100)' : 'var(--color-light-base-primary)', textTransform: i === 0 ? 'uppercase' : 'none' }}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button style={{ marginTop: 20, padding: '10px 14px', background: 'transparent', border: '1px solid var(--color-base-700)', borderRadius: 2, color: 'var(--color-light-base-primary)', cursor: 'pointer', fontFamily: 'var(--font-geist-mono)', fontSize: 11, letterSpacing: '-.015rem', textTransform: 'uppercase' }}>
          ↓ Descarregar ficha técnica (PDF)
        </button>
      </div>
    </div>
  );
}

function TiersPanel({ tiers }: { tiers: PriceTier[] }) {
  return (
    <div>
      <h4 className="text-mono-sm" style={{ color: 'var(--color-base-500)', margin: '0 0 18px' }}>Preço unitário por quantidade</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
        {tiers.map((t) => (
          <div key={t.min} style={{ border: '1px dashed var(--color-base-700)', borderRadius: 6, padding: 20, background: 'var(--color-dark-base-secondary)' }}>
            <div className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>{t.min}{t.max ? `–${t.max}` : '+'} unidades</div>
            <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 32, letterSpacing: '-.04em', color: 'var(--color-light-base-primary)', marginTop: 8 }}>€ {t.unit.toFixed(2).replace('.', ',')}</div>
            <div className="text-mono-xs" style={{ color: t.discount > 0 ? 'var(--color-accent-100)' : 'var(--color-base-600)', marginTop: 4 }}>
              {t.discount > 0 ? `−${t.discount}% vs unitário` : 'Preço base'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqPanel() {
  const faqs: [string, string][] = [
    ['Posso personalizar o meu expositor?', "Sim. Todas as referências do catálogo podem ser personalizadas com gravação laser ou impressão UV. Para medidas à escolha, use a variante 'Personalizado' e envie-nos os desenhos."],
    ['Qual é o prazo de entrega?',          'Para peças standard em stock, envio em 48h para Portugal continental. Produção por encomenda: 5–10 dias úteis consoante quantidade.'],
    ['Que pagamentos aceitam?',             'MBWay, Multibanco (Referência), cartão (Visa / Mastercard) e transferência bancária para empresas.'],
    ['Emitem factura com IVA?',             'Sim, a emissão de factura é automática após confirmação de pagamento. Introduza o NIF no checkout.'],
  ];
  return (
    <div style={{ maxWidth: 820 }}>
      {faqs.map(([q, a], i) => (
        <details key={i} style={{ borderBottom: '1px solid var(--color-base-800)', padding: '20px 0' }}>
          <summary style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', listStyle: 'none', fontFamily: 'var(--font-geist-sans)', fontSize: 18, letterSpacing: '-.02em', color: 'var(--color-light-base-primary)' }}>
            <span><span className="text-mono-xs" style={{ color: 'var(--color-base-600)', marginRight: 14 }}>0{i+1}</span>{q}</span>
            <span style={{ color: 'var(--color-base-500)' }}>+</span>
          </summary>
          <p className="text-body" style={{ marginTop: 12, lineHeight: 1.6, paddingLeft: 40 }}>{a}</p>
        </details>
      ))}
    </div>
  );
}

function ReviewsPanel() {
  const reviews = [
    { name: 'António S.', role: "Gestor de loja · L'Oréal PT", stars: 5, text: 'Qualidade impecável. Montagem simples e aspecto profissional. Pedimos uma segunda encomenda para as outras lojas.' },
    { name: 'Marta C.',   role: 'Procurement · CARM',          stars: 5, text: 'Peças robustas e tempo de produção cumprido à data. Embalagem cuidada.' },
    { name: 'João R.',    role: 'Bar manager',                  stars: 4, text: 'Exactamente como nas fotos. Só um pedido teve um bordo ligeiramente marcado, resolveram em 48h.' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 48 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 72, letterSpacing: '-.05em', color: 'var(--color-light-base-primary)', lineHeight: 1 }}>4,8</div>
        <Stars value={5} />
        <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', marginTop: 10 }}>Baseado em 47 avaliações</div>
      </div>
      <div>
        {reviews.map((r, i) => (
          <div key={i} style={{ padding: '24px 0', borderTop: '1px solid var(--color-base-900)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 15, color: 'var(--color-light-base-primary)' }}>{r.name}</div>
                <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', marginTop: 2 }}>{r.role}</div>
              </div>
              <Stars value={r.stars} />
            </div>
            <p className="text-body" style={{ margin: 0, lineHeight: 1.6 }}>{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
