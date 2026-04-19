'use client';

import Link from 'next/link';
import { useState } from 'react';

export type CategoryGridCardProps = {
  n: string;
  name: string;
  count: number;
  img: string;
  desc?: string;
  from?: string;
  href: string;
};

export default function CategoryGridCard({ n, name, count, img, desc, from, href }: CategoryGridCardProps) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: 'pointer',
        display: 'block',
        border: `1px dashed ${hover ? 'var(--color-accent-100)' : 'var(--color-base-700)'}`,
        borderRadius: 6,
        overflow: 'hidden',
        background: 'var(--color-dark-base-secondary)',
        transition: 'border-color .2s',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div style={{ aspectRatio: '1/1', background: `url(${img}) center/cover` }} />
      <div style={{ padding: '16px 18px', borderTop: '1px dashed var(--color-base-700)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="text-mono-sm" style={{ color: 'var(--color-accent-100)' }}>{n}</span>
          <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>
            {count.toString().padStart(2, '0')} refs
          </span>
        </div>
        <h3 style={{ margin: '8px 0 6px', fontFamily: 'var(--font-geist-sans)', fontSize: 22, letterSpacing: '-.025em', color: 'var(--color-light-base-primary)' }}>
          {name}
        </h3>
        {desc && (
          <p style={{ margin: 0, fontFamily: 'var(--font-geist-sans)', fontSize: 13, lineHeight: 1.45, color: 'var(--color-base-400)' }}>
            {desc}
          </p>
        )}
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px dashed var(--color-base-800)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>{from ?? ''}</span>
          <span className="text-mono-xs" style={{ color: 'var(--color-accent-100)' }}>Ver →</span>
        </div>
      </div>
    </Link>
  );
}
