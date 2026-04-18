'use client';

import Badge from '@/components/store/Badge';
import FooterCTA from '@/components/store/FooterCTA';

const GROUPS = [
  {
    group: 'Acrílicos',
    items: [
      { n: '01', name: 'Expositores de chão',  count: 32, from: 'desde € 28,00', img: '/assets/portfolio/carm-premium.avif', desc: 'Expositores verticais com prateleiras, em formatos A5 a A2.' },
      { n: '02', name: 'Expositores de mesa',  count: 48, from: 'desde € 12,50', img: '/assets/portfolio/carm.avif',          desc: 'Peças compactas para balcão e ponto de venda.' },
      { n: '03', name: 'Displays de parede',   count: 21, from: 'desde € 42,00', img: '/assets/portfolio/ricola.avif',        desc: 'Placas, porta-folhetos e painéis iluminados.' },
    ],
  },
  {
    group: 'Caixas e armazenamento',
    items: [
      { n: '04', name: 'Caixas em acrílico',   count: 19, from: 'desde € 34,00', img: '/assets/portfolio/beefeater.avif',        desc: 'Com e sem tampa, tamanhos standard e à medida.' },
      { n: '05', name: 'Urnas e tombolas',     count: 12, from: 'desde € 58,00', img: '/assets/portfolio/fanta.avif',             desc: 'Urnas para sorteios, coleta e amostragem.' },
      { n: '06', name: 'Dispensadores',        count: 14, from: 'desde € 48,00', img: '/assets/portfolio/heineken-trophy.avif',   desc: 'Porta-folhetos, porta-cartões e dispensadores.' },
    ],
  },
  {
    group: 'Impressão e serviços',
    items: [
      { n: '07', name: 'Molduras',             count: 27, from: 'desde € 18,00', img: '/assets/portfolio/stoli.avif',   desc: 'Molduras em acrílico e alumínio, vários formatos.' },
      { n: '08', name: 'Impressão digital',    count: 8,  from: 'orçamento',     img: '/assets/portfolio/glade.avif',   desc: 'Impressão UV direta sobre rígidos até 3,2 m.' },
      { n: '09', name: 'Corte laser à medida', count: 4,  from: 'orçamento',     img: '/assets/portfolio/rayban.avif',  desc: 'Serviço de corte e gravação em acrílicos e madeiras.' },
    ],
  },
];

const total = GROUPS.reduce((s, g) => s + g.items.reduce((x, i) => x + i.count, 0), 0);

export default function CategoriasPage() {
  return (
    <>
      <main id="main">
        <section data-screen-label="01 Categorias hero" style={{ padding: '64px 40px 40px', borderBottom: '1px dashed var(--color-base-800)', background: 'var(--color-dark-base-primary)' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 60, alignItems: 'end' }}>
            <div>
              <Badge size="sm">Catálogo · {total.toString().padStart(3, '0')} referências</Badge>
              <h1 className="heading-1" style={{ margin: '20px 0 0', color: 'var(--color-light-base-primary)' }}>
                Todas as <span style={{ color: 'var(--color-accent-100)' }}>categorias</span>.
              </h1>
            </div>
            <p className="text-body" style={{ color: 'var(--color-base-300)', maxWidth: '44ch' }}>
              Nove famílias de produto, todas produzidas na nossa fábrica em Leiria. Corte laser, termoformação a vácuo e impressão UV integrados.
            </p>
          </div>
        </section>

        {GROUPS.map((g, gi) => (
          <section key={g.group} data-screen-label={`0${gi + 2} ${g.group}`} style={{ padding: '64px 40px', borderBottom: gi < GROUPS.length - 1 ? '1px solid var(--color-base-900)' : 'none', background: 'var(--color-dark-base-primary)' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 28 }}>
                <span className="text-mono-xs" style={{ color: 'var(--color-base-600)' }}>{String(gi + 1).padStart(2, '0')} · {g.items.reduce((s, i) => s + i.count, 0)} produtos</span>
                <h2 className="heading-2" style={{ margin: 0, color: 'var(--color-light-base-primary)' }}>{g.group}</h2>
                <div style={{ flex: 1, borderBottom: '1px dashed var(--color-base-800)', alignSelf: 'center' }}/>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {g.items.map((c) => (
                  <div key={c.n}
                    style={{ cursor: 'pointer', border: '1px dashed var(--color-base-700)', borderRadius: 6, overflow: 'hidden', background: 'var(--color-dark-base-secondary)', transition: 'border-color .2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-100)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-base-700)')}>
                    <div style={{ aspectRatio: '4/3', background: `url(${c.img}) center/cover` }}/>
                    <div style={{ padding: '16px 18px', borderTop: '1px dashed var(--color-base-700)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span className="text-mono-sm" style={{ color: 'var(--color-accent-100)' }}>{c.n}</span>
                        <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>{c.count.toString().padStart(2, '0')} refs</span>
                      </div>
                      <h3 style={{ margin: '8px 0 6px', fontFamily: 'var(--font-geist-sans)', fontSize: 22, letterSpacing: '-.025em', color: 'var(--color-light-base-primary)' }}>{c.name}</h3>
                      <p style={{ margin: 0, fontFamily: 'var(--font-geist-sans)', fontSize: 13, lineHeight: 1.45, color: 'var(--color-base-400)' }}>{c.desc}</p>
                      <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px dashed var(--color-base-800)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>{c.from}</span>
                        <span className="text-mono-xs" style={{ color: 'var(--color-accent-100)' }}>Ver →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>
      <FooterCTA />
    </>
  );
}
