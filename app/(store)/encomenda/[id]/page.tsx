import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import Badge from '@/components/store/Badge';

type OrderItem = {
  product_name: string | null;
  product_sku: string | null;
  size_format: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type ShippingAddress = {
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
};

type Customer = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  tax_id: string | null;
  auth_user_id: string | null;
};

type Order = {
  order_number: string;
  status: string;
  payment_status: string;
  paid_at: string | null;
  subtotal: number;
  shipping_cost: number;
  total_amount_with_vat: number;
  created_at: string;
  notes: string | null;
  eupago_entity: string | null;
  eupago_reference: string | null;
  payment_deadline: string | null;
  items: OrderItem[];
  shipping_address: ShippingAddress | ShippingAddress[] | null;
  customer: Customer | Customer[] | null;
};

const STATUS_COLORS: Record<string, string> = {
  pending:    'var(--color-accent-100)',
  confirmed:  'var(--color-accent-100)',
  processing: 'var(--color-accent-100)',
  shipped:    'var(--color-secondary)',
  delivered:  'var(--color-secondary)',
  cancelled:  'var(--color-base-500)',
  returned:   'var(--color-base-500)',
};

const PAYMENT_COLORS: Record<string, string> = {
  pending: 'var(--color-base-400)',
  paid:    'var(--color-secondary)',
  failed:  'var(--color-destructive)',
  refunded:'var(--color-base-500)',
};

function statusLabel(s: string) {
  const map: Record<string, string> = {
    pending:    'Pendente',
    confirmed:  'Confirmada',
    processing: 'Em preparação',
    shipped:    'Em trânsito',
    delivered:  'Entregue',
    cancelled:  'Cancelada',
    returned:   'Devolvida',
  };
  return map[s] ?? s;
}

function paymentLabel(s: string) {
  const map: Record<string, string> = {
    pending: 'Por pagar',
    paid:    'Pago',
    failed:  'Falhou',
    refunded:'Reembolsado',
  };
  return map[s] ?? s;
}

function formatReference(ref: string) {
  return ref.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
}

