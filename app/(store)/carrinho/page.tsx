'use client';

import { useState } from 'react';
import Link from 'next/link';
import Badge from '@/components/store/Badge';
import Button from '@/components/store/Button';
import { useCart } from '@/contexts/cart-context';
import type { CartItem } from '@/lib/types';

export default function CarrinhoPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [step, setStep]       = useState(1);
  const [payment, setPayment] = useState('mbway');
  const [shipping, setShipping] = useState('ctt-expresso');
  const [nif, setNif]         = useState('');
  const [promo, setPromo]     = useState('');

  const items        = cart.items;
  const subtotal     = cart.totalPrice;
  const shippingCost = items.length === 0 ? 0 : shipping === 'ctt-expresso' ? 4.90 : shipping === 'pickup' ? 0 : 7.90;
  const total        = subtotal + shippingCost;
  const iva          = total > 0 ? total - total / 1.23 : 0;
  const isEmpty      = items.length === 0;

  return (
    <main id="main" style={{ background: 'var(--color-dark-base-primary)', padding: '40px 40px 80px' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        {/* stepper */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px dashed var(--color-base-800)', marginBottom: 40 }}>
          {[
            { n: 1, label: 'Carrinho' },
            { n: 2, label: 'Envio & Pagamento' },
            { n: 3, label: 'Confirmação' },
          ].map((s) => {
            const active = step === s.n;
            const done   = step > s.n;
            return (
              <button key={s.n} onClick={() => s.n < step && setStep(s.n)} style={{
                background: 'transparent', border: 'none', cursor: s.n <= step ? 'pointer' : 'default',
                padding: '16px 24px 20px', display: 'flex', alignItems: 'center', gap: 14,
                borderBottom: `2px solid ${active ? 'var(--color-accent-100)' : 'transparent'}`,
                marginBottom: -1, flex: 1, justifyContent: 'flex-start',
              }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 999, display: 'grid', placeItems: 'center',
                  background: active ? 'var(--color-accent-100)' : done ? 'var(--color-light-base-secondary)' : 'transparent',
                  color: active || done ? 'var(--color-dark-base-primary)' : 'var(--color-base-500)',
                  border: `1px solid ${active ? 'var(--color-accent-100)' : done ? 'transparent' : 'var(--color-base-700)'}`,
                  fontFamily: 'var(--font-geist-mono)', fontSize: 12, letterSpacing: '-.015rem',
                }}>{done ? '✓' : `0${s.n}`}</span>
                <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12, letterSpacing: '-.015rem', textTransform: 'uppercase', color: active ? 'var(--color-light-base-primary)' : done ? 'var(--color-base-300)' : 'var(--color-base-500)' }}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>

        {step < 3 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 32 }}>
            <div>
              {step === 1 && (
                isEmpty
                  ? <EmptyCart />
                  : <CartItems
                      items={items}
                      update={updateQuantity}
                      remove={removeFromCart}
                      clear={clearCart}
                    />
              )}
              {step === 2 && (
                <>
                  <AddressBlock nif={nif} setNif={setNif} />
                  <ShippingOptions shipping={shipping} setShipping={setShipping} />
                  <PaymentOptions payment={payment} setPayment={setPayment} />
                </>
              )}
            </div>
            <aside>
              <OrderSummary
                items={items} subtotal={subtotal}
                shippingCost={shippingCost} total={total} iva={iva}
                promo={promo} setPromo={setPromo}
                step={step} setStep={setStep}
                isEmpty={isEmpty}
              />
            </aside>
          </div>
        ) : (
          <SuccessPanel items={items} total={total} />
        )}
      </div>
    </main>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function EmptyCart() {
  return (
    <div style={{ padding: '80px 40px', border: '1px dashed var(--color-base-700)', borderRadius: 6, background: 'var(--color-dark-base-secondary)', textAlign: 'center' }}>
      <Badge size="sm">Carrinho vazio</Badge>
      <h2 className="heading-2" style={{ margin: '18px 0 12px', color: 'var(--color-light-base-primary)' }}>Ainda não adicionou produtos.</h2>
      <p className="text-body" style={{ margin: '0 auto 28px', maxWidth: '44ch' }}>
        Explore a loja e adicione os primeiros expositores, caixas ou sinalética ao seu carrinho.
      </p>
      <Button href="/produtos" variant="solid">Ver produtos</Button>
    </div>
  );
}

function CartItems({ items, update, remove, clear }: {
  items: CartItem[];
  update: (variantId: number, quantity: number) => void;
  remove: (variantId: number) => void;
  clear: () => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
        <Badge size="sm">Carrinho · {items.length} produto{items.length !== 1 ? 's' : ''}</Badge>
        <button onClick={clear} className="text-mono-xs" style={{ color: 'var(--color-base-500)', cursor: 'pointer', background: 'none', border: 'none' }}>Esvaziar carrinho</button>
      </div>
      <div style={{ border: '1px dashed var(--color-base-700)', borderRadius: 6, overflow: 'hidden', background: 'var(--color-dark-base-secondary)' }}>
        {items.map((i, idx) => (
          <div key={i.variantId} style={{
            display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 20,
            padding: 20, borderTop: idx === 0 ? 'none' : '1px dashed var(--color-base-800)',
            alignItems: 'center',
          }}>
            <div style={{ aspectRatio: '1/1', background: `url(${i.imageUrl ?? '/assets/placeholder.svg'}) center/cover`, borderRadius: 4, border: '1px dashed var(--color-base-700)' }}/>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>{i.sku}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 20, letterSpacing: '-.03em', color: 'var(--color-light-base-primary)', marginTop: 4 }}>{i.productName}</div>
              <div className="text-body" style={{ marginTop: 4, color: 'var(--color-base-300)' }}>{i.sizeName}</div>
              <div className="text-mono-xs" style={{ color: 'var(--color-accent-100)', marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--color-accent-300)' }}/>Em stock · envio 48h
              </div>
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
                <QtyStepper qty={i.quantity} setQty={(q) => update(i.variantId, q)} />
                <button onClick={() => remove(i.variantId)} className="text-mono-xs" style={{ color: 'var(--color-base-500)', cursor: 'pointer', background: 'none', border: 'none' }}>Remover</button>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>Unitário</div>
              <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 16, letterSpacing: '-.03em', color: 'var(--color-base-300)', marginTop: 2 }}>€ {i.unitPrice.toFixed(2).replace('.', ',')}</div>
              <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', marginTop: 14 }}>Total</div>
              <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 26, letterSpacing: '-.04em', color: 'var(--color-light-base-primary)', marginTop: 2 }}>
                € {i.totalPrice.toFixed(2).replace('.', ',')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* cross-sell */}
      <div style={{ marginTop: 28, padding: 20, border: '1px dashed var(--color-base-800)', borderRadius: 6, background: 'transparent' }}>
        <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', marginBottom: 12 }}>Adicionar frequentemente comprado junto</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { n: 'Placas identificadoras A7',          p: 3.20, img: '/assets/portfolio/ricola.avif' },
            { n: 'Kit de limpeza para acrílico',        p: 8.50, img: '/assets/portfolio/glade.avif'  },
            { n: 'Etiquetas de preço transparentes',    p: 4.10, img: '/assets/portfolio/loreal.avif'  },
          ].map((x) => (
            <Link key={x.n} href="/produtos" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: 'transparent', border: '1px solid var(--color-base-900)', borderRadius: 4, cursor: 'pointer', textAlign: 'left', textDecoration: 'none' }}>
              <div style={{ width: 44, height: 44, background: `url(${x.img}) center/cover`, borderRadius: 2, flexShrink: 0 }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 13, color: 'var(--color-light-base-primary)', letterSpacing: '-.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.n}</div>
                <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', marginTop: 2 }}>€ {x.p.toFixed(2).replace('.', ',')}</div>
              </div>
              <span style={{ color: 'var(--color-accent-100)', fontSize: 18 }}>+</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function QtyStepper({ qty, setQty }: { qty: number; setQty: (q: number) => void }) {
  return (
    <div style={{ display: 'inline-flex', border: '1px solid var(--color-base-700)', borderRadius: 2, alignItems: 'center' }}>
      <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Diminuir quantidade" style={{ width: 30, height: 32, background: 'transparent', color: 'var(--color-light-base-primary)', border: 'none', cursor: 'pointer', fontSize: 16 }}>−</button>
      <input value={qty} aria-label="Quantidade" onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} style={{ width: 42, height: 32, textAlign: 'center', background: 'transparent', border: 'none', outline: 'none', color: 'var(--color-light-base-primary)', fontFamily: 'var(--font-geist-sans)', fontSize: 15, letterSpacing: '-.02em' }}/>
      <button onClick={() => setQty(qty + 1)} aria-label="Aumentar quantidade" style={{ width: 30, height: 32, background: 'transparent', color: 'var(--color-light-base-primary)', border: 'none', cursor: 'pointer', fontSize: 16 }}>+</button>
    </div>
  );
}

function Field({ label, placeholder, value, onChange, span = 6, required, hint }: {
  label: string; placeholder?: string; value?: string; onChange?: (v: string) => void;
  span?: number; required?: boolean; hint?: string;
}) {
  return (
    <label style={{ gridColumn: `span ${span}` }}>
      <span className="text-mono-xs" style={{ color: 'var(--color-base-500)', display: 'block', marginBottom: 6 }}>
        {label} {required && <span style={{ color: 'var(--color-accent-100)' }}>*</span>}
      </span>
      <input value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} style={{
        width: '100%', height: 40, padding: '0 12px',
        background: 'var(--color-dark-base-primary)',
        border: '1px dashed var(--color-base-700)', borderRadius: 2, outline: 'none',
        color: 'var(--color-light-base-primary)', fontFamily: 'var(--font-geist-sans)', fontSize: 14,
      }}/>
      {hint && <div className="text-mono-xs" style={{ color: 'var(--color-base-600)', marginTop: 6 }}>{hint}</div>}
    </label>
  );
}

