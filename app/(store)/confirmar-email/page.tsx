'use client';

import { useState, useEffect } from 'react';
import Badge from '@/components/store/Badge';
import Button from '@/components/store/Button';

export default function ConfirmarEmailPage() {
  const [sent, setSent]         = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const resend = () => { setSent(true); setCooldown(60); };

  return (
    <main id="main">
      <section data-screen-label="01 Email verification" style={{ minHeight: 'calc(100vh - 280px)', padding: '72px 40px', display: 'grid', placeItems: 'center' }}>
        <div style={{ maxWidth: 620, width: '100%' }}>
          <Badge size="sm">Conta criada · Verificação pendente</Badge>
          <h1 className="heading-1" style={{ margin: '16px 0 0', color: 'var(--color-light-base-primary)' }}>
            Confirme o seu email.
          </h1>
          <p className="text-body" style={{ color: 'var(--color-base-300)', marginTop: 16, maxWidth: '52ch' }}>
            Enviámos um link de verificação para <span style={{ color: 'var(--color-accent-100)' }}>m••••@exemplo.pt</span>. Abra o email e clique no botão para ativar a conta.
          </p>

          {/* mail preview card */}
          <div style={{ marginTop: 32, border: '1px dashed var(--color-base-800)', borderRadius: 4, overflow: 'hidden', background: 'var(--color-dark-base-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px dashed var(--color-base-800)' }}>
              <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', textTransform: 'uppercase' }}>● Preview do email</div>
              <div className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>ha 3s</div>
            </div>
            <div style={{ padding: '18px 20px', borderBottom: '1px dashed var(--color-base-800)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: 12, marginBottom: 4 }}>
                <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>DE</span>
                <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 13, color: 'var(--color-light-base-primary)' }}>Jocril &lt;conta@jocril.pt&gt;</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: 12 }}>
                <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>ASSUNTO</span>
                <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 13, color: 'var(--color-light-base-primary)' }}>Confirme o seu endereço de email — Jocril</span>
              </div>
            </div>
            <div style={{ padding: '24px 20px', display: 'grid', gap: 12 }}>
              <p style={{ margin: 0, fontFamily: 'var(--font-geist-sans)', fontSize: 14, color: 'var(--color-base-300)', lineHeight: 1.6 }}>Bem-vindo à Jocril. Para concluir o registo, confirme o seu endereço de email clicando no botão abaixo. O link é válido durante 24 horas.</p>
              <div style={{ padding: '14px 22px', background: 'var(--color-accent-100)', borderRadius: 2, display: 'inline-block', width: 'fit-content', fontFamily: 'var(--font-geist-sans)', fontSize: 14, color: 'var(--color-dark-base-primary)', letterSpacing: '-.01em' }}>
                Confirmar email →
              </div>
              <p className="text-mono-xs" style={{ color: 'var(--color-base-500)', margin: 0 }}>
                Se o botão não funcionar: https://jocril.pt/verify?token=a1b2c3d4…
              </p>
            </div>
          </div>

          {/* resend */}
          <div style={{ marginTop: 32, padding: '18px 22px', border: '1px dashed var(--color-base-800)', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 14, color: 'var(--color-light-base-primary)' }}>Não recebeu o email?</div>
              <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', marginTop: 3 }}>Verifique a pasta de spam, ou reenvie.</div>
            </div>
            <Button variant="secondary" onClick={cooldown === 0 ? resend : undefined}>
              {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar email'}
            </Button>
          </div>

          {sent && cooldown > 0 && (
            <div className="text-mono-xs" style={{ marginTop: 14, color: 'var(--color-accent-100)' }}>● Email reenviado. Verifique a caixa de entrada.</div>
          )}

          <div className="text-mono-xs" style={{ marginTop: 24, color: 'var(--color-base-500)' }}>
            Endereço errado? <button style={{ color: 'var(--color-accent-100)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>Alterar email</button> · <button style={{ color: 'var(--color-accent-100)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>Falar com apoio</button>
          </div>
        </div>
      </section>
    </main>
  );
}
