'use client';

import { useState } from 'react';
import Badge from '@/components/store/Badge';
import Button from '@/components/store/Button';

type Stage = 'request' | 'set' | 'done';

function TxField({ label, type = 'text', placeholder = '' }: { label: string; type?: string; placeholder?: string }) {
  return (
    <label style={{ display: 'grid', gap: 6, marginBottom: 14 }}>
      <span className="text-mono-xs" style={{ color: 'var(--color-base-500)', textTransform: 'uppercase' }}>{label}</span>
      <input type={type} placeholder={placeholder} style={{
        padding: '14px 16px', background: 'var(--color-dark-base-secondary)',
        border: '1px dashed var(--color-base-700)', borderRadius: 2,
        color: 'var(--color-light-base-primary)', outline: 'none',
        fontFamily: 'var(--font-geist-sans)', fontSize: 15, letterSpacing: '-.015em',
      }}/>
    </label>
  );
}

const STAGES: { k: Stage; l: string }[] = [
  { k: 'request', l: 'Pedido'              },
  { k: 'set',     l: 'Nova palavra-passe'  },
  { k: 'done',    l: 'Concluído'           },
];

export default function RecuperarPasswordPage() {
  const [stage, setStage] = useState<Stage>('request');

  return (
    <main id="main">
      <section data-screen-label={`01 Password reset · ${stage}`} style={{ minHeight: 'calc(100vh - 280px)', padding: '72px 40px', display: 'grid', placeItems: 'center' }}>
        <div style={{ maxWidth: 560, width: '100%' }}>
          {/* stage indicator */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
            {STAGES.map((s, i) => {
              const on = s.k === stage;
              return (
                <div key={s.k} onClick={() => setStage(s.k)} style={{ flex: 1, cursor: 'pointer', padding: '10px 4px', borderTop: `2px solid ${on ? 'var(--color-accent-100)' : 'var(--color-base-800)'}` }}>
                  <div className="text-mono-xs" style={{ color: on ? 'var(--color-accent-100)' : 'var(--color-base-600)' }}>{String(i + 1).padStart(2, '0')}</div>
                  <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 13, color: on ? 'var(--color-light-base-primary)' : 'var(--color-base-500)', marginTop: 2 }}>{s.l}</div>
                </div>
              );
            })}
          </div>

          {stage === 'request' && (
            <>
              <Badge size="sm">Conta · Recuperação</Badge>
              <h1 className="heading-1" style={{ margin: '16px 0 0', color: 'var(--color-light-base-primary)' }}>Recuperar acesso.</h1>
              <p className="text-body" style={{ color: 'var(--color-base-300)', marginTop: 16 }}>Indique o email da sua conta. Enviaremos um link seguro para definir uma nova palavra-passe, válido durante 30 minutos.</p>
              <div style={{ marginTop: 32 }}>
                <TxField label="Email" type="email" placeholder="nome@exemplo.pt" />
                <Button variant="primary" onClick={() => setStage('set')}>Enviar link de recuperação</Button>
                <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', marginTop: 18 }}>
                  ● Lembrou-se da palavra-passe? <button style={{ color: 'var(--color-accent-100)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>Iniciar sessão</button>
                </div>
              </div>
            </>
          )}

          {stage === 'set' && (
            <>
              <Badge size="sm">Link verificado</Badge>
              <h1 className="heading-1" style={{ margin: '16px 0 0', color: 'var(--color-light-base-primary)' }}>Nova palavra-passe.</h1>
              <p className="text-body" style={{ color: 'var(--color-base-300)', marginTop: 16 }}>Escolha uma palavra-passe com pelo menos 10 caracteres, incluindo letras, números e um símbolo.</p>
              <div style={{ marginTop: 32 }}>
                <TxField label="Nova palavra-passe"      type="password" placeholder="••••••••••" />
                <TxField label="Confirmar palavra-passe" type="password" placeholder="••••••••••" />
                {/* strength meter */}
                <div style={{ marginTop: 4, marginBottom: 22, display: 'grid', gap: 6 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[1,2,3,4].map((i) => <div key={i} style={{ flex: 1, height: 3, background: i <= 3 ? 'var(--color-accent-100)' : 'var(--color-base-800)', borderRadius: 1 }} />)}
                  </div>
                  <div className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>Força · Boa</div>
                </div>
                <Button variant="primary" onClick={() => setStage('done')}>Guardar e iniciar sessão</Button>
              </div>
            </>
          )}

          {stage === 'done' && (
            <>
              <div style={{ width: 72, height: 72, border: '1px dashed var(--color-accent-100)', borderRadius: '50%', display: 'grid', placeItems: 'center', marginBottom: 24 }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke="var(--color-accent-100)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <Badge size="sm">Palavra-passe atualizada</Badge>
              <h1 className="heading-1" style={{ margin: '16px 0 0', color: 'var(--color-light-base-primary)' }}>Tudo pronto.</h1>
              <p className="text-body" style={{ color: 'var(--color-base-300)', marginTop: 16 }}>A sua palavra-passe foi atualizada. Já pode iniciar sessão com as novas credenciais.</p>
              <div style={{ marginTop: 32, display: 'flex', gap: 10 }}>
                <Button variant="primary">Iniciar sessão</Button>
                <Button variant="secondary">Ir para a loja</Button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
