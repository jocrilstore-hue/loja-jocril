import type { ReactNode } from 'react';
import Link from 'next/link';
import Badge from '@/components/store/Badge';
import Button from '@/components/store/Button';

const ORDER = {
  n: 'JOC-25-04821', d: '14 Abr 2026 · 10:42', status: 'shipped',
  totals: { subtotal: 170.00, shipping: 8.40, vat: 0, discount: -12.00, total: 186.40 },
  payment: 'MBWay · +351 ••• ••• 678',
  carrier: 'DPD Portugal · Expresso 24h', tracking: 'PTE-04821-ZN',
  items: [
    { sku: 'EXP-A3-06P', n: 'Expositor A3 · 6 prateleiras', v: 'Transparente · Acrílico 5mm', qty: 2, price: 42.50, img: '/assets/portfolio/carm-premium.avif' },
    { sku: 'DSP-PAR-A3', n: 'Display parede A3',             v: 'Branco · com iluminação',     qty: 1, price: 85.00, img: '/assets/portfolio/rayban.avif'       },
  ],
  shipTo: ['Maria Silva', 'Rua da Vinha 12, 3º', '1200-123 Lisboa', 'Portugal'],
  billTo: ['Ponto & Linha, Lda.', 'NIF 515 998 441', 'Av. da República 88', '1050-210 Lisboa'],
  timeline: [
    { k: 'ordered',   l: 'Encomenda recebida',    d: '14 Abr · 10:42',  done: true,  active: false },
    { k: 'paid',      l: 'Pagamento confirmado',  d: '14 Abr · 10:43',  done: true,  active: false },
    { k: 'prod',      l: 'Em preparação',          d: '14 Abr · 15:30',  done: true,  active: false },
    { k: 'shipped',   l: 'Expedida',              d: '15 Abr · 09:12',  done: true,  active: true  },
    { k: 'transit',   l: 'Em trânsito',            d: 'Previsto 17 Abr', done: false, active: false },
    { k: 'delivered', l: 'Entregue',              d: 'Previsto 17 Abr', done: false, active: false },
  ],
};

