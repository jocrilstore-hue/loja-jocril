'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignIn } from '@clerk/nextjs';
import Badge from '@/components/store/Badge';
import Button from '@/components/store/Button';

type Stage = 'request' | 'set' | 'done';

function TxField({
  label, type = 'text', placeholder = '', value, onChange, autoComplete, inputMode,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  inputMode?: 'numeric' | 'text';
}) {
  return (
    <label style={{ display: 'grid', gap: 6, marginBottom: 14 }}>
      <span className="text-mono-xs" style={{ color: 'var(--color-base-500)', textTransform: 'uppercase' }}>{label}</span>
      <input
        type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete} inputMode={inputMode}
        style={{
          padding: '14px 16px', background: 'var(--color-dark-base-secondary)',
          border: '1px dashed var(--color-base-700)', borderRadius: 2,
          color: 'var(--color-light-base-primary)', outline: 'none',
          fontFamily: 'var(--font-geist-sans)', fontSize: 15, letterSpacing: '-.015em',
        }}
      />
    </label>
  );
}

const STAGES: { k: Stage; l: string }[] = [
  { k: 'request', l: 'Pedido'              },
  { k: 'set',     l: 'Nova palavra-passe'  },
  { k: 'done',    l: 'Concluído'           },
];

export default function RecuperarPasswordPage() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [stage, setStage] = useState<Stage>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async () => {
    if (!isLoaded) return;
    setError(null); setBusy(true);
    try {
      await signIn.create({ strategy: 'reset_password_email_code', identifier: email });
      setStage('set');
    } catch (e: unknown) {
      const msg = (e as { errors?: { message?: string }[] })?.errors?.[0]?.message || 'Não foi possível enviar o código.';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    if (!isLoaded) return;
    if (password !== confirm) { setError('As palavras-passe não coincidem.'); return; }
    setError(null); setBusy(true);
    try {
      const result = await signIn.attemptFirstFactor({ strategy: 'reset_password_email_code', code, password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        setStage('done');
      } else if (result.status === 'needs_second_factor') {
        setError('Autenticação de dois fatores necessária. Contacte o suporte.');
      } else {
        setError('Não foi possível concluir a reposição.');
      }
    } catch (e: unknown) {
      const msg = (e as { errors?: { message?: string }[] })?.errors?.[0]?.message || 'Código inválido.';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main id="main">
      <section data-screen-label={`01 Password reset · ${stage}`} style={{ minHeight: 'calc(100vh - 280px)', padding: '72px 40px', display: 'grid', placeItems: 'center' }}>
        <div style={{ maxWidth: 560, width: '100%' }}>
          {/* stage indicator */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
            {STAGES.map((s, i) => {
              const on = s.k === stage;
              return (
                <div key={s.k} style={{ flex: 1, padding: '10px 4px', borderTop: `2px solid ${on ? 'var(--color-accent-100)' : 'var(--color-base-800)'}` }}>
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
              <p className="text-body" style={{ color: 'var(--color-base-300)', marginTop: 16 }}>Indique o email da sua conta. Enviaremos um código de 6 dígitos para definir uma nova palavra-passe.</p>
              <div style={{ marginTop: 32 }}>
                <TxField label="Email" type="email" placeholder="nome@exemplo.pt" value={email} onChange={setEmail} autoComplete="email" />
                {error && <div className="text-mono-xs" style={{ color: 'var(--color-destructive)', marginBottom: 14, padding: '8px 10px', border: '1px dashed var(--color-destructive)', borderRadius: 2 }}>● {error}</div>}
                <Button variant="primary" onClick={handleRequest} disabled={busy}>
                  {busy ? 'A enviar…' : 'Enviar código de recuperação'}
                </Button>
                <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', marginTop: 18 }}>
                  ● Lembrou-se da palavra-passe? <Link href="/entrar" style={{ color: 'var(--color-accent-100)' }}>Iniciar sessão</Link>
                </div>
              </div>
            </>
          )}

          {stage === 'set' && (
            <>
              <Badge size="sm">Código enviado</Badge>
              <h1 className="heading-1" style={{ margin: '16px 0 0', color: 'var(--color-light-base-primary)' }}>Nova palavra-passe.</h1>
              <p className="text-body" style={{ color: 'var(--color-base-300)', marginTop: 16 }}>Introduza o código de 6 dígitos enviado para {email} e escolha uma palavra-passe com pelo menos 8 caracteres.</p>
              <div style={{ marginTop: 32 }}>
                <TxField label="Código"                 type="text"     placeholder="000000"      value={code}     onChange={setCode}     autoComplete="one-time-code" inputMode="numeric" />
                <TxField label="Nova palavra-passe"      type="password" placeholder="••••••••••" value={password} onChange={setPassword} autoComplete="new-password" />
                <TxField label="Confirmar palavra-passe" type="password" placeholder="••••••••••" value={confirm}  onChange={setConfirm}  autoComplete="new-password" />
                {error && <div className="text-mono-xs" style={{ color: 'var(--color-destructive)', marginBottom: 14, padding: '8px 10px', border: '1px dashed var(--color-destructive)', borderRadius: 2 }}>● {error}</div>}
                <Button variant="primary" onClick={handleReset} disabled={busy}>
                  {busy ? 'A guardar…' : 'Guardar e iniciar sessão'}
                </Button>
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
              <p className="text-body" style={{ color: 'var(--color-base-300)', marginTop: 16 }}>A sua palavra-passe foi atualizada e já está com sessão iniciada.</p>
              <div style={{ marginTop: 32, display: 'flex', gap: 10 }}>
                <Button variant="primary" onClick={() => router.push('/conta')}>Ir para a minha conta</Button>
                <Button variant="secondary" onClick={() => router.push('/')}>Ir para a loja</Button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
