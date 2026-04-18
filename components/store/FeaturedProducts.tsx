'use client';

import { useState } from 'react';
import Badge from './Badge';
import Button from './Button';
import ProductCard, { type ProductMock } from './ProductCard';

const PRODS: ProductMock[] = [
  { sku: 'EXP-A3-06P',   name: 'Expositor A3 · 6 prateleiras',   cat: 'Acrílicos Chão',  material: 'Acrílico 5mm', from: 42.5,  tiers: '1+ · 10+ · 100+', img: '/assets/portfolio/carm-premium.avif', stock: 'in'   },
  { sku: 'CX-20-T',      name: 'Caixa transparente 20×20×20',     cat: 'Caixas',           material: 'Acrílico 3mm', from: 14.9,  tiers: '5+ · 25+ · 100+', img: '/assets/portfolio/beefeater.avif',    stock: 'in'   },
  { sku: 'MOL-30×40',    name: 'Moldura suspensa 30×40',          cat: 'Molduras',         material: 'Acrílico 4mm', from: 19.8,  tiers: '2+ · 10+',         img: '/assets/portfolio/rayban.avif',       stock: 'low'  },
  { sku: 'EXP-MESA-4',   name: 'Expositor de mesa 4 níveis',      cat: 'Acrílicos Mesa',   material: 'Acrílico 5mm', from: 28.0,  tiers: '1+ · 10+',         img: '/assets/portfolio/stoli.avif',        stock: 'in'   },
  { sku: 'TOMB-CLASSIC', name: 'Tombola clássica ø250',           cat: 'Tombolas',         material: 'Acrílico 5mm', from: 165.0, tiers: '1+',                img: '/assets/portfolio/glade.avif',        stock: 'made' },
  { sku: 'SIG-PAR-A4',   name: 'Bolsa de parede A4',              cat: 'Sinalética',       material: 'Acrílico 3mm', from: 9.8,   tiers: '10+ · 50+ · 250+', img: '/assets/portfolio/bioderma.avif',     stock: 'in'   },
  { sku: 'EXP-PAR-FOL',  name: 'Porta-folhetos parede A5',        cat: 'Acrílicos Parede', material: 'Acrílico 3mm', from: 7.5,   tiers: '10+ · 100+',        img: '/assets/portfolio/ricola.avif',       stock: 'in'   },
  { sku: 'EXP-COS-03',   name: 'Display cosmético 3 níveis',      cat: 'Acrílicos Mesa',   material: 'Acrílico 4mm', from: 24.0,  tiers: '1+ · 20+',          img: '/assets/portfolio/loreal.avif',       stock: 'low'  },
];

export default function FeaturedProducts() {
  const [filter, setFilter] = useState<string>('all');
  const cats = ['all', ...Array.from(new Set(PRODS.map((p) => p.cat)))];
  const items = filter === 'all' ? PRODS : PRODS.filter((p) => p.cat === filter);

  return (
    <section
      data-screen-label="03 Em destaque"
      style={{ padding: '60px 40px 100px', background: 'var(--color-dark-base-primary)' }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'end',
            gap: 40,
            marginBottom: 36,
          }}
        >
          <div>
            <Badge size="sm">Em destaque</Badge>
            <h2
              className="heading-2"
              style={{ margin: '20px 0 0 0', color: 'var(--color-light-base-primary)', maxWidth: '24ch' }}
            >
              Mais pedidos esta semana.
            </h2>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap',
              maxWidth: 520,
              justifyContent: 'flex-end',
            }}
          >
            {cats.map((c) => {
              const active = filter === c;
              return (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  style={{
                    height: 28,
                    padding: '0 12px',
                    borderRadius: 999,
                    background: active ? 'var(--color-light-base-secondary)' : 'transparent',
                    color: active ? 'var(--color-dark-base-primary)' : 'var(--color-base-400)',
                    border: `1px solid ${active ? 'transparent' : 'var(--color-base-700)'}`,
                    fontFamily: 'var(--font-geist-mono)',
                    fontSize: 11,
                    letterSpacing: '-.015rem',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  {c === 'all' ? 'Tudo' : c}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {items.map((p) => (
            <ProductCard key={p.sku} p={p} />
          ))}
        </div>

        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
          <Button variant="outline" href="/produtos">
            Ver todos os 183 produtos →
          </Button>
        </div>
      </div>
    </section>
  );
}
