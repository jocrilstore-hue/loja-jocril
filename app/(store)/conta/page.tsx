'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useClerk, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Badge from '@/components/store/Badge';
import Button from '@/components/store/Button';

type AccountOrder = {
  order_number: string;
  status: string;
  payment_status: string;
  total_amount_with_vat: number;
  created_at: string;
  items?: unknown[];
};

const ADDRESSES = [
  { kind: 'Entrega',    name: 'Maria Silva',          street: 'Rua da Vinha 12, 3º', city: '1200-123 Lisboa', phone: '+351 912 345 678', nif: '',              default: true  },
  { kind: 'Faturação', name: 'Ponto & Linha, Lda.',   street: 'Av. da República 88', city: '1050-210 Lisboa', phone: '+351 213 400 211', nif: 'NIF 515 998 441', default: false },
];

const STATUS_MAP: Record<string, { l: string; c: string }> = {
  pending:    { l: 'Pendente',      c: 'var(--color-accent-100)' },
  confirmed:  { l: 'Confirmada',    c: 'var(--color-accent-100)' },
  processing: { l: 'Em preparação', c: 'var(--color-accent-100)' },
  shipped:    { l: 'Em trânsito',   c: 'var(--color-accent-100)' },
  delivered:  { l: 'Entregue',      c: 'var(--color-secondary)'  },
  cancelled:  { l: 'Cancelada',     c: 'var(--color-base-500)'   },
  returned:   { l: 'Devolvida',     c: 'var(--color-base-500)'   },
};

const TABS = [
  { k: 'overview',  t: 'Resumo'       },
  { k: 'orders',    t: 'Encomendas'  },
  { k: 'addresses', t: 'Moradas'     },
  { k: 'profile',   t: 'Perfil'       },
  { k: 'notif',     t: 'Notificações' },
] as const;

const NOTIF_PREFS: [string, string, boolean, boolean][] = [
  ['Emails transacionais', 'Confirmações de encomenda, envios e faturação', true,  true  ],
  ['Atualizações de produto', 'Novidades e reedições de peças',             true,  false ],
  ['Promoções',              'Campanhas e descontos exclusivos',              false, false ],
  ['Newsletter',             'Resumo mensal de projetos e processos',        true,  false ],
];

const INPUT_STYLE: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: 'var(--color-dark-base-primary)',
  border: '1px solid var(--color-base-800)', borderRadius: 2,
  color: 'var(--color-light-base-primary)',
  fontFamily: 'var(--font-geist-sans)', fontSize: 14, outline: 'none',
};

