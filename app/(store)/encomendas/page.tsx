import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Badge from '@/components/store/Badge';

type OrderStatus = string;
type PaymentStatus = string;

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

export default async function EncomendasPage() {
  const { userId } = await auth();
  const supabase = await createClient();

  let orders: {
    order_number: string;
    status: OrderStatus;
    payment_status: PaymentStatus;
    total_amount_with_vat: number;
    created_at: string;
  }[] = [];

  if (userId) {
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('auth_user_id', userId)
      .single();

    if (customer) {
      const { data } = await supabase
        .from('orders')
        .select('order_number, status, payment_status, total_amount_with_vat, created_at')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false });

      if (data) orders = data;
    }
  }

  return (
    <main id="main" style={{ background: 'var(--color-dark-base-primary)', padding: '40px 40px 80px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ marginBottom: 8 }}>
          <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>
            <Link href="/conta" style={{ color: 'var(--color-base-400)', textDecoration: 'none' }}>A minha conta</Link>
            {' '}<span style={{ color: 'var(--color-base-700)' }}>/</span>{' '}
            <span style={{ color: 'var(--color-light-base-primary)' }}>Encomendas</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, marginTop: 16 }}>
          <div>
            <Badge size="sm">As minhas encomendas</Badge>
            <h1 className="heading-1" style={{ margin: '14px 0 0', color: 'var(--color-light-base-primary)' }}>Encomendas</h1>
          </div>
        </div>

        {orders.length === 0 ? (
          <div style={{ padding: '80px 40px', border: '1px dashed var(--color-base-700)', borderRadius: 6, background: 'var(--color-dark-base-secondary)', textAlign: 'center' }}>
            <Badge size="sm">Sem encomendas</Badge>
            <h2 className="heading-2" style={{ margin: '18px 0 12px', color: 'var(--color-light-base-primary)' }}>Ainda não tem encomendas.</h2>
            <p className="text-body" style={{ margin: '0 auto 28px', maxWidth: '44ch' }}>
              Explore a nossa loja e faça a sua primeira encomenda.
            </p>
            <Link href="/produtos" style={{
              display: 'inline-block', padding: '12px 24px',
              background: 'var(--color-light-base-secondary)', color: 'var(--color-dark-base-primary)',
              borderRadius: 2, fontFamily: 'var(--font-geist-mono)', fontSize: 12,
              letterSpacing: '-.015rem', textTransform: 'uppercase', textDecoration: 'none',
            }}>Ver produtos →</Link>
          </div>
        ) : (
          <div style={{ border: '1px dashed var(--color-base-800)', borderRadius: 6, background: 'var(--color-dark-base-secondary)' }}>
            <div style={{ padding: '16px 22px', borderBottom: '1px dashed var(--color-base-800)', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr auto', gap: 20 }}>
              {['Nº encomenda', 'Data', 'Total', 'Estado', ''].map((h) => (
                <span key={h} className="text-mono-xs" style={{ color: 'var(--color-base-500)', textTransform: 'uppercase' }}>{h}</span>
              ))}
            </div>
            {orders.map((o) => {
              const date = new Date(o.created_at).toLocaleDateString('pt-PT', {
                day: '2-digit', month: 'short', year: 'numeric',
              });
              const total = `€ ${o.total_amount_with_vat.toFixed(2).replace('.', ',')}`;
              return (
                <div key={o.order_number} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr auto', gap: 20, padding: '16px 22px', alignItems: 'center', borderBottom: '1px dashed var(--color-base-900)' }}>
                  <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 13, color: 'var(--color-light-base-primary)' }}>{o.order_number}</span>
                  <span className="text-mono-xs" style={{ color: 'var(--color-base-400)' }}>{date}</span>
                  <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 15, color: 'var(--color-light-base-primary)' }}>{total}</span>
                  <span className="text-mono-xs" style={{ color: STATUS_COLORS[o.status] ?? 'var(--color-base-400)' }}>
                    ● {statusLabel(o.status)}{' '}
                    <span style={{ color: PAYMENT_COLORS[o.payment_status] ?? 'var(--color-base-500)' }}>
                      · {paymentLabel(o.payment_status)}
                    </span>
                  </span>
                  <Link href={`/encomenda/${o.order_number}`} style={{ color: 'var(--color-light-base-primary)', fontFamily: 'var(--font-geist-mono)', fontSize: 12, textDecoration: 'none' }}>Ver →</Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
