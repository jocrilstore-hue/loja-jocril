'use client';

import { useState } from 'react';
import Badge from '@/components/store/Badge';
import FooterCTA from '@/components/store/FooterCTA';

type ProjSize = 'S' | 'M' | 'L';

const PROJECTS: { k: string; client: string; sector: string; year: string; brief: string; process: string; img: string; size: ProjSize }[] = [
  { k: 'carm-premium', client: 'CARM',         sector: 'Vinhos',      year: '2025', brief: 'Expositor de chão premium para a gama Reserva da CARM.',              process: 'Corte laser + termoformação',  img: '/assets/portfolio/carm-premium.avif',    size: 'L' },
  { k: 'stoli',        client: 'Stolichnaya',  sector: 'Bebidas',     year: '2025', brief: 'Display balcão com iluminação LED embutida.',                         process: 'Corte laser + impressão UV',   img: '/assets/portfolio/stoli.avif',           size: 'M' },
  { k: 'ricola',       client: 'Ricola',       sector: 'Confeitaria', year: '2024', brief: 'POS com 6 níveis para pastilhas e rebuçados.',                        process: 'Termoformação',                img: '/assets/portfolio/ricola.avif',          size: 'M' },
  { k: 'beefeater',    client: 'Beefeater',    sector: 'Bebidas',     year: '2024', brief: 'Expositor de marca em acrílico fumado para garrafeiras premium.',     process: 'Corte laser + gravação',       img: '/assets/portfolio/beefeater.avif',       size: 'L' },
  { k: 'rayban',       client: 'Ray-Ban',      sector: 'Óculos',      year: '2024', brief: 'Display de parede retroiluminado para ótica de luxo.',                process: 'Impressão UV + montagem LED',  img: '/assets/portfolio/rayban.avif',          size: 'S' },
  { k: 'bioderma',     client: 'Bioderma',     sector: 'Farmácia',    year: '2024', brief: 'Porta-folhetos de balcão para farmácias em Portugal.',                process: 'Termoformação',                img: '/assets/portfolio/bioderma.avif',        size: 'S' },
  { k: 'fanta',        client: 'Fanta',        sector: 'Bebidas',     year: '2023', brief: 'Urna promocional para passatempo nacional.',                         process: 'Corte laser + colagem UV',     img: '/assets/portfolio/fanta.avif',           size: 'M' },
  { k: 'glade',        client: 'Glade',        sector: 'Lar',         year: '2023', brief: 'Expositor cilíndrico modular para grande distribuição.',              process: 'Termoformação',                img: '/assets/portfolio/glade.avif',           size: 'S' },
  { k: 'heineken',     client: 'Heineken',     sector: 'Bebidas',     year: '2023', brief: 'Troféu oficial de campanha nacional em acrílico cristal.',           process: 'Corte laser + polimento',      img: '/assets/portfolio/heineken-trophy.avif', size: 'L' },
  { k: 'carm',         client: 'CARM',         sector: 'Vinhos',      year: '2022', brief: 'Expositor de balcão para loja do produtor.',                         process: 'Corte laser',                  img: '/assets/portfolio/carm.avif',            size: 'S' },
];

const SIZE_MAP: Record<ProjSize, string> = { S: 'span 3', M: 'span 4', L: 'span 5' };
const ASPECT_MAP: Record<ProjSize, string> = { S: '1/1', M: '4/3', L: '16/11' };

const SECTORS = ['todos', ...Array.from(new Set(PROJECTS.map((p) => p.sector)))];

export default function PortfolioPage() {
  const [filter, setFilter] = useState('todos');

  const filtered = filter === 'todos' ? PROJECTS : PROJECTS.filter((p) => p.sector === filter);

  return (
    <>
      <main id="main">
        <section data-screen-label="01 Portfolio hero" style={{ padding: '56px 40px 40px', borderBottom: '1px dashed var(--color-base-800)', background: 'var(--color-dark-base-primary)' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <Badge size="sm">Portfolio · {PROJECTS.length} trabalhos selecionados</Badge>
            <h1 className="heading-1" style={{ margin: '16px 0 24px', color: 'var(--color-light-base-primary)' }}>
              Trabalho com <span style={{ color: 'var(--color-accent-100)' }}>marcas</span><br/>que percebem de detalhe.
            </h1>
            <p className="text-body" style={{ color: 'var(--color-base-300)', maxWidth: '56ch' }}>
              Uma seleção dos últimos três anos. Para confidencialidade, alguns projetos não estão listados publicamente — pergunte-nos.
            </p>
          </div>
        </section>

        <section style={{ padding: '24px 40px', borderBottom: '1px solid var(--color-base-900)', background: 'var(--color-dark-base-primary)' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SECTORS.map((s) => {
              const on = s === filter;
              return (
                <button key={s} onClick={() => setFilter(s)} style={{
                  padding: '8px 14px', cursor: 'pointer',
                  border: `1px dashed ${on ? 'var(--color-accent-100)' : 'var(--color-base-700)'}`,
                  background: on ? 'rgba(240,71,66,.08)' : 'transparent',
                  color: on ? 'var(--color-accent-100)' : 'var(--color-base-400)',
                  fontFamily: 'var(--font-geist-mono)', fontSize: 12, letterSpacing: '-.015rem',
                  textTransform: 'uppercase', borderRadius: 2,
                }}>
                  {s} <span style={{ color: 'var(--color-base-700)' }}>· {s === 'todos' ? PROJECTS.length : PROJECTS.filter((p) => p.sector === s).length}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section data-screen-label="02 Grelha" style={{ padding: '40px 40px 80px', background: 'var(--color-dark-base-primary)' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 14 }}>
            {filtered.map((p) => (
              <div key={p.k}
                style={{ gridColumn: SIZE_MAP[p.size], cursor: 'pointer', border: '1px dashed var(--color-base-800)', borderRadius: 6, overflow: 'hidden', background: 'var(--color-dark-base-secondary)', transition: 'border-color .2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-100)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-base-800)')}>
                <div style={{ aspectRatio: ASPECT_MAP[p.size], background: `url(${p.img}) center/cover` }}/>
                <div style={{ padding: '14px 16px', borderTop: '1px dashed var(--color-base-800)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 18, letterSpacing: '-.025em', color: 'var(--color-light-base-primary)' }}>{p.client}</span>
                    <span className="text-mono-xs" style={{ color: 'var(--color-base-600)' }}>{p.year}</span>
                  </div>
                  <p style={{ margin: '6px 0 10px', fontFamily: 'var(--font-geist-sans)', fontSize: 13, lineHeight: 1.45, color: 'var(--color-base-400)' }}>{p.brief}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px dashed var(--color-base-800)' }}>
                    <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>{p.process}</span>
                    <span className="text-mono-xs" style={{ color: 'var(--color-accent-100)' }}>Ver caso →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <FooterCTA />
    </>
  );
}
