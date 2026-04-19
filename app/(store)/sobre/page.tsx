import type { Metadata } from 'next';
import Badge from '@/components/store/Badge';
import Button from '@/components/store/Button';

export const metadata: Metadata = {
  title: 'Sobre Nós',
  description: 'Desde 1994 que a Jocril produz materiais PLV e Hotelaria com precisão industrial — corte laser, impressão UV e termoformação.',
};

const PROCESSES = [
  { id: 1, short: 'Corte laser',   title: 'Corte laser de precisão',   desc: 'Duas máquinas de corte laser de 150 W, área de trabalho 1300×900 mm. Cortamos acrílico até 15 mm, contraplacado, MDF e cortiça.',   details: 'Tolerância ±0,1 mm. Gravação a níveis de potência até 256 níveis de cinzento.',                                                     img: '/assets/portfolio/carm-premium.avif' },
  { id: 2, short: 'Termoformação', title: 'Termoformação a vácuo',      desc: 'Termoformação de placas de acrílico e PETG até 2 mm, em moldes próprios ou cedidos pelo cliente.',                                    details: 'Área útil 700×500 mm. Produzimos protótipos e séries de 10.000 unidades com a mesma precisão.',                                     img: '/assets/portfolio/beefeater.avif' },
  { id: 3, short: 'Impressão UV',  title: 'Impressão UV direta',        desc: 'Impressão direta sobre rígidos até 3,2 m, com tinta branca, CMYK e verniz. Para sinalética, sinalética, POP e displays.',            details: 'Resolução 1440 dpi. Cura instantânea, sem necessidade de laminar.',                                                                   img: '/assets/portfolio/ricola.avif' },
  { id: 4, short: 'Montagem',      title: 'Montagem e acabamento',      desc: 'Equipa dedicada à montagem, colagem, polimento e embalagem.',                                                                          details: 'Embalamos em caixas personalizadas, prontas para expedição a granel ou unidade a unidade.',                                          img: '/assets/portfolio/fanta.avif' },
];

const STATS = [
  { n: '42',    u: 'anos',           d: 'de atividade desde 1983' },
  { n: '2 400', u: 'm²',             d: 'de fábrica em Massamá' },
  { n: '120 k+',u: 'peças',          d: 'produzidas em 2025' },
  { n: '38',    u: 'colaboradores',  d: 'na equipa Jocril' },
];

export default function SobrePage() {
  return (
    <main id="main">
      <section data-screen-label="01 Sobre hero" style={{ position: 'relative', minHeight: 540, background: 'linear-gradient(180deg, rgba(0,0,0,.1), rgba(0,0,0,.6)), url(/assets/portfolio/stoli.avif) center/cover', padding: '40px', display: 'flex', alignItems: 'flex-end', borderBottom: '1px dashed var(--color-base-800)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%' }}>
          <Badge size="sm">Sobre a Jocril · Desde 1983</Badge>
          <h1 className="heading-1" style={{ margin: '20px 0 20px', color: '#fff', maxWidth: '16ch' }}>
            Acrílico moldado com precisão industrial.
          </h1>
          <p className="text-body" style={{ maxWidth: '58ch', color: 'rgba(255,255,255,.82)' }}>
            Somos uma empresa familiar fundada em 1983 em Leiria. Transformamos acrílico e plásticos técnicos para marcas como Ricola, Heineken, Ray-Ban e Bioderma há mais de 40 anos.
          </p>
        </div>
      </section>

      <section style={{ padding: '48px 40px', borderBottom: '1px solid var(--color-base-900)', background: 'var(--color-dark-base-primary)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px dashed var(--color-base-800)', borderRadius: 6, overflow: 'hidden' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ padding: '32px 28px', borderRight: i < 3 ? '1px dashed var(--color-base-800)' : 'none', background: 'var(--color-dark-base-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 56, letterSpacing: '-.05em', color: 'var(--color-light-base-primary)', lineHeight: 1 }}>{s.n}</span>
                <span className="text-mono-xs" style={{ color: 'var(--color-accent-100)' }}>{s.u}</span>
              </div>
              <p style={{ margin: '12px 0 0', fontFamily: 'var(--font-geist-sans)', fontSize: 14, color: 'var(--color-base-400)' }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section data-screen-label="02 Processos" style={{ padding: '80px 40px', background: 'var(--color-dark-base-primary)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ marginBottom: 48, maxWidth: 640 }}>
            <Badge size="sm">Serviços</Badge>
            <h2 className="heading-2" style={{ margin: '16px 0 16px', color: 'var(--color-light-base-primary)' }}>Processos integrados.</h2>
            <p className="text-body" style={{ color: 'var(--color-base-300)' }}>Equipamento industrial próprio. Cada processo otimizado para materiais técnicos. Do protótipo à série de 10.000 unidades com a mesma precisão.</p>
          </div>

          {PROCESSES.map((p, i) => {
            const reversed = i % 2 === 1;
            return (
              <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start', padding: '48px 0', borderTop: '1px dashed var(--color-base-800)' }}>
                <div style={{ order: reversed ? 2 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <span className="text-mono-sm" style={{ color: 'var(--color-accent-100)' }}>{String(p.id).padStart(2, '0')}</span>
                    <Badge size="xs">{p.short}</Badge>
                  </div>
                  <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--font-geist-sans)', fontSize: 36, letterSpacing: '-.035em', color: 'var(--color-light-base-primary)' }}>{p.title}</h3>
                  <p className="text-body" style={{ color: 'var(--color-base-300)', marginBottom: 12 }}>{p.desc}</p>
                  <p className="text-body" style={{ color: 'var(--color-base-400)' }}>{p.details}</p>
                </div>
                <div style={{ order: reversed ? 1 : 2, aspectRatio: '4/3', background: `url(${p.img}) center/cover`, borderRadius: 6, border: '1px dashed var(--color-base-800)' }}/>
              </div>
            );
          })}
        </div>
      </section>

      <section data-screen-label="03 CTA" style={{ padding: '80px 40px', background: 'var(--color-dark-base-secondary)', borderTop: '1px dashed var(--color-base-800)', borderBottom: '1px dashed var(--color-base-800)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <Badge size="sm">Vamos trabalhar juntos</Badge>
          <h2 className="heading-2" style={{ margin: '16px 0 16px', color: 'var(--color-light-base-primary)' }}>Tem um projeto em mente?</h2>
          <p className="text-body" style={{ color: 'var(--color-base-300)', marginBottom: 28 }}>Peça um orçamento para peças à medida. Respondemos em 24h úteis com proposta técnica, prazo e preço.</p>
          <Button variant="solid">Pedir orçamento →</Button>
        </div>
      </section>
    </main>
  );
}
