'use client';

import { useState } from 'react';
import Link from 'next/link';

export type ProductMock = {
  sku: string;
  name: string;
  cat: string;
  material: string;
  dim?: string;
  from: number;
  tiers: string;
  img: string;
  stock: 'in' | 'low' | 'made';
  slug?: string;
};

export const STOCK_MAP = {
  in:   { color: 'var(--color-accent-100)', label: 'Em stock' },
  low:  { color: '#eab308',                 label: 'Últimas unidades' },
  made: { color: 'var(--color-base-500)',   label: 'Produção por encomenda' },
} as const;

export default function ProductCard({ p }: { p: ProductMock }) {
  const [hover, setHover] = useState(false);
  const stock = STOCK_MAP[p.stock];
  return (
    <Link
      href={`/produtos/${p.slug ?? p.sku.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
      style={{ display: 'block', textDecoration: 'none' }}
    >
      <article
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          border: `1px dashed ${hover ? 'var(--color-accent-100)' : 'var(--color-base-700)'}`,
          borderRadius: 6,
          overflow: 'hidden',
          background: 'var(--color-dark-base-secondary)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'border-color .2s var(--ease-in-out)',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            position: 'relative',
            aspectRatio: '4/3',
            overflow: 'hidden',
            background: 'var(--color-dark-base-primary)',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `url(${p.img}) center/cover`,
              transform: hover ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform .5s var(--ease-out)',
            }}
          />
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '3px 8px',
                background: 'var(--color-dark-base-secondary)',
                border: '1px solid var(--color-base-700)',
                borderRadius: 2,
                fontFamily: 'var(--font-geist-mono)',
                fontSize: 10,
                letterSpacing: '-.01rem',
                textTransform: 'uppercase',
                color: 'var(--color-base-200)',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: 999, background: stock.color }} />
              {stock.label}
            </span>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              opacity: hover ? 1 : 0,
              transition: 'opacity .2s',
            }}
          >
            <button
              style={{
                height: 30,
                padding: '0 12px',
                background: 'var(--color-light-base-secondary)',
                color: 'var(--color-dark-base-primary)',
                border: 'none',
                borderRadius: 2,
                cursor: 'pointer',
                fontFamily: 'var(--font-geist-mono)',
                fontSize: 11,
                letterSpacing: '-.015rem',
                textTransform: 'uppercase',
              }}
            >
              Ver produto →
            </button>
          </div>
        </div>
        <div
          style={{
            padding: '14px 16px',
            borderTop: '1px dashed var(--color-base-700)',
            display: 'grid',
            gap: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: 10,
            }}
          >
            <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>{p.sku}</span>
            <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>{p.material}</span>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-geist-sans)',
              fontSize: 15,
              letterSpacing: '-.03em',
              color: hover ? 'var(--color-accent-100)' : 'var(--color-light-base-primary)',
              lineHeight: 1.2,
              transition: 'color .2s',
            }}
          >
            {p.name}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'end',
              marginTop: 6,
              paddingTop: 10,
              borderTop: '1px solid var(--color-base-900)',
            }}
          >
            <div>
              <div className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>Desde</div>
              <div
                style={{
                  fontFamily: 'var(--font-geist-sans)',
                  fontSize: 18,
                  letterSpacing: '-.04em',
                  color: 'var(--color-light-base-primary)',
                  marginTop: 2,
                }}
              >
                € {p.from.toFixed(2).replace('.', ',')}
              </div>
            </div>
            <span className="text-mono-xs" style={{ color: 'var(--color-base-600)', textAlign: 'right' }}>
              Escalões<br />{p.tiers}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
