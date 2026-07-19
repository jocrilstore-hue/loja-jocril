import type { Metadata } from 'next';
import { SignUp } from '@clerk/nextjs';
import Badge from '@/components/store/Badge';

export const metadata: Metadata = {
  title: 'Criar conta',
};

const SIGN_UP_APPEARANCE = {
  variables: {
    colorPrimary: 'var(--color-accent-100)',
    colorBackground: 'transparent',
    colorText: 'var(--color-light-base-primary)',
    colorTextSecondary: 'var(--color-base-400)',
    colorInputBackground: 'var(--color-dark-base-secondary)',
    colorInputText: 'var(--color-light-base-primary)',
    borderRadius: '2px',
    fontFamily: 'var(--font-geist-sans)',
  },
  elements: {
    rootBox: { width: '100%' },
    cardBox: { width: '100%', boxShadow: 'none', border: 'none' },
    card: { background: 'transparent', boxShadow: 'none', padding: 0, border: 'none' },
    header: { display: 'none' },
    formFieldLabel: {
      color: 'var(--color-base-500)',
      fontFamily: 'var(--font-geist-mono)',
    },
    formFieldInput: {
      background: 'var(--color-dark-base-secondary)',
      border: '1px solid var(--color-base-800)',
      borderRadius: '2px',
      color: 'var(--color-light-base-primary)',
      fontFamily: 'var(--font-geist-sans)',
    },
    formButtonPrimary: {
      background: 'var(--color-accent-100)',
      color: 'var(--color-dark-base-primary)',
      fontFamily: 'var(--font-geist-sans)',
      textTransform: 'none' as const,
      letterSpacing: '-.02em',
      borderRadius: '2px',
    },
    socialButtonsBlockButton: {
      background: 'transparent',
      border: '1px dashed var(--color-base-700)',
      borderRadius: '2px',
      color: 'var(--color-light-base-primary)',
    },
    dividerLine: { background: 'var(--color-base-800)' },
    dividerText: {
      color: 'var(--color-base-600)',
      fontFamily: 'var(--font-geist-mono)',
    },
    footer: { background: 'transparent' },
    footerActionText: { color: 'var(--color-base-400)' },
    footerActionLink: { color: 'var(--color-accent-100)' },
  },
};

export default function RegistarPage() {
  return (
    <main id="main" data-screen-label="02 Registo" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--color-dark-base-primary)' }}>
      {/* left — form */}
      <section style={{ padding: '72px 56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Badge size="sm">Criar conta</Badge>
          <h1 className="heading-1" style={{ margin: '14px 0 10px', color: 'var(--color-light-base-primary)' }}>
            Comece aqui.
          </h1>
          <p className="text-body" style={{ color: 'var(--color-base-400)', marginBottom: 36 }}>
            Crie a sua conta Jocril para guardar moradas, acompanhar encomendas e repetir pedidos.
          </p>

          <SignUp
            routing="hash"
            signInUrl="/entrar"
            appearance={SIGN_UP_APPEARANCE}
          />
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
