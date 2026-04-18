'use client';

import { useState } from 'react';
import Badge from '@/components/store/Badge';
import Button from '@/components/store/Button';
import FooterCTA from '@/components/store/FooterCTA';

const PROCESSES = [
  {
    id: '01', k: 'corte-laser', short: 'Corte laser', title: 'Corte & gravação laser',
    lead: 'Corte e gravação em acrílico, madeiras e cortiça com tolerância de ±0,1 mm.',
    specs: [
      ['Potência', '150 W CO₂'], ['Área útil', '1300×900 mm'], ['Espessura máx.', '15 mm'],
      ['Tolerância', '±0,1 mm'], ['Gravação', '256 níveis'], ['Máquinas', '2'],
    ],
    materials: ['Acrílico', 'MDF', 'Contraplacado', 'Cortiça', 'Feltro', 'Cartolina'],
    img: '/assets/portfolio/carm-premium.avif',
  },
  {
    id: '02', k: 'termoform', short: 'Termoformação', title: 'Termoformação a vácuo',
    lead: 'Moldagem de placas de acrílico e PETG sobre moldes próprios ou cedidos pelo cliente.',
    specs: [
      ['Área útil', '700×500 mm'], ['Espessura', '0,5 – 2 mm'], ['Série mín.', '10 unid.'],
      ['Série máx.', '10 000 unid.'], ['Desmoldagem', 'CNC auxiliar'], ['Prazo típico', '5–10 dias'],
    ],
    materials: ['Acrílico', 'PETG', 'Policarbonato', 'PVC'],
    img: '/assets/portfolio/beefeater.avif',
  },
  {
    id: '03', k: 'impressao', short: 'Impressão UV', title: 'Impressão UV direta',
    lead: 'Impressão direta sobre rígidos até 3,2 m, com tinta branca, CMYK e verniz.',
    specs: [
      ['Largura máx.', '3200 mm'], ['Resolução', '1440 dpi'], ['Cores', 'CMYK + W + V'],
      ['Cura', 'LED UV'], ['Substratos', 'Rígidos'], ['Prazo típico', '3–5 dias'],
    ],
    materials: ['Acrílico', 'Forex', 'Alumínio', 'Madeira', 'Vidro'],
    img: '/assets/portfolio/ricola.avif',
  },
  {
    id: '04', k: 'cnc', short: 'CNC', title: 'Fresagem CNC',
    lead: 'Fresagem de precisão para acabamentos, rasgos e furações fora do alcance do laser.',
    specs: [
      ['Área útil', '2000×1000 mm'], ['Eixos', '3'], ['Velocidade', '24 000 rpm'],
      ['Tolerância', '±0,05 mm'], ['Espessura máx.', '40 mm'], ['Máquinas', '1'],
    ],
    materials: ['Acrílico', 'MDF', 'Alumínio', 'PVC expandido'],
    img: '/assets/portfolio/stoli.avif',
  },
];

export default function ProcessosPage() {
  const [active, setActive] = useState(PROCESSES[0].k);
  const cur = PROCESSES.find((p) => p.k === active)!;

  return (
    <>
      <main id="main">
        <section data-screen-label="01 Processos hero" style={{ padding: '56px 40px 40px', borderBottom: '1px dashed var(--color-base-800)', background: 'var(--color-dark-base-primary)' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <Badge size="sm">Processos · Capacidade de produção</Badge>
            <h1 className="heading-1" style={{ margin: '16px 0 24px', color: 'var(--color-light-base-primary)' }}>
              Como <span style={{ fontStyle: 'italic', color: 'var(--color-accent-100)' }}>fazemos</span>.
            </h1>
            <p className="text-body" style={{ color: 'var(--color-base-300)', maxWidth: '58ch' }}>
              Quatro processos industriais, todos em casa, todos controlados pela mesma equipa. Sem subcontratação de etapas críticas.
            </p>
          </div>
        </section>

        <nav style={{ borderBottom: '1px dashed var(--color-base-800)', background: 'var(--color-dark-base-primary)', position: 'sticky', top: 0, zIndex: 5 }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 40px', display: 'flex', gap: 0 }}>
            {PROCESSES.map((p) => {
              const on = p.k === active;
              return (
                <button key={p.k} onClick={() => setActive(p.k)} style={{
                  flex: 1, padding: '22px 20px',
                  background: on ? 'var(--color-dark-base-secondary)' : 'transparent',
                  border: 'none', borderRight: '1px dashed var(--color-base-800)',
                  borderBottom: `2px solid ${on ? 'var(--color-accent-100)' : 'transparent'}`,
                  color: on ? 'var(--color-light-base-primary)' : 'var(--color-base-500)',
                  textAlign: 'left', cursor: 'pointer',
                }}>
                  <div className="text-mono-xs" style={{ color: on ? 'var(--color-accent-100)' : 'var(--color-base-600)' }}>{p.id}</div>
                  <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 18, letterSpacing: '-.025em', marginTop: 4 }}>{p.short}</div>
                </button>
              );
            })}
          </div>
        </nav>

        <section data-screen-label="02 Detalhe" style={{ padding: '60px 40px 80px', background: 'var(--color-dark-base-primary)' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
            <div>
              <div style={{ aspectRatio: '4/3', background: `url(${cur.img}) center/cover`, borderRadius: 6, border: '1px dashed var(--color-base-800)' }}/>
              <div style={{ marginTop: 16, padding: 20, border: '1px dashed var(--color-base-800)', borderRadius: 6, background: 'var(--color-dark-base-secondary)' }}>
                <Badge size="xs">Materiais</Badge>
                <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {cur.materials.map((m) => (
                    <span key={m} className="text-mono-xs" style={{ padding: '6px 10px', border: '1px solid var(--color-base-800)', borderRadius: 2, color: 'var(--color-base-300)' }}>{m}</span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <span className="text-mono-sm" style={{ color: 'var(--color-accent-100)' }}>{cur.id}</span>
              <h2 className="heading-2" style={{ margin: '8px 0 16px', color: 'var(--color-light-base-primary)' }}>{cur.title}</h2>
              <p className="text-body" style={{ color: 'var(--color-base-300)', marginBottom: 32 }}>{cur.lead}</p>

              <div style={{ border: '1px dashed var(--color-base-800)', borderRadius: 6, overflow: 'hidden' }}>
                {cur.specs.map((row, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 16, padding: '14px 18px', borderTop: i === 0 ? 'none' : '1px dashed var(--color-base-800)' }}>
                    <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>{row[0]}</span>
                    <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 15, color: 'var(--color-light-base-primary)', letterSpacing: '-.02em' }}>{row[1]}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
                <Button variant="solid">Pedir orçamento →</Button>
                <Button variant="outline">Ver casos de uso</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterCTA />
    </>
  );
}
