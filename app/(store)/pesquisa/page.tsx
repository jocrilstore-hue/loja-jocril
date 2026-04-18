'use client';

import { useState } from 'react';
import Badge from '@/components/store/Badge';
import Button from '@/components/store/Button';
import ProductCard, { type ProductMock } from '@/components/store/ProductCard';
import FooterCTA from '@/components/store/FooterCTA';

const RESULTS: ProductMock[] = [
  { sku: 'EXP-A3-06P',  name: 'Expositor A3 · 6 prateleiras',         cat: 'Acrílicos Chão',  material: 'Acrílico 5mm',  from: 42.50,  tiers: '1+ · 10+ · 100+', img: '/assets/portfolio/carm-premium.avif', stock: 'in'   },
  { sku: 'EXP-A3-08P',  name: 'Expositor A3 · 8 prateleiras',          cat: 'Acrílicos Chão',  material: 'Acrílico 6mm',  from: 54.00,  tiers: '1+ · 5+',          img: '/assets/portfolio/stoli.avif',        stock: 'in'   },
  { sku: 'EXP-A4-04P',  name: 'Expositor A4 · 4 prateleiras',          cat: 'Acrílicos Chão',  material: 'Acrílico 5mm',  from: 32.80,  tiers: '1+ · 10+',         img: '/assets/portfolio/carm.avif',         stock: 'in'   },
  { sku: 'EXP-A3-FU',   name: 'Expositor A3 · Fumado',                  cat: 'Acrílicos Chão',  material: 'Acrílico 5mm',  from: 46.20,  tiers: '1+',               img: '/assets/portfolio/beefeater.avif',    stock: 'low'  },
  { sku: 'DSP-PAR-A3',  name: 'Display parede A3 c/ iluminação',        cat: 'Displays Parede', material: 'Acrílico + LED', from: 128.00, tiers: '1+',               img: '/assets/portfolio/rayban.avif',       stock: 'in'   },
  { sku: 'EXP-A2-08P',  name: 'Expositor A2 · 8 prateleiras',           cat: 'Acrílicos Chão',  material: 'Acrílico 6mm',  from: 74.00,  tiers: '1+ · 5+',          img: '/assets/portfolio/bioderma.avif',     stock: 'made' },
];

const CATEGORIES  = [{ n: 'Acrílicos Chão', c: 28 }, { n: 'Displays Parede', c: 12 }, { n: 'Caixas & Urnas', c: 7 }];
const SUGGESTIONS = ['expositor a3 chão', 'expositor a3 com iluminação', 'acrílico 5mm a3 transparente'];

