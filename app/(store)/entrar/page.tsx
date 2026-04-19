'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSignIn, useSignUp } from '@clerk/nextjs';
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

type Mode = 'login' | 'register' | 'verify';

export default function EntrarPage() {
  return (
    <Suspense fallback={null}>
      <EntrarForm />
    </Suspense>
  );
}

function EntrarForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectUrl = params.get('redirect_url') || '/conta';

  const { signIn, setActive: setSignInActive, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: signUpLoaded } = useSignUp();

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!signInLoaded) return;
    setError(null); setBusy(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === 'complete') {
        await setSignInActive({ session: result.createdSessionId });
        router.push(redirectUrl);
      } else {
        setError('Não foi possível concluir o início de sessão.');
      }
    } catch (e: unknown) {
      const msg = (e as { errors?: { message?: string }[] })?.errors?.[0]?.message || 'Credenciais inválidas.';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleRegister = async () => {
    if (!signUpLoaded) return;
    setError(null); setBusy(true);
    try {
      const [firstName, ...rest] = name.trim().split(/\s+/);
      await signUp.create({
        emailAddress: email,
        password,
        firstName: firstName || undefined,
        lastName: rest.join(' ') || undefined,
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setMode('verify');
    } catch (e: unknown) {
      const msg = (e as { errors?: { message?: string }[] })?.errors?.[0]?.message || 'Não foi possível criar a conta.';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async () => {
    if (!signUpLoaded) return;
    setError(null); setBusy(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        await setSignUpActive({ session: result.createdSessionId });
        router.push(redirectUrl);
      } else {
        setError('Código inválido ou expirado.');
      }
    } catch (e: unknown) {
      const msg = (e as { errors?: { message?: string }[] })?.errors?.[0]?.message || 'Código inválido.';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleOAuth = async (strategy: 'oauth_google' | 'oauth_microsoft') => {
    if (!signInLoaded) return;
    setError(null);
    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: redirectUrl,
      });
    } catch (e: unknown) {
      const msg = (e as { errors?: { message?: string }[] })?.errors?.[0]?.message || 'Provedor indisponível.';
      setError(msg);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') handleLogin();
    else if (mode === 'register') handleRegister();
    else handleVerify();
  };

  const ctaLabel =
    mode === 'login' ? (busy ? 'A entrar…' : 'Entrar →') :
    mode === 'register' ? (busy ? 'A criar…' : 'Criar conta →') :
    (busy ? 'A verificar…' : 'Verificar código →');

  return (
    <main id="main" data-screen-label="01 Login" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--color-dark-base-primary)' }}>
      {/* left — form */}
      <section style={{ padding: '72px 56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Badge size="sm">
            {mode === 'login' ? 'A minha conta' : mode === 'register' ? 'Criar conta' : 'Verificação'}
          </Badge>
          <h1 className="heading-1" style={{ margin: '14px 0 10px', color: 'var(--color-light-base-primary)' }}>
            {mode === 'login' ? 'Bem-vinda de volta.' : mode === 'register' ? 'Comece aqui.' : 'Confirme o seu email.'}
          </h1>
          <p className="text-body" style={{ color: 'var(--color-base-400)', marginBottom: 36 }}>
            {mode === 'login'
              ? 'Inicie sessão para acompanhar encomendas e reutilizar moradas.'
              : mode === 'register'
              ? 'Crie a sua conta Jocril para guardar moradas, acompanhar encomendas e repetir pedidos.'
              : `Enviámos um código de 6 dígitos para ${email}. Introduza-o para concluir o registo.`}
          </p>

          <form onSubmit={onSubmit} style={{ display: 'grid', gap: 14 }}>
            {mode === 'register' && (
              <div>
                <label className="text-mono-xs" style={{ display: 'block', marginBottom: 6, color: 'var(--color-base-500)' }}>Nome</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required style={INPUT_STYLE}/>
              </div>
            )}
            {mode !== 'verify' && (
              <>
                <div>
                  <label className="text-mono-xs" style={{ display: 'block', marginBottom: 6, color: 'var(--color-base-500)' }}>Email</label>
                  <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={INPUT_STYLE}/>
                </div>
                <div>
                  <label className="text-mono-xs" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: 'var(--color-base-500)' }}>
                    <span>Palavra-passe</span>
                    {mode === 'login' && (
                      <Link href="/recuperar-password" style={{ color: 'var(--color-accent-100)', fontFamily: 'var(--font-geist-mono)', fontSize: 'inherit', textDecoration: 'none' }}>
                        Esqueceu-se?
                      </Link>
                    )}
                  </label>
                  <input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} style={INPUT_STYLE}/>
                </div>
              </>
            )}
            {mode === 'verify' && (
              <div>
                <label className="text-mono-xs" style={{ display: 'block', marginBottom: 6, color: 'var(--color-base-500)' }}>Código</label>
                <input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} required style={INPUT_STYLE}/>
              </div>
            )}
            {mode === 'register' && (
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontFamily: 'var(--font-geist-sans)', fontSize: 12, color: 'var(--color-base-400)', marginTop: 4 }}>
                <input type="checkbox" defaultChecked required style={{ marginTop: 3, accentColor: 'var(--color-accent-100)' }}/>
                Aceito os <Link href="/termos" style={{ color: 'var(--color-accent-100)', padding: '0 2px' }}>Termos</Link> e a <Link href="/privacidade" style={{ color: 'var(--color-accent-100)', padding: '0 2px' }}>Política de Privacidade</Link>.
              </label>
            )}
            {error && (
              <div className="text-mono-xs" style={{ color: 'var(--color-destructive)', padding: '8px 10px', border: '1px dashed var(--color-destructive)', borderRadius: 2 }}>
                ● {error}
              </div>
            )}
            <Button variant="solid" type="submit" disabled={busy}>{ctaLabel}</Button>
          </form>

          {mode !== 'verify' && (
            <>
              <div style={{ margin: '28px 0 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, borderTop: '1px dashed var(--color-base-800)' }}/>
                <span className="text-mono-xs" style={{ color: 'var(--color-base-600)' }}>OU</span>
                <div style={{ flex: 1, borderTop: '1px dashed var(--color-base-800)' }}/>
              </div>

              <div style={{ display: 'grid', gap: 8 }}>
                <button type="button" style={OAUTH_BTN} onClick={() => handleOAuth('oauth_google')}><span style={{ marginRight: 10 }}>G</span> Continuar com Google</button>
                <button type="button" style={OAUTH_BTN} onClick={() => handleOAuth('oauth_microsoft')}><span style={{ marginRight: 10 }}>◍</span> Continuar com Microsoft</button>
              </div>
            </>
          )}

          <p style={{ marginTop: 28, fontFamily: 'var(--font-geist-sans)', fontSize: 13, color: 'var(--color-base-400)', textAlign: 'center' }}>
            {mode === 'login' ? 'Ainda não tem conta? ' : mode === 'register' ? 'Já tem conta? ' : 'Problemas com o código? '}
            <button type="button" style={{ color: 'var(--color-accent-100)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', fontSize: 'inherit' }} onClick={() => { setError(null); setMode(mode === 'login' ? 'register' : 'login'); }}>
              {mode === 'login' ? 'Criar conta' : mode === 'register' ? 'Iniciar sessão' : 'Recomeçar'}
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
