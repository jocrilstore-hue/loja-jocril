'use client';

import { useState } from 'react';
import Badge from '@/components/store/Badge';
import Button from '@/components/store/Button';

const INPUT_STYLE: React.CSSProperties = {
  width: '100%', padding: '12px 14px',
  background: 'var(--color-dark-base-secondary)',
  border: '1px solid var(--color-base-800)', borderRadius: 2,
  color: 'var(--color-light-base-primary)',
  fontFamily: 'var(--font-geist-sans)', fontSize: 14, outline: 'none',
};

const OAUTH_BTN: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: 'transparent',
  border: '1px dashed var(--color-base-700)', borderRadius: 2,
  color: 'var(--color-light-base-primary)',
  fontFamily: 'var(--font-geist-sans)', fontSize: 14,
  letterSpacing: '-.02em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};

export default function EntrarPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <main id="main" data-screen-label="01 Login" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--color-dark-base-primary)' }}>
      {/* left — form */}
      <section style={{ padding: '72px 56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Badge size="sm">{mode === 'login' ? 'A minha conta' : 'Criar conta'}</Badge>
          <h1 className="heading-1" style={{ margin: '14px 0 10px', color: 'var(--color-light-base-primary)' }}>
            {mode === 'login' ? 'Bem-vinda de volta.' : 'Comece aqui.'}
          </h1>
          <p className="text-body" style={{ color: 'var(--color-base-400)', marginBottom: 36 }}>
            {mode === 'login'
              ? 'Inicie sessão para acompanhar encomendas e reutilizar moradas.'
              : 'Crie a sua conta Jocril para guardar moradas, acompanhar encomendas e repetir pedidos.'}
          </p>

          <div style={{ display: 'grid', gap: 14 }}>
            {mode === 'register' && (
              <div>
                <label className="text-mono-xs" style={{ display: 'block', marginBottom: 6, color: 'var(--color-base-500)' }}>Nome</label>
                <input defaultValue="Maria Silva" style={INPUT_STYLE}/>
              </div>
            )}
            <div>
              <label className="text-mono-xs" style={{ display: 'block', marginBottom: 6, color: 'var(--color-base-500)' }}>Email</label>
              <input defaultValue="maria@agencia.pt" style={INPUT_STYLE}/>
            </div>
            <div>
              <label className="text-mono-xs" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: 'var(--color-base-500)' }}>
                <span>Palavra-passe</span>
                {mode === 'login' && <button style={{ color: 'var(--color-accent-100)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'var(--font-geist-mono)', fontSize: 'inherit' }}>Esqueceu-se?</button>}
              </label>
              <input type="password" defaultValue="••••••••••" style={INPUT_STYLE}/>
            </div>
            {mode === 'register' && (
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontFamily: 'var(--font-geist-sans)', fontSize: 12, color: 'var(--color-base-400)', marginTop: 4 }}>
                <input type="checkbox" defaultChecked style={{ marginTop: 3, accentColor: 'var(--color-accent-100)' }}/>
                Aceito os <button style={{ color: 'var(--color-accent-100)', cursor: 'pointer', background: 'none', border: 'none', padding: '0 2px', fontFamily: 'inherit', fontSize: 'inherit' }}>Termos</button> e a <button style={{ color: 'var(--color-accent-100)', cursor: 'pointer', background: 'none', border: 'none', padding: '0 2px', fontFamily: 'inherit', fontSize: 'inherit' }}>Política de Privacidade</button>.
              </label>
            )}
            <Button variant="solid">{mode === 'login' ? 'Entrar →' : 'Criar conta →'}</Button>
          </div>

          <div style={{ margin: '28px 0 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, borderTop: '1px dashed var(--color-base-800)' }}/>
            <span className="text-mono-xs" style={{ color: 'var(--color-base-600)' }}>OU</span>
            <div style={{ flex: 1, borderTop: '1px dashed var(--color-base-800)' }}/>
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            <button style={OAUTH_BTN}><span style={{ marginRight: 10 }}>G</span> Continuar com Google</button>
            <button style={OAUTH_BTN}><span style={{ marginRight: 10 }}>◍</span> Continuar com Microsoft</button>
          </div>

          <p style={{ marginTop: 28, fontFamily: 'var(--font-geist-sans)', fontSize: 13, color: 'var(--color-base-400)', textAlign: 'center' }}>
            {mode === 'login' ? 'Ainda não tem conta? ' : 'Já tem conta? '}
            <button style={{ color: 'var(--color-accent-100)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', fontSize: 'inherit' }} onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Criar conta' : 'Iniciar sessão'}
            </button>
          </p>
        </div>
      </section>

      {/* right — illustrative */}
      <section style={{ position: 'relative', background: 'url(/assets/portfolio/carm-premium.avif) center/cover', borderLeft: '1px dashed var(--color-base-800)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(150deg, rgba(4,4,4,.2), rgba(4,4,4,.85))' }}/>
        <div style={{ position: 'relative', padding: 48, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Badge size="xs">Jocril · Desde 1983</Badge>
          <div>
            <h2 className="heading-2" style={{ margin: 0, color: '#fff', maxWidth: '16ch' }}>
              Precisão industrial. Acrílico à medida.
            </h2>
            <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px dashed rgba(255,255,255,.15)', borderRadius: 4 }}>
              {[['120k+', 'peças 2025'], ['42', 'anos'], ['2 400 m²', 'de fábrica']].map((s, i) => (
                <div key={i} style={{ padding: '16px 20px', borderRight: i < 2 ? '1px dashed rgba(255,255,255,.15)' : 'none' }}>
                  <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 24, letterSpacing: '-.035em', color: '#fff' }}>{s[0]}</div>
                  <div className="text-mono-xs" style={{ color: 'rgba(255,255,255,.55)', marginTop: 4 }}>{s[1]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