function AddressBlock({ nif, setNif }: { nif: string; setNif: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <Badge size="sm">01 · Dados e morada de envio</Badge>
      <div style={{ marginTop: 16, padding: 24, border: '1px dashed var(--color-base-700)', borderRadius: 6, background: 'var(--color-dark-base-secondary)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 14 }}>
          <Field label="Nome"          placeholder="Nome completo"          required />
          <Field label="Email"         placeholder="voce@empresa.pt"        required />
          <Field label="Telefone"      placeholder="+351 "                  span={6} required />
          <Field label="NIF"           placeholder="Contribuinte (opcional)" value={nif} onChange={setNif} span={6} hint="Introduza para receber factura com IVA" />
          <Field label="Morada"        placeholder="Rua e número"            span={12} required />
          <Field label="Código postal" placeholder="0000-000"               span={4} required />
          <Field label="Localidade"    placeholder=""                        span={4} required />
          <Field label="País"          placeholder="Portugal"                span={4} required />
        </div>
        <label style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="checkbox" style={{ accentColor: 'var(--color-accent-100)' }}/>
          <span className="text-mono-xs" style={{ color: 'var(--color-base-300)' }}>Morada de facturação é diferente da de envio</span>
        </label>
      </div>
    </div>
  );
}

function ShippingOptions({ shipping, setShipping }: { shipping: string; setShipping: (v: string) => void }) {
  const opts = [
    { k: 'ctt-expresso', n: 'CTT Expresso',           p: 4.90, t: '1–2 dias úteis', desc: 'Entrega ao domicílio · Portugal continental' },
    { k: 'ctt-dist',     n: 'CTT Distribuição',        p: 7.90, t: '2–3 dias úteis', desc: 'Madeira e Açores · tarifa especial' },
    { k: 'pickup',       n: 'Levantamento na fábrica', p: 0.00, t: 'Pronto em 24h',  desc: 'Vialonga, Loures · por marcação' },
  ];
  return (
    <div style={{ marginBottom: 20 }}>
      <Badge size="sm">02 · Método de envio</Badge>
      <div style={{ marginTop: 16, display: 'grid', gap: 8 }}>
        {opts.map((o) => {
          const on = shipping === o.k;
          return (
            <label key={o.k} onClick={() => setShipping(o.k)} style={{
              padding: 20, cursor: 'pointer',
              border: `1px dashed ${on ? 'var(--color-accent-100)' : 'var(--color-base-700)'}`,
              background: on ? 'rgba(45,212,205,.05)' : 'var(--color-dark-base-secondary)',
              borderRadius: 6,
              display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 18, alignItems: 'center',
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: 999,
                border: `1px solid ${on ? 'var(--color-accent-100)' : 'var(--color-base-600)'}`,
                display: 'grid', placeItems: 'center',
              }}>{on && <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--color-accent-100)' }}/>}</span>
              <div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 15, color: 'var(--color-light-base-primary)', letterSpacing: '-.02em' }}>{o.n}</span>
                  <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>{o.t}</span>
                </div>
                <div className="text-body" style={{ marginTop: 3 }}>{o.desc}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 20, letterSpacing: '-.03em', color: on ? 'var(--color-accent-100)' : 'var(--color-light-base-primary)' }}>
                {o.p === 0 ? 'Grátis' : `€ ${o.p.toFixed(2).replace('.', ',')}`}
              </div>
              <input type="radio" name="shipping" value={o.k} checked={on} onChange={() => setShipping(o.k)} style={{ display: 'none' }}/>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function PaymentOptions({ payment, setPayment }: { payment: string; setPayment: (v: string) => void }) {
  const opts = [
    { k: 'mbway',      n: 'MBWay',                   t: 'Aprovação imediata no telemóvel',       icon: '📱' },
    { k: 'multibanco', n: 'Multibanco (Referência)',   t: 'Pague numa caixa ATM ou homebanking',   icon: '🏦' },
    { k: 'card',       n: 'Cartão de crédito/débito', t: 'Visa · Mastercard · American Express',  icon: '💳' },
    { k: 'wire',       n: 'Transferência bancária',   t: 'Para empresas · IBAN por email',         icon: '✉' },
  ];
  return (
    <div>
      <Badge size="sm">03 · Pagamento</Badge>
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {opts.map((o) => {
          const on = payment === o.k;
          return (
            <label key={o.k} onClick={() => setPayment(o.k)} style={{
              padding: 18, cursor: 'pointer',
              border: `1px dashed ${on ? 'var(--color-accent-100)' : 'var(--color-base-700)'}`,
              background: on ? 'rgba(45,212,205,.05)' : 'var(--color-dark-base-secondary)',
              borderRadius: 6,
              display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 14, alignItems: 'center',
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: 999,
                border: `1px solid ${on ? 'var(--color-accent-100)' : 'var(--color-base-600)'}`,
                display: 'grid', placeItems: 'center',
              }}>{on && <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--color-accent-100)' }}/>}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 15, color: 'var(--color-light-base-primary)', letterSpacing: '-.02em' }}>{o.n}</div>
                <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', marginTop: 3 }}>{o.t}</div>
              </div>
              <span style={{ fontSize: 18 }}>{o.icon}</span>
            </label>
          );
        })}
      </div>
      {payment === 'mbway' && (
        <div style={{ marginTop: 12, padding: 16, border: '1px dashed var(--color-accent-100)', borderRadius: 6, background: 'rgba(45,212,205,.05)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'end' }}>
            <Field label="Telemóvel MBWay" placeholder="+351 " span={12} required />
            <Button variant="solid">Enviar pedido →</Button>
          </div>
        </div>
      )}
    </div>
  );
}

const BIG_BTN: React.CSSProperties = {
  height: 48, padding: '0 20px', background: 'var(--color-light-base-secondary)',
  color: 'var(--color-dark-base-primary)', border: 'none', borderRadius: 2, cursor: 'pointer',
  fontFamily: 'var(--font-geist-mono)', fontSize: 13, letterSpacing: '-.015rem', textTransform: 'uppercase',
};

function OrderSummary({ items, subtotal, shippingCost, total, iva, promo, setPromo, step, setStep, isEmpty }: {
  items: CartItem[]; subtotal: number; shippingCost: number;
  total: number; iva: number; promo: string; setPromo: (v: string) => void;
  step: number; setStep: (n: number) => void; isEmpty: boolean;
}) {
  return (
    <div style={{ position: 'sticky', top: 160, border: '1px dashed var(--color-base-600)', borderRadius: 6, background: 'var(--color-dark-base-secondary)', padding: 24 }}>
      <Badge size="sm">Resumo da encomenda</Badge>

      <div style={{ marginTop: 20, display: 'grid', gap: 10 }}>
        {items.map((i) => (
          <div key={i.variantId} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 10, alignItems: 'center' }}>
            <span style={{ width: 34, height: 34, display: 'block', background: `url(${i.imageUrl ?? '/assets/placeholder.svg'}) center/cover`, borderRadius: 2, border: '1px dashed var(--color-base-700)' }}/>
            <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 13, color: 'var(--color-light-base-primary)', letterSpacing: '-.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {i.productName} <span className="text-mono-xs" style={{ color: 'var(--color-base-600)' }}>× {i.quantity}</span>
            </span>
            <span className="text-mono-xs" style={{ color: 'var(--color-base-300)' }}>€ {i.totalPrice.toFixed(2).replace('.', ',')}</span>
          </div>
        ))}
        {isEmpty && (
          <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>Sem artigos no carrinho.</span>
        )}
      </div>

      <div style={{ marginTop: 20, display: 'flex', gap: 6 }}>
        <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Código promocional" style={{
          flex: 1, height: 36, padding: '0 12px',
          background: 'var(--color-dark-base-primary)', border: '1px dashed var(--color-base-700)', borderRadius: 2,
          outline: 'none', color: 'var(--color-light-base-primary)',
          fontFamily: 'var(--font-geist-mono)', fontSize: 11, letterSpacing: '-.015rem', textTransform: 'uppercase',
        }}/>
        <button style={{ height: 36, padding: '0 14px', background: 'transparent', border: '1px solid var(--color-base-700)', borderRadius: 2, cursor: 'pointer', color: 'var(--color-light-base-primary)', fontFamily: 'var(--font-geist-mono)', fontSize: 11, letterSpacing: '-.015rem', textTransform: 'uppercase' }}>Aplicar</button>
      </div>

      <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px dashed var(--color-base-800)', display: 'grid', gap: 10 }}>
        <SummaryLine label="Subtotal"              value={`€ ${subtotal.toFixed(2).replace('.', ',')}`} />
        <SummaryLine label="Envio"                 value={shippingCost === 0 ? (isEmpty ? '—' : 'Grátis') : `€ ${shippingCost.toFixed(2).replace('.', ',')}`} />
        <SummaryLine label="IVA 23% (incluído)"    value={`€ ${iva.toFixed(2).replace('.', ',')}`} muted />
      </div>

      <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--color-base-700)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span className="text-mono-sm" style={{ color: 'var(--color-light-base-primary)' }}>Total</span>
        <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 36, letterSpacing: '-.04em', color: 'var(--color-light-base-primary)' }}>€ {total.toFixed(2).replace('.', ',')}</span>
      </div>

      <div style={{ marginTop: 18, display: 'grid', gap: 8 }}>
        {step === 1 && (
          <button onClick={() => !isEmpty && setStep(2)} disabled={isEmpty} style={{ ...BIG_BTN, opacity: isEmpty ? 0.4 : 1, cursor: isEmpty ? 'not-allowed' : 'pointer' }}>
            Continuar para envio →
          </button>
        )}
        {step === 2 && <button onClick={() => setStep(3)} style={BIG_BTN}>Finalizar encomenda →</button>}
        <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', textAlign: 'center', marginTop: 6 }}>
          Pagamento seguro · SSL · Jocril Lda.
        </div>
      </div>
    </div>
  );
}

