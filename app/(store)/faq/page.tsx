'use client';

import { useState } from 'react';
import Badge from '@/components/store/Badge';
import Button from '@/components/store/Button';

const SECTIONS = [
  { id: 'envios', title: 'Envios e entregas', items: [
    { q: 'Quais são os prazos de entrega?',    a: 'Produtos em stock são expedidos em 48h úteis. Peças à medida e séries especiais têm prazo definido em orçamento, tipicamente 7–15 dias úteis.' },
    { q: 'Que transportadoras usam?',           a: 'Trabalhamos com DPD, CTT Expresso e Seur para Portugal continental. Para ilhas e Europa usamos DHL.' },
    { q: 'Posso fazer levantamento na fábrica?',a: 'Sim. Oferecemos levantamento gratuito em Leiria de segunda a sexta-feira, 09h00–18h00. Selecione a opção "Levantar na fábrica" no checkout.' },
    { q: 'Fazem entregas internacionais?',      a: 'Sim, enviamos para toda a Europa. Outros destinos por orçamento. Os custos de alfândega são da responsabilidade do comprador.' },
  ]},
  { id: 'devolucoes', title: 'Devoluções e trocas', items: [
    { q: 'Qual é o prazo de devolução?',           a: '14 dias após a receção, para produtos standard, em embalagem original e sem sinais de utilização. Peças à medida não são elegíveis para devolução.' },
    { q: 'Quem paga o transporte de devolução?',   a: 'O cliente, exceto nos casos de defeito de produção ou erro de envio, em que a Jocril assume a totalidade dos custos.' },
    { q: 'Como receberei o reembolso?',             a: 'No método de pagamento original, em até 14 dias após receção e inspeção do produto devolvido.' },
  ]},
  { id: 'pagamentos', title: 'Pagamentos', items: [
    { q: 'Que métodos de pagamento aceitam?', a: 'MBWay, Multibanco (referência), cartão Visa / Mastercard, PayPal e transferência bancária. Para empresas com conta corrente, faturação a 30 dias mediante aprovação.' },
    { q: 'Os preços incluem IVA?',             a: 'Todos os preços apresentados na loja incluem IVA à taxa legal em vigor (23%). Para clientes B2B com NIF válido da UE, o IVA é isento nos termos aplicáveis.' },
    { q: 'Recebo fatura?',                     a: 'Sim. Enviamos fatura por email após a expedição, em nome ou NIF indicado no checkout.' },
  ]},
  { id: 'produtos', title: 'Produtos e materiais', items: [
    { q: 'Que acrílicos utilizam?',           a: 'Trabalhamos com acrílico extrudido e fundido de 2 a 25 mm, em mais de 40 cores Altuglas. Também fabricamos em PETG, policarbonato e PVC expandido.' },
    { q: 'Podem produzir à medida?',          a: 'Sim. Envie esboço, dimensões e quantidade para orcamentos@jocril.pt. Respondemos em 24h úteis com proposta técnica e prazo.' },
    { q: 'Oferecem impressão personalizada?', a: 'Sim. Temos impressão UV direta até 3,2 m de largura, em CMYK + branco + verniz. Para quantidades pequenas usamos serigrafia.' },
  ]},
  { id: 'conta', title: 'Conta e encomendas', items: [
    { q: 'Preciso de criar conta para comprar?', a: 'Não, pode comprar como convidado. Uma conta permite acompanhar encomendas, repetir pedidos e guardar moradas.' },
    { q: 'Como acompanho a minha encomenda?',    a: 'Receberá emails em cada etapa. Também pode consultar o estado em "A minha conta" após iniciar sessão.' },
  ]},
];

export default function FAQPage() {
  const [open, setOpen] = useState<string | null>('envios-0');
  const [active, setActive] = useState('envios');

  const current = SECTIONS.find((s) => s.id === active)!;

  return (
    <main id="main">
      <section data-screen-label="01 FAQ hero" style={{ padding: '56px 40px 40px', borderBottom: '1px dashed var(--color-base-800)', background: 'var(--color-dark-base-primary)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40, alignItems: 'end' }}>
          <div>
            <Badge size="sm">FAQ · Ajuda</Badge>
            <h1 className="heading-1" style={{ margin: '16px 0 0', color: 'var(--color-light-base-primary)' }}>Perguntas frequentes.</h1>
          </div>
          <p className="text-body" style={{ color: 'var(--color-base-300)', maxWidth: '48ch' }}>
            Respostas às dúvidas mais comuns. Se não encontrar o que procura,{' '}
            <button style={{ color: 'var(--color-accent-100)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', fontSize: 'inherit', padding: 0 }}>fale connosco</button>.
          </p>
        </div>
      </section>

      <section data-screen-label="02 FAQ body" style={{ padding: '40px 40px 80px', background: 'var(--color-dark-base-primary)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 56 }}>
          <aside style={{ position: 'sticky', top: 96, alignSelf: 'start' }}>
            <Badge size="xs">Tópicos</Badge>
            <div style={{ marginTop: 16, display: 'grid', gap: 2 }}>
              {SECTIONS.map((s, i) => {
                const on = s.id === active;
                return (
                  <button key={s.id} onClick={() => { setActive(s.id); setOpen(`${s.id}-0`); }} style={{
                    textAlign: 'left', padding: '12px 14px', background: 'transparent',
                    border: 'none', borderLeft: `2px solid ${on ? 'var(--color-accent-100)' : 'transparent'}`,
                    color: on ? 'var(--color-light-base-primary)' : 'var(--color-base-500)',
                    fontFamily: 'var(--font-geist-sans)', fontSize: 14, letterSpacing: '-.02em', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span>{String(i + 1).padStart(2, '0')} · {s.title}</span>
                    <span className="text-mono-xs" style={{ color: 'var(--color-base-700)' }}>{s.items.length}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: 32, padding: 16, border: '1px dashed var(--color-base-800)', borderRadius: 4 }}>
              <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', marginBottom: 8 }}>Não encontrou?</div>
              <Button variant="outline">Contactar-nos</Button>
            </div>
          </aside>

          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
              <span className="text-mono-sm" style={{ color: 'var(--color-accent-100)' }}>{String(SECTIONS.findIndex((s) => s.id === active) + 1).padStart(2, '0')}</span>
              <h2 className="heading-2" style={{ margin: 0, color: 'var(--color-light-base-primary)' }}>{current.title}</h2>
            </div>

            <div style={{ border: '1px dashed var(--color-base-800)', borderRadius: 6, background: 'var(--color-dark-base-secondary)' }}>
              {current.items.map((it, i) => {
                const id = `${current.id}-${i}`;
                const isOpen = open === id;
                return (
                  <div key={id} style={{ borderBottom: i < current.items.length - 1 ? '1px dashed var(--color-base-800)' : 'none' }}>
                    <button onClick={() => setOpen(isOpen ? null : id)} style={{
                      width: '100%', textAlign: 'left', background: 'transparent', border: 'none',
                      padding: '20px 24px', display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'center', cursor: 'pointer',
                    }}>
                      <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 17, letterSpacing: '-.02em', color: 'var(--color-light-base-primary)' }}>
                        <span style={{ color: 'var(--color-base-600)', marginRight: 12 }}>{String(i + 1).padStart(2, '0')}</span>{it.q}
                      </span>
                      <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 18, color: isOpen ? 'var(--color-accent-100)' : 'var(--color-base-500)' }}>{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 24px 20px 58px' }}>
                        <p className="text-body" style={{ margin: 0, color: 'var(--color-base-300)' }}>{it.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