export default function OrderDetailPage() {
  return (
    <main id="main">
      <section data-screen-label="01 Order header" style={{ padding: '32px 40px 0', background: 'var(--color-dark-base-primary)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', marginBottom: 12 }}>
            <Link href="/conta" style={{ color: 'var(--color-base-400)', textDecoration: 'none' }}>A minha conta</Link>{' '}
            <span style={{ color: 'var(--color-base-700)' }}>/</span>{' '}
            <Link href="/conta?tab=orders" style={{ color: 'var(--color-base-400)', textDecoration: 'none' }}>Encomendas</Link>{' '}
            <span style={{ color: 'var(--color-base-700)' }}>/</span>{' '}
            <span style={{ color: 'var(--color-light-base-primary)' }}>{ORDER.n}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'end', marginBottom: 28 }}>
            <div>
              <Badge size="sm">Encomenda {ORDER.n}</Badge>
              <h1 className="heading-1" style={{ margin: '14px 0 8px', color: 'var(--color-light-base-primary)' }}>
                A sua encomenda está <span style={{ color: 'var(--color-accent-100)' }}>em trânsito</span>.
              </h1>
              <p className="text-body" style={{ color: 'var(--color-base-400)', margin: 0 }}>Expedida a 15 Abr · previsão de entrega <strong style={{ color: 'var(--color-light-base-primary)' }}>17 Abr</strong> · {ORDER.carrier}</p>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Button variant="outline">Descarregar fatura</Button>
              <Button variant="solid">Seguir encomenda ↗</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section data-screen-label="02 Timeline" style={{ padding: '0 40px 32px', background: 'var(--color-dark-base-primary)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ border: '1px dashed var(--color-base-700)', borderRadius: 6, padding: 28, background: 'var(--color-dark-base-secondary)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${ORDER.timeline.length}, 1fr)`, gap: 0, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 16, left: '8%', right: '8%', height: 2, borderTop: '1px dashed var(--color-base-700)' }}/>
              <div style={{ position: 'absolute', top: 16, left: '8%', width: '58%', height: 2, background: 'var(--color-accent-100)' }}/>
              {ORDER.timeline.map((t) => (
                <div key={t.k} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: 32, height: 32, margin: '0 auto',
                    border: `1px solid ${t.active ? 'var(--color-accent-100)' : t.done ? 'var(--color-accent-100)' : 'var(--color-base-700)'}`,
                    background: t.active ? 'var(--color-accent-100)' : 'var(--color-dark-base-secondary)',
                    color: t.active ? '#fff' : t.done ? 'var(--color-accent-100)' : 'var(--color-base-600)',
                    borderRadius: 20, fontFamily: 'var(--font-geist-mono)', fontSize: 12, lineHeight: '30px', position: 'relative',
                    boxShadow: t.active ? '0 0 0 4px rgba(240,71,66,.2)' : 'none',
                  }}>{t.done ? '✓' : '•'}</div>
                  <div style={{ marginTop: 10, fontFamily: 'var(--font-geist-sans)', fontSize: 13, color: t.done ? 'var(--color-light-base-primary)' : 'var(--color-base-500)', letterSpacing: '-.02em' }}>{t.l}</div>
                  <div className="text-mono-xs" style={{ color: 'var(--color-base-600)', marginTop: 3 }}>{t.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section style={{ padding: '16px 40px 80px', background: 'var(--color-dark-base-primary)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
          {/* items */}
          <div style={{ border: '1px dashed var(--color-base-800)', borderRadius: 6, background: 'var(--color-dark-base-secondary)' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px dashed var(--color-base-800)', display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-mono-sm" style={{ color: 'var(--color-base-300)', textTransform: 'uppercase' }}>Artigos · {ORDER.items.length}</span>
              <button style={{ color: 'var(--color-accent-100)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'var(--font-geist-mono)', fontSize: 12 }}>Repetir encomenda →</button>
            </div>
            {ORDER.items.map((it, i) => (
              <div key={it.sku} style={{ display: 'grid', gridTemplateColumns: '72px 1.3fr auto auto', gap: 16, padding: 18, alignItems: 'center', borderTop: i === 0 ? 'none' : '1px dashed var(--color-base-800)' }}>
                <div style={{ aspectRatio: '1/1', background: `url(${it.img}) center/cover`, borderRadius: 4, border: '1px solid var(--color-base-800)' }}/>
                <div>
                  <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 15, color: 'var(--color-light-base-primary)', letterSpacing: '-.02em' }}>{it.n}</div>
                  <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', marginTop: 3 }}>{it.v}</div>
                  <div className="text-mono-xs" style={{ color: 'var(--color-base-600)', marginTop: 3 }}>SKU {it.sku}</div>
                </div>
                <span className="text-mono-xs" style={{ color: 'var(--color-base-400)' }}>× {it.qty}</span>
                <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 16, color: 'var(--color-light-base-primary)' }}>€ {(it.price * it.qty).toFixed(2).replace('.', ',')}</span>
              </div>
            ))}

            <div style={{ padding: 22, borderTop: '1px dashed var(--color-base-800)', display: 'grid', gap: 8 }}>
              {[
                ['Subtotal',                 `€ ${ORDER.totals.subtotal.toFixed(2).replace('.', ',')}`],
                ['Escalão 10+ · desconto',   '−€ 12,00'],
                ['Envio (DPD 24h)',           '€ 8,40'],
                ['IVA incluído (23%)',        '—'],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>{l}</span>
                  <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 14, color: 'var(--color-base-300)' }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 12, borderTop: '1px dashed var(--color-base-800)', marginTop: 4 }}>
                <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 18, color: 'var(--color-light-base-primary)', letterSpacing: '-.02em' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 28, color: 'var(--color-light-base-primary)', letterSpacing: '-.035em' }}>€ 186,40</span>
              </div>
            </div>
          </div>

          {/* sidebar */}
          <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
            <Card title="Entrega">
              <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 14, color: 'var(--color-light-base-primary)', lineHeight: 1.6 }}>
                {ORDER.shipTo.map((l) => <div key={l}>{l}</div>)}
              </div>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--color-base-800)', display: 'grid', gap: 4 }}>
                <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>Nº seguimento</span>
                <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 14, color: 'var(--color-accent-100)' }}>{ORDER.tracking}</span>
                <span className="text-mono-xs" style={{ color: 'var(--color-base-500)', marginTop: 6 }}>{ORDER.carrier}</span>
              </div>
            </Card>

            <Card title="Faturação">
              <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 14, color: 'var(--color-light-base-primary)', lineHeight: 1.6 }}>
                {ORDER.billTo.map((l) => <div key={l}>{l}</div>)}
              </div>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--color-base-800)', display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>Pagamento</span>
                <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'var(--color-light-base-primary)' }}>{ORDER.payment}</span>
              </div>
            </Card>

            <Card title="Precisa de ajuda?">
              <div style={{ display: 'grid', gap: 8 }}>
                <Button variant="outline">Contactar apoio</Button>
                <Button variant="outline">Devolver / trocar</Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ border: '1px dashed var(--color-base-800)', borderRadius: 6, background: 'var(--color-dark-base-secondary)' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px dashed var(--color-base-800)' }}>
        <span className="text-mono-sm" style={{ color: 'var(--color-base-300)', textTransform: 'uppercase' }}>{title}</span>
      </div>
      <div style={{ padding: 18 }}>{children}</div>
    </div>
  );
}