function SummaryLine({ label, value, muted, accent }: { label: string; value: string; muted?: boolean; accent?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span className="text-mono-xs" style={{ color: muted ? 'var(--color-base-600)' : 'var(--color-base-400)' }}>{label}</span>
      <span className="text-mono-sm" style={{ color: accent ? 'var(--color-accent-100)' : muted ? 'var(--color-base-500)' : 'var(--color-light-base-primary)' }}>{value}</span>
    </div>
  );
}

function SuccessPanel({ items, total }: { items: CartItem[]; total: number }) {
  return (
    <div data-screen-label="03 Checkout sucesso" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', padding: '40px 0 80px' }}>
      <div>
        <Badge size="sm">Encomenda confirmada</Badge>
        <h1 className="heading-1" style={{ margin: '20px 0 18px', color: 'var(--color-light-base-primary)' }}>
          Obrigado,<br/><span style={{ color: 'var(--color-accent-100)' }}>João.</span>
        </h1>
        <p className="text-mono-md" style={{ color: 'var(--color-base-300)', maxWidth: '42ch', margin: 0 }}>
          A sua encomenda <span style={{ color: 'var(--color-light-base-primary)' }}>#JCR-2026-04823</span> foi recebida. Enviámos a confirmação para <span style={{ color: 'var(--color-light-base-primary)' }}>joao@empresa.pt</span>.
        </p>
        <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <SuccessStat label="Total"          value={`€ ${total.toFixed(2).replace('.', ',')}`} />
          <SuccessStat label="Artigos"        value={`${items.length}`} />
          <SuccessStat label="Envio previsto" value="20 · 04 · 2026" />
        </div>
        <div style={{ marginTop: 32, display: 'flex', gap: 10 }}>
          <Button variant="solid">Ver detalhes da encomenda</Button>
          <Button variant="outline">Continuar a comprar</Button>
        </div>
      </div>
      <div style={{ padding: 32, border: '1px dashed var(--color-base-700)', borderRadius: 6, background: 'var(--color-dark-base-secondary)' }}>
        <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', marginBottom: 16 }}>Próximos passos</div>
        {[
          { n: '01', t: 'Confirmação de pagamento', desc: 'Recebemos o seu pagamento MBWay instantaneamente.' },
          { n: '02', t: 'Preparação e embalagem',   desc: 'A sua encomenda entra em produção amanhã às 08:00.' },
          { n: '03', t: 'Expedição CTT Expresso',   desc: 'Envio em 48h · tracking enviado por SMS e email.' },
          { n: '04', t: 'Entrega',                  desc: 'Entrega ao domicílio · 20–22 Abril 2026.' },
        ].map((s, i) => (
          <div key={s.n} style={{ padding: '16px 0', borderTop: i === 0 ? 'none' : '1px solid var(--color-base-900)', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16 }}>
            <span className="text-mono-sm" style={{ color: i === 0 ? 'var(--color-accent-100)' : 'var(--color-base-500)' }}>
              <span style={{ color: 'var(--color-base-700)' }}>0</span>{s.n.slice(1)}
            </span>
            <div>
              <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 15, color: 'var(--color-light-base-primary)', letterSpacing: '-.02em' }}>{s.t}</div>
              <div className="text-body" style={{ marginTop: 3 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuccessStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 22, letterSpacing: '-.03em', color: 'var(--color-light-base-primary)', marginTop: 4 }}>{value}</div>
    </div>
  );
}