export default function PesquisaPage() {
  const [q, setQ]         = useState('expositor acrilico a3');
  const [scope, setScope] = useState('all');

  return (
    <>
      <main id="main">
        {/* search bar block */}
        <section data-screen-label="01 Search header" style={{ padding: '40px 40px 24px', borderBottom: '1px dashed var(--color-base-800)', background: 'var(--color-dark-base-primary)' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <Badge size="sm">Resultados da pesquisa</Badge>
            <h1 className="heading-1" style={{ margin: '14px 0 0', color: 'var(--color-light-base-primary)' }}>
              <span style={{ color: 'var(--color-base-500)' }}>"</span>{q}<span style={{ color: 'var(--color-base-500)' }}>"</span>
            </h1>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 20 }}>
              <span className="text-mono-xs" style={{ color: 'var(--color-base-400)' }}>
                <span style={{ color: 'var(--color-light-base-primary)' }}>{RESULTS.length}</span> produtos · <span style={{ color: 'var(--color-light-base-primary)' }}>{CATEGORIES.length}</span> categorias · <span style={{ color: 'var(--color-base-600)' }}>0,09 s</span>
              </span>
              <span style={{ flex: 1 }}/>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', border: '1px dashed var(--color-base-700)', borderRadius: 2, minWidth: 440, background: 'var(--color-dark-base-secondary)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-base-400)" strokeWidth="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
                <input value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: 'var(--color-light-base-primary)', fontFamily: 'var(--font-geist-mono)', fontSize: 13, letterSpacing: '-.015rem' }}/>
                <span className="text-mono-xs" style={{ color: 'var(--color-base-600)', padding: '2px 6px', border: '1px solid var(--color-base-700)', borderRadius: 2 }}>⌘K</span>
              </div>
            </div>
          </div>
        </section>

        {/* scope tabs */}
        <section style={{ padding: '16px 40px', borderBottom: '1px solid var(--color-base-900)', background: 'var(--color-dark-base-primary)' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', gap: 28 }}>
            {[
              { k: 'all',  t: 'Tudo',       n: RESULTS.length + CATEGORIES.length },
              { k: 'prod', t: 'Produtos',    n: RESULTS.length },
              { k: 'cat',  t: 'Categorias', n: CATEGORIES.length },
              { k: 'help', t: 'Ajuda & FAQ', n: 0 },
            ].map((tab) => {
              const on = scope === tab.k;
              return (
                <button key={tab.k} onClick={() => setScope(tab.k)} style={{
                  padding: '10px 0', background: 'transparent', border: 'none', cursor: 'pointer',
                  borderBottom: `2px solid ${on ? 'var(--color-accent-100)' : 'transparent'}`,
                  color: on ? 'var(--color-light-base-primary)' : 'var(--color-base-500)',
                  fontFamily: 'var(--font-geist-mono)', fontSize: 12, letterSpacing: '-.015rem', textTransform: 'uppercase',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  {tab.t} <span style={{ color: 'var(--color-base-700)' }}>· {tab.n.toString().padStart(2, '0')}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* body */}
        <section data-screen-label="02 Search body" style={{ padding: '32px 40px 80px', background: 'var(--color-dark-base-primary)' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32 }}>
            {/* left rail */}
            <aside>
              <div style={{ marginBottom: 28 }}>
                <Badge size="xs">Sugestões</Badge>
                <div style={{ marginTop: 12, display: 'grid', gap: 2 }}>
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => setQ(s)} style={{
                      textAlign: 'left', padding: '10px 0', background: 'transparent', border: 'none',
                      borderTop: '1px solid var(--color-base-900)', cursor: 'pointer',
                      color: 'var(--color-base-300)', fontFamily: 'var(--font-geist-sans)', fontSize: 14, letterSpacing: '-.02em',
                    }}>
                      <span style={{ color: 'var(--color-base-600)', marginRight: 8 }}>↗</span>{s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Badge size="xs">Categorias encontradas</Badge>
                <div style={{ marginTop: 12, display: 'grid', gap: 6 }}>
                  {CATEGORIES.map((c) => (
                    <button key={c.n} style={{
                      padding: '12px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      border: '1px dashed var(--color-base-800)', borderRadius: 2,
                      background: 'transparent', textAlign: 'left',
                    }}>
                      <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 14, color: 'var(--color-light-base-primary)', letterSpacing: '-.02em' }}>{c.n}</span>
                      <span className="text-mono-xs" style={{ color: 'var(--color-accent-100)' }}>{c.c} produtos</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* results */}
            <div>
              {/* category highlight */}
              <div style={{ marginBottom: 28, padding: 24, border: '1px dashed var(--color-base-700)', borderRadius: 6, background: 'var(--color-dark-base-secondary)' }}>
                <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', marginBottom: 16 }}>
                  <span style={{ color: 'var(--color-accent-300)' }}>●</span> Melhor correspondência · Categoria
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 32, alignItems: 'center' }}>
                  <div>
                    <h2 className="heading-2" style={{ margin: 0, color: 'var(--color-light-base-primary)' }}>
                      Acrílicos <span style={{ color: 'var(--color-accent-100)' }}>de chão</span>
                    </h2>
                    <p className="text-body" style={{ marginTop: 10, maxWidth: '46ch', color: 'var(--color-base-300)' }}>
                      28 referências de expositores de chão em acrílico, de A5 a A2, em 4 cores standard. Desde € 28,00.
                    </p>
                    <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                      <Button variant="solid">Ver categoria →</Button>
                      <span className="text-mono-xs" style={{ alignSelf: 'center', color: 'var(--color-base-500)' }}>28 produtos · Envio em 48h</span>
                    </div>
                  </div>
                  <div style={{ aspectRatio: '16/9', background: 'url(/assets/portfolio/carm-premium.avif) center/cover', border: '1px dashed var(--color-base-700)', borderRadius: 4 }}/>
                </div>
              </div>

              {/* product grid */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                <Badge size="sm">Produtos relacionados · {RESULTS.length}</Badge>
                <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>Ordenado por relevância</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {RESULTS.map((p) => <ProductCard key={p.sku} p={p} />)}
              </div>

              {/* no results helper */}
              <div style={{ marginTop: 40, padding: 24, border: '1px dashed var(--color-base-800)', borderRadius: 6 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center' }}>
                  <div>
                    <div className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>Não encontrou o que procura?</div>
                    <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 24, letterSpacing: '-.03em', color: 'var(--color-light-base-primary)', marginTop: 4 }}>
                      Peça um orçamento para uma peça à medida.
                    </div>
                  </div>
                  <Button variant="outline">Pedir orçamento →</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterCTA />
    </>
  );
}