export default async function EncomendaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect(`/entrar?redirect_url=${encodeURIComponent(`/encomenda/${id}`)}`);
  }

  const supabase = await createClient();

  const { data: order } = await supabase
    .from('orders')
    .select(`
      order_number, status, payment_status, paid_at,
      subtotal, shipping_cost, total_amount_with_vat, created_at, notes,
      eupago_entity, eupago_reference, payment_deadline,
      items:order_items(product_name, product_sku, size_format, quantity, unit_price, total_price),
      shipping_address:shipping_addresses(address_line_1, address_line_2, city, postal_code, country),
      customer:customers(first_name, last_name, email, phone, company_name, tax_id, auth_user_id)
    `)
    .eq('order_number', id)
    .single() as { data: Order | null };

  if (!order) {
    return (
      <main id="main" style={{ background: 'var(--color-dark-base-primary)', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', textAlign: 'center' }}>
          <Badge size="sm">Não encontrada</Badge>
          <h1 className="heading-1" style={{ margin: '20px 0 16px', color: 'var(--color-light-base-primary)' }}>Encomenda não encontrada.</h1>
          <Link href="/encomendas" style={{ color: 'var(--color-accent-100)', fontFamily: 'var(--font-geist-mono)', fontSize: 13, textDecoration: 'none' }}>← Ver todas as encomendas</Link>
        </div>
      </main>
    );
  }

  const shipping = Array.isArray(order.shipping_address)
    ? order.shipping_address[0]
    : order.shipping_address;
  const customer = Array.isArray(order.customer)
    ? order.customer[0]
    : order.customer;
  const customerName = customer
    ? [customer.first_name, customer.last_name].filter(Boolean).join(' ') || customer.email
    : null;

  if (!customer?.auth_user_id || customer.auth_user_id !== userId) {
    return (
      <main id="main" style={{ background: 'var(--color-dark-base-primary)', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', textAlign: 'center' }}>
          <Badge size="sm">Não encontrada</Badge>
          <h1 className="heading-1" style={{ margin: '20px 0 16px', color: 'var(--color-light-base-primary)' }}>Encomenda não encontrada.</h1>
          <Link href="/encomendas" style={{ color: 'var(--color-accent-100)', fontFamily: 'var(--font-geist-mono)', fontSize: 13, textDecoration: 'none' }}>← Ver todas as encomendas</Link>
        </div>
      </main>
    );
  }

  const dateStr = new Date(order.created_at).toLocaleDateString('pt-PT', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  const showMultibanco =
    order.payment_status === 'pending' &&
    order.eupago_reference !== null &&
    order.eupago_entity !== null;

  return (
    <main id="main" style={{ background: 'var(--color-dark-base-primary)', padding: '40px 40px 80px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: 20 }}>
          <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>
            <Link href="/conta" style={{ color: 'var(--color-base-400)', textDecoration: 'none' }}>A minha conta</Link>
            {' '}<span style={{ color: 'var(--color-base-700)' }}>/</span>{' '}
            <Link href="/encomendas" style={{ color: 'var(--color-base-400)', textDecoration: 'none' }}>Encomendas</Link>
            {' '}<span style={{ color: 'var(--color-base-700)' }}>/</span>{' '}
            <span style={{ color: 'var(--color-light-base-primary)' }}>{order.order_number}</span>
          </span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <Badge size="sm">Encomenda {order.order_number}</Badge>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32 }}>
            <div>
              <h1 className="heading-1" style={{ margin: 0, color: 'var(--color-light-base-primary)' }}>{order.order_number}</h1>
              <p style={{ margin: '10px 0 0', fontFamily: 'var(--font-geist-sans)', fontSize: 15, color: 'var(--color-base-400)' }}>
                {dateStr}
                {' · '}
                <span style={{ color: STATUS_COLORS[order.status] ?? 'var(--color-base-400)' }}>
                  ● {statusLabel(order.status)}
                </span>
                {' · '}
                <span style={{ color: PAYMENT_COLORS[order.payment_status] ?? 'var(--color-base-400)' }}>
                  {paymentLabel(order.payment_status)}
                </span>
              </p>
            </div>
            <Link href="/encomendas" style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'var(--color-base-400)', textDecoration: 'none' }}>← Voltar</Link>
          </div>
        </div>

        {/* Multibanco pending payment box */}
        {showMultibanco && (
          <div style={{ marginBottom: 28, padding: 24, border: '1px dashed var(--color-accent-100)', borderRadius: 6, background: 'rgba(45,212,205,.05)' }}>
            <span className="text-mono-xs" style={{ color: 'var(--color-accent-100)', display: 'block', marginBottom: 16, textTransform: 'uppercase' }}>Referência Multibanco — pagamento pendente</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: '8px 40px', justifyContent: 'start' }}>
              <RefLine label="Entidade"   value={order.eupago_entity!} />
              <RefLine label="Referência" value={formatReference(order.eupago_reference!)} large />
              <RefLine label="Valor"      value={`€ ${order.total_amount_with_vat.toFixed(2).replace('.', ',')}`} large accent />
              {order.payment_deadline && (
                <RefLine label="Válida até" value={new Date(order.payment_deadline).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' } as Intl.DateTimeFormatOptions)} />
              )}
            </div>
          </div>
        )}

        {/* Body grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>

          {/* Items + totals */}
          <div style={{ border: '1px dashed var(--color-base-800)', borderRadius: 6, background: 'var(--color-dark-base-secondary)' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px dashed var(--color-base-800)' }}>
              <span className="text-mono-sm" style={{ color: 'var(--color-base-300)', textTransform: 'uppercase' }}>Artigos · {order.items.length}</span>
            </div>

            {order.items.map((it, i) => (
              <div key={`${it.product_sku ?? ''}-${i}`} style={{
                display: 'grid', gridTemplateColumns: '1fr auto auto',
                gap: 16, padding: '18px 22px', alignItems: 'center',
                borderTop: i === 0 ? 'none' : '1px dashed var(--color-base-800)',
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 15, color: 'var(--color-light-base-primary)', letterSpacing: '-.02em' }}>{it.product_name ?? '—'}</div>
                  {it.size_format && <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', marginTop: 3 }}>{it.size_format}</div>}
                  {it.product_sku && <div className="text-mono-xs" style={{ color: 'var(--color-base-600)', marginTop: 3 }}>SKU {it.product_sku}</div>}
                </div>
                <span className="text-mono-xs" style={{ color: 'var(--color-base-400)' }}>× {it.quantity}</span>
                <div style={{ textAlign: 'right' }}>
                  <div className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>€ {it.unit_price.toFixed(2).replace('.', ',')}</div>
                  <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 16, color: 'var(--color-light-base-primary)', marginTop: 2 }}>€ {it.total_price.toFixed(2).replace('.', ',')}</div>
                </div>
              </div>
            ))}

            {/* Totals */}
            <div style={{ padding: '18px 22px', borderTop: '1px dashed var(--color-base-800)', display: 'grid', gap: 10 }}>
              <TotalLine label="Subtotal"  value={`€ ${order.subtotal.toFixed(2).replace('.', ',')}`} />
              <TotalLine label="Envio"     value={order.shipping_cost === 0 ? 'Grátis' : `€ ${order.shipping_cost.toFixed(2).replace('.', ',')}`} />
              <TotalLine label="IVA 23% incluído" value="—" muted />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 12, borderTop: '1px dashed var(--color-base-800)', marginTop: 4 }}>
                <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 18, color: 'var(--color-light-base-primary)', letterSpacing: '-.02em' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 28, color: 'var(--color-light-base-primary)', letterSpacing: '-.035em' }}>€ {order.total_amount_with_vat.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
            {shipping && (
              <Card title="Morada de entrega">
                <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 14, color: 'var(--color-light-base-primary)', lineHeight: 1.7 }}>
                  {shipping.address_line_1 && <div>{shipping.address_line_1}</div>}
                  {shipping.address_line_2 && <div>{shipping.address_line_2}</div>}
                  {shipping.postal_code && shipping.city && <div>{shipping.postal_code} {shipping.city}</div>}
                  {shipping.country && <div>{shipping.country}</div>}
                </div>
              </Card>
            )}

            {customer && (
              <Card title="Faturação">
                <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 14, color: 'var(--color-light-base-primary)', lineHeight: 1.7 }}>
                  {customerName && <div>{customerName}</div>}
                  {customer.company_name && <div>{customer.company_name}</div>}
                  {customer.email && <div>{customer.email}</div>}
                  {customer.phone && <div>{customer.phone}</div>}
                  {customer.tax_id && <div><span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>NIF</span> {customer.tax_id}</div>}
                </div>
              </Card>
            )}

            {order.notes && (
              <Card title="Notas">
                <p style={{ margin: 0, fontFamily: 'var(--font-geist-sans)', fontSize: 14, color: 'var(--color-base-400)', lineHeight: 1.6 }}>{order.notes}</p>
              </Card>
            )}

            <Card title="Precisa de ajuda?">
              <p style={{ margin: '0 0 14px', fontFamily: 'var(--font-geist-sans)', fontSize: 14, color: 'var(--color-base-400)' }}>A nossa equipa responde em horário útil em até 6 horas.</p>
              <Link href="/contacto" style={{
                display: 'block', textAlign: 'center', padding: '10px 16px',
                border: '1px solid var(--color-base-700)', borderRadius: 2,
                fontFamily: 'var(--font-geist-mono)', fontSize: 12, letterSpacing: '-.015rem',
                color: 'var(--color-light-base-primary)', textDecoration: 'none',
                textTransform: 'uppercase',
              }}>Contactar apoio</Link>
            </Card>
          </div>
        </div>
      </div>
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

function TotalLine({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span className="text-mono-xs" style={{ color: muted ? 'var(--color-base-600)' : 'var(--color-base-500)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 14, color: muted ? 'var(--color-base-500)' : 'var(--color-base-300)' }}>{value}</span>
    </div>
  );
}

function RefLine({ label, value, large, accent }: { label: string; value: string; large?: boolean; accent?: boolean }) {
  return (
    <div>
      <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', marginBottom: 4 }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-geist-mono)',
        fontSize: large ? 22 : 15,
        letterSpacing: large ? '-.02em' : '-.015rem',
        color: accent ? 'var(--color-accent-100)' : 'var(--color-light-base-primary)',
      }}>{value}</div>
    </div>
  );
}