export default function ContaPage() {
  const [tab, setTab] = useState<string>('overview');
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }

    const controller = new AbortController();
    async function loadOrders() {
      setOrdersLoading(true);
      setOrdersError(null);
      try {
        const response = await fetch('/api/orders', { signal: controller.signal });
        const payload = await response.json() as { success: boolean; data?: AccountOrder[]; error?: string };
        if (!response.ok || !payload.success) {
          throw new Error(payload.error ?? 'Erro ao carregar encomendas');
        }
        setOrders(payload.data ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setOrdersError(error instanceof Error ? error.message : 'Erro ao carregar encomendas');
      } finally {
        setOrdersLoading(false);
      }
    }

    loadOrders();
    return () => controller.abort();
  }, [isLoaded, isSignedIn]);

  const displayName  = user?.fullName ?? user?.firstName ?? 'Cliente';
  const displayEmail = user?.primaryEmailAddress?.emailAddress ?? '';
  const since = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('pt-PT', { year: 'numeric', month: 'long' })
    : '—';

  return (
    <main id="main">
      <section data-screen-label="01 Conta header" style={{ padding: '40px 40px 0', borderBottom: '1px dashed var(--color-base-800)', background: 'var(--color-dark-base-primary)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Badge size="sm">A minha conta</Badge>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, marginBottom: 24 }}>
            <div>
              <h1 className="heading-1" style={{ margin: 0, color: 'var(--color-light-base-primary)' }}>Olá, {displayName.split(' ')[0]}.</h1>
              <p style={{ margin: '10px 0 0', fontFamily: 'var(--font-geist-sans)', fontSize: 16, color: 'var(--color-base-400)' }}>
                {displayEmail && <><span style={{ color: 'var(--color-light-base-primary)' }}>{displayEmail}</span> · </>}Cliente desde <span style={{ color: 'var(--color-light-base-primary)' }}>{since}</span>{/* TODO: B5b — order count + tier progress */}
              </p>
            </div>
            <Button variant="outline" onClick={() => signOut({ redirectUrl: '/' })}>Terminar sessão</Button>
          </div>

          <div style={{ display: 'flex', gap: 2 }}>
            {TABS.map((t) => {
              const on = t.k === tab;
              const count = t.k === 'orders' ? orders.length : t.k === 'addresses' ? ADDRESSES.length : undefined;
              return (
                <button key={t.k} onClick={() => setTab(t.k)} style={{
                  padding: '14px 18px', background: 'transparent', border: 'none', cursor: 'pointer',
                  borderBottom: `2px solid ${on ? 'var(--color-accent-100)' : 'transparent'}`,
                  color: on ? 'var(--color-light-base-primary)' : 'var(--color-base-500)',
                  fontFamily: 'var(--font-geist-mono)', fontSize: 12, letterSpacing: '-.015rem',
                  textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  {t.t} {count !== undefined && <span style={{ color: 'var(--color-base-700)' }}>· {count}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section data-screen-label="02 Conta body" style={{ padding: '32px 40px 80px', background: 'var(--color-dark-base-primary)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>

          {tab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
              <div>
                <Card title="Últimas encomendas" right={<button onClick={() => setTab('orders')} className="text-mono-xs" style={{ color: 'var(--color-accent-100)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'var(--font-geist-mono)', fontSize: 12 }}>Ver todas →</button>}>
                  <div style={{ display: 'grid' }}>
                    {ordersLoading && <EmptyLine>A carregar encomendas…</EmptyLine>}
                    {ordersError && <EmptyLine>{ordersError}</EmptyLine>}
                    {!ordersLoading && !ordersError && orders.length === 0 && <EmptyLine>Ainda não tem encomendas.</EmptyLine>}
                    {orders.slice(0, 4).map((o, i) => {
                      const s = STATUS_MAP[o.status] ?? { l: o.status, c: 'var(--color-base-400)' };
                      const itemCount = o.items?.length ?? 0;
                      return (
                        <div key={o.order_number} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr auto', gap: 20, alignItems: 'center', padding: '14px 0', borderTop: i === 0 ? 'none' : '1px dashed var(--color-base-800)' }}>
                          <div>
                            <div style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 13, color: 'var(--color-light-base-primary)' }}>{o.order_number}</div>
                            <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', marginTop: 3 }}>{formatOrderDate(o.created_at)}</div>
                          </div>
                          <span className="text-mono-xs" style={{ color: 'var(--color-base-400)' }}>{itemCount} {itemCount === 1 ? 'artigo' : 'artigos'}</span>
                          <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 15, color: 'var(--color-light-base-primary)' }}>{formatMoney(o.total_amount_with_vat)}</span>
                          <span className="text-mono-xs" style={{ color: s.c }}>● {s.l}</span>
                          <Link href={`/encomenda/${o.order_number}`} style={{ color: 'var(--color-light-base-primary)', fontFamily: 'var(--font-geist-mono)', fontSize: 12, textDecoration: 'none' }}>Ver →</Link>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <div style={{ height: 24 }}/>
                <Card title="Produtos recomendados" right={<span className="text-mono-xs" style={{ color: 'var(--color-base-600)' }}>Com base no seu histórico</span>}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {[
                      { n: 'Expositor A3 · 8 prateleiras', p: '€ 54,00', img: '/assets/portfolio/carm-premium.avif' },
                      { n: 'Caixa coletora 30 cm',          p: '€ 68,00', img: '/assets/portfolio/stoli.avif'        },
                      { n: 'Moldura 50×70 acrílica',         p: '€ 42,00', img: '/assets/portfolio/beefeater.avif'   },
                    ].map((r) => (
                      <div key={r.n} style={{ border: '1px dashed var(--color-base-800)', borderRadius: 4, overflow: 'hidden', background: 'var(--color-dark-base-primary)' }}>
                        <div style={{ aspectRatio: '1/1', background: `url(${r.img}) center/cover` }}/>
                        <div style={{ padding: '10px 12px' }}>
                          <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 14, color: 'var(--color-light-base-primary)', letterSpacing: '-.02em' }}>{r.n}</div>
                          <div className="text-mono-sm" style={{ color: 'var(--color-accent-100)', marginTop: 4 }}>{r.p}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div>
                <Card title="Progresso de escalão">
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 40, letterSpacing: '-.045em', color: 'var(--color-light-base-primary)' }}>€ 852</span>
                    <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>/ € 1 000 escalão 10+</span>
                  </div>
                  <div style={{ marginTop: 12, height: 8, background: 'var(--color-dark-base-primary)', border: '1px solid var(--color-base-800)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: '85%', height: '100%', background: 'var(--color-accent-100)' }}/>
                  </div>
                  <p style={{ margin: '14px 0 0', fontFamily: 'var(--font-geist-sans)', fontSize: 13, color: 'var(--color-base-400)' }}>Atinge o escalão <strong style={{ color: 'var(--color-light-base-primary)' }}>10+</strong> com mais € 148,00 em compras, poupando até 8% nos próximos pedidos.</p>
                </Card>

                <div style={{ height: 16 }}/>
                <Card title="Morada principal" right={<button style={{ color: 'var(--color-accent-100)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'var(--font-geist-mono)', fontSize: 12 }}>Editar →</button>}>
                  <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 14, color: 'var(--color-light-base-primary)', lineHeight: 1.6 }}>
                    Maria Silva<br/>Rua da Vinha 12, 3º<br/>1200-123 Lisboa<br/>Portugal<br/>+351 912 345 678
                  </div>
                </Card>

                <div style={{ height: 16 }}/>
                <Card title="Precisa de ajuda?">
                  <p style={{ margin: 0, fontFamily: 'var(--font-geist-sans)', fontSize: 14, color: 'var(--color-base-400)' }}>A nossa equipa responde em horário útil em até 6 horas.</p>
                  <div style={{ marginTop: 12, display: 'grid', gap: 6 }}>
                    <Button variant="outline">Abrir ticket</Button>
                    <button style={{ textAlign: 'center', padding: '10px', fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'var(--color-base-400)', cursor: 'pointer', background: 'none', border: 'none' }}>Ver FAQ →</button>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <Card title={`Todas as encomendas (${orders.length})`} right={<input placeholder="Procurar por nº ou produto…" style={{ padding: '8px 12px', background: 'var(--color-dark-base-primary)', border: '1px solid var(--color-base-800)', borderRadius: 2, color: 'var(--color-light-base-primary)', fontFamily: 'var(--font-geist-sans)', fontSize: 13, width: 260 }}/>}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr auto', gap: 20, padding: '10px 0 12px', borderBottom: '1px dashed var(--color-base-800)' }}>
                {['Nº encomenda', 'Data', 'Artigos', 'Total', 'Estado', ''].map((h) => (
                  <span key={h} className="text-mono-xs" style={{ color: 'var(--color-base-500)', textTransform: 'uppercase' }}>{h}</span>
                ))}
              </div>
              {ordersLoading && <EmptyLine>A carregar encomendas…</EmptyLine>}
              {ordersError && <EmptyLine>{ordersError}</EmptyLine>}
              {!ordersLoading && !ordersError && orders.length === 0 && <EmptyLine>Ainda não tem encomendas.</EmptyLine>}
              {orders.map((o) => {
                const s = STATUS_MAP[o.status] ?? { l: o.status, c: 'var(--color-base-400)' };
                const itemCount = o.items?.length ?? 0;
                return (
                  <div key={o.order_number} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr auto', gap: 20, padding: '14px 0', alignItems: 'center', borderBottom: '1px dashed var(--color-base-900)' }}>
                    <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 13, color: 'var(--color-light-base-primary)' }}>{o.order_number}</span>
                    <span className="text-mono-xs" style={{ color: 'var(--color-base-400)' }}>{formatOrderDate(o.created_at)}</span>
                    <span className="text-mono-xs" style={{ color: 'var(--color-base-400)' }}>{itemCount}</span>
                    <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 15, color: 'var(--color-light-base-primary)' }}>{formatMoney(o.total_amount_with_vat)}</span>
                    <span className="text-mono-xs" style={{ color: s.c }}>● {s.l}</span>
                    <Link href={`/encomenda/${o.order_number}`} style={{ color: 'var(--color-light-base-primary)', fontFamily: 'var(--font-geist-mono)', fontSize: 12, textDecoration: 'none' }}>Ver →</Link>
                  </div>
                );
              })}
            </Card>
          )}

          {tab === 'addresses' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              {ADDRESSES.map((a) => (
                <Card key={a.kind} title={`Morada · ${a.kind}`} right={a.default ? <span className="text-mono-xs" style={{ color: 'var(--color-accent-100)' }}>● Predefinida</span> : <button style={{ color: 'var(--color-accent-100)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'var(--font-geist-mono)', fontSize: 12 }}>Tornar predefinida</button>}>
                  <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 14, color: 'var(--color-light-base-primary)', lineHeight: 1.6 }}>
                    {a.name}<br/>{a.street}<br/>{a.city}<br/>{a.phone}{a.nif && <><br/><span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>{a.nif}</span></>}
                  </div>
                  <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px dashed var(--color-base-800)', display: 'flex', gap: 10 }}>
                    <Button variant="outline">Editar</Button>
                    <button style={{ alignSelf: 'center', color: 'var(--color-base-500)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'var(--font-geist-mono)', fontSize: 12 }}>Eliminar</button>
                  </div>
                </Card>
              ))}
              <Card title="+ Nova morada">
                <div style={{ padding: '40px 20px', border: '1px dashed var(--color-base-800)', borderRadius: 4, textAlign: 'center' }}>
                  <p style={{ margin: '0 0 16px', fontFamily: 'var(--font-geist-sans)', fontSize: 14, color: 'var(--color-base-400)' }}>Adicione moradas adicionais para escolher no checkout.</p>
                  <Button variant="solid">Adicionar morada</Button>
                </div>
              </Card>
            </div>
          )}

          {tab === 'profile' && (
            <Card title="Dados pessoais">
              <p style={{ margin: '0 0 18px', fontFamily: 'var(--font-geist-sans)', fontSize: 13, color: 'var(--color-base-400)' }}>
                Edição de perfil aguarda decisão de propriedade dos dados entre Clerk e cliente/faturação.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {[
                  ['Nome',    user?.fullName ?? user?.firstName ?? '—'],
                  ['Email',   user?.primaryEmailAddress?.emailAddress ?? '—'],
                  ['Telefone','—'],
                  ['NIF',     '—'],
                  ['Empresa', '—'],
                  ['Idioma',  'Português (PT)'],
                ].map(([l, v]) => (
                  <div key={l}>
                    <label className="text-mono-xs" style={{ display: 'block', marginBottom: 6, color: 'var(--color-base-500)' }}>{l}</label>
                    <input defaultValue={v} disabled style={{ ...INPUT_STYLE, opacity: 0.65 }}/>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px dashed var(--color-base-800)', display: 'flex', gap: 10 }}>
                <Button variant="solid" disabled>Guardar alterações</Button>
                <button style={{ alignSelf: 'center', fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'var(--color-destructive)', cursor: 'pointer', background: 'none', border: 'none' }}>Eliminar conta</button>
              </div>
            </Card>
          )}

          {tab === 'notif' && (
            <Card title="Preferências de comunicação">
              {NOTIF_PREFS.map(([t, d, on, locked]) => (
                <div key={t} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, padding: '16px 0', borderTop: '1px dashed var(--color-base-800)', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 15, color: 'var(--color-light-base-primary)' }}>{t}</div>
                    <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', marginTop: 3 }}>{d}{locked && ' · obrigatório'}</div>
                  </div>
                  <div style={{ width: 42, height: 22, borderRadius: 12, background: on ? 'var(--color-accent-100)' : 'var(--color-base-800)', position: 'relative', opacity: locked ? 0.5 : 1 }}>
                    <div style={{ position: 'absolute', top: 2, left: on ? 22 : 2, width: 18, height: 18, borderRadius: 9, background: '#fff', transition: 'left .15s' }}/>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>
      </section>
    </main>
  );
}

function formatMoney(value: number) {
  return `€ ${value.toFixed(2).replace('.', ',')}`;
}

function formatOrderDate(value: string) {
  return new Date(value).toLocaleDateString('pt-PT', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function EmptyLine({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: '18px 0', fontFamily: 'var(--font-geist-sans)', fontSize: 14, color: 'var(--color-base-400)' }}>
      {children}
    </div>
  );
}

function Card({ title, right, children }: { title: string; right?: ReactNode; children: ReactNode }) {
  return (
    <div style={{ border: '1px dashed var(--color-base-800)', borderRadius: 6, background: 'var(--color-dark-base-secondary)' }}>
      <div style={{ padding: '18px 22px', borderBottom: '1px dashed var(--color-base-800)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="text-mono-sm" style={{ color: 'var(--color-base-300)', textTransform: 'uppercase' }}>{title}</span>
        {right}
      </div>
      <div style={{ padding: 22 }}>{children}</div>
    </div>
  );
}
