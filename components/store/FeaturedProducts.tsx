'use client';

import { useState } from 'react';
import Badge from './Badge';
import Button from './Button';
import ProductCard, { type ProductMock } from './ProductCard';

// Now rendered with products passed from the homepage server component.
// (Mock data removed — lives in lib/queries/products.ts → listFeaturedProducts)

export default function FeaturedProducts({ products = [] }: { products?: ProductMock[] }) {
  const [filter, setFilter] = useState<string>('all');
  const cats = ['all', ...Array.from(new Set(products.map((p) => p.cat).filter(Boolean)))];
  const items = filter === 'all' ? products : products.filter((p) => p.cat === filter);

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
