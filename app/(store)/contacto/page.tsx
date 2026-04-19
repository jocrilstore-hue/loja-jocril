'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Badge from '@/components/store/Badge';
import Button from '@/components/store/Button';

const SUBJECTS = [
  { k: 'orcamento', l: 'Orçamento p/ peça à medida' },
  { k: 'loja',      l: 'Apoio à encomenda online' },
  { k: 'tecnico',   l: 'Questão técnica / produção' },
  { k: 'imprensa',  l: 'Imprensa / comunicação' },
  { k: 'outro',     l: 'Outro assunto' },
];

const INFO_ROWS: { k: string; v: string[] }[] = [
  { k: 'Morada',   v: ['Rua da Indústria, Lote 24', '2400-123 Leiria', 'Portugal'] },
  { k: 'Telefone', v: ['+351 244 832 415'] },
  { k: 'Email',    v: ['loja@jocril.pt', 'orcamentos@jocril.pt'] },
  { k: 'Horário',  v: ['Seg–Sex · 09h00 – 18h00', 'Sáb · 09h00 – 13h00'] },
];

const FIELDS = [
  { label: 'Nome',                 name: 'name',    placeholder: 'Maria Silva',            required: true  },
  { label: 'Empresa (opcional)',   name: 'company', placeholder: 'Agência Ponto & Linha',  required: false },
  { label: 'Email',                name: 'email',   placeholder: 'maria@agencia.pt',       required: true  },
  { label: 'Telefone (opcional)',  name: 'phone',   placeholder: '+351 912 345 678',       required: false },
];

const INPUT_STYLE: React.CSSProperties = {
  width: '100%', padding: '12px 14px',
  background: 'var(--color-dark-base-primary)',
  border: '1px solid var(--color-base-800)', borderRadius: 2,
  color: 'var(--color-light-base-primary)',
  fontFamily: 'var(--font-geist-sans)', fontSize: 14, outline: 'none',
};

export default function ContactoPage() {
  const [subject, setSubject] = useState('orcamento');
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setSubmitStatus(null);
    try {
      const subjectLabel = SUBJECTS.find((item) => item.k === subject)?.l ?? subject;
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(form.get('name') ?? ''),
          company: String(form.get('company') ?? ''),
          email: String(form.get('email') ?? ''),
          phone: String(form.get('phone') ?? ''),
          subject: subjectLabel,
          message: String(form.get('message') ?? ''),
          consent: form.get('consent') === 'on',
        }),
      });
      const payload = await response.json() as { success: boolean; message?: string; error?: string };
      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? 'Erro ao enviar mensagem');
      }
      setSubmitStatus({ ok: true, text: payload.message ?? 'Mensagem enviada com sucesso' });
      event.currentTarget.reset();
    } catch (error) {
      setSubmitStatus({ ok: false, text: error instanceof Error ? error.message : 'Erro ao enviar mensagem' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main id="main">
      <section data-screen-label="01 Contacto" style={{ padding: '56px 40px 0', background: 'var(--color-dark-base-primary)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Badge size="sm">Contacto</Badge>
          <h1 className="heading-1" style={{ margin: '16px 0 14px', color: 'var(--color-light-base-primary)' }}>Falemos.</h1>
          <p className="text-body" style={{ color: 'var(--color-base-300)', maxWidth: '58ch', marginBottom: 48 }}>
            Respondemos em <span style={{ color: 'var(--color-light-base-primary)' }}>24 horas úteis</span>. Para orçamentos de peças à medida, anexe esboço, dimensões e quantidade para acelerar a resposta.
          </p>
        </div>
      </section>

      <section style={{ padding: '0 40px 80px', background: 'var(--color-dark-base-primary)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'start' }}>
          <form onSubmit={handleSubmit} style={{ border: '1px dashed var(--color-base-700)', borderRadius: 6, background: 'var(--color-dark-base-secondary)', padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
              <span className="text-mono-sm" style={{ color: 'var(--color-accent-100)' }}>01</span>
              <h2 className="heading-2" style={{ margin: 0, color: 'var(--color-light-base-primary)' }}>Envie-nos uma mensagem</h2>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="text-mono-xs" style={{ display: 'block', marginBottom: 8, color: 'var(--color-base-500)' }}>Assunto</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {SUBJECTS.map((s) => {
                  const on = subject === s.k;
                  return (
                    <button key={s.k} type="button" onClick={() => setSubject(s.k)} style={{
                      padding: '8px 12px', borderRadius: 2, cursor: 'pointer',
                      border: `1px dashed ${on ? 'var(--color-accent-100)' : 'var(--color-base-700)'}`,
                      background: on ? 'rgba(45,212,205,.10)' : '#424242',
                      color: on ? 'var(--color-accent-100)' : 'var(--color-base-400)',
                      fontFamily: 'var(--font-geist-mono)', fontSize: 12, letterSpacing: '-.015rem',
                    }}>{s.l}</button>
                  );
                })}
              </div>
            </div>

            {FIELDS.map((field) => (
              <div key={field.name} style={{ marginBottom: 16 }}>
                <label className="text-mono-xs" style={{ display: 'block', marginBottom: 8, color: 'var(--color-base-500)' }}>{field.label}</label>
                <input name={field.name} placeholder={field.placeholder} required={field.required} style={INPUT_STYLE}/>
              </div>
            ))}

            <div style={{ marginBottom: 20 }}>
              <label className="text-mono-xs" style={{ display: 'block', marginBottom: 8, color: 'var(--color-base-500)' }}>Mensagem</label>
              <textarea
                name="message"
                placeholder={"Olá,\n\nGostaria de um orçamento para 250 unidades de um expositor A3 com 6 prateleiras, em acrílico fumado com logo por corte laser. Entrega até final de Maio.\n\nObrigada,\nMaria"}
                required
                rows={7}
                style={{ ...INPUT_STYLE, resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="text-mono-xs" style={{ display: 'block', marginBottom: 8, color: 'var(--color-base-500)' }}>Anexos (opcional)</label>
              <div style={{ padding: '18px 20px', border: '1px dashed var(--color-base-700)', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 14, color: 'var(--color-base-400)' }}>Arraste ficheiros (.pdf, .ai, .dwg, .dxf, imagens) ou</span>
                <button style={{ padding: '6px 12px', background: 'transparent', border: '1px solid var(--color-base-700)', borderRadius: 2, color: 'var(--color-light-base-primary)', fontFamily: 'var(--font-geist-mono)', fontSize: 12, cursor: 'pointer' }}>Procurar</button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, paddingTop: 20, borderTop: '1px dashed var(--color-base-800)' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontFamily: 'var(--font-geist-sans)', fontSize: 12, color: 'var(--color-base-400)', maxWidth: '44ch' }}>
                <input name="consent" type="checkbox" required defaultChecked style={{ marginTop: 3, accentColor: 'var(--color-accent-100)' }}/>
                Li e aceito a{' '}
                <button style={{ color: 'var(--color-accent-100)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', fontSize: 'inherit', padding: 0 }}>Política de Privacidade</button>.
                {' '}Os meus dados serão usados apenas para responder ao pedido.
              </label>
              <Button type="submit" disabled={submitting} variant="solid">{submitting ? 'A enviar…' : 'Enviar mensagem →'}</Button>
            </div>
            {submitStatus && (
              <div style={{ marginTop: 16, padding: '10px 14px', border: `1px dashed ${submitStatus.ok ? 'var(--color-accent-100)' : 'var(--color-destructive)'}`, borderRadius: 2, color: submitStatus.ok ? 'var(--color-accent-100)' : 'var(--color-destructive)', fontFamily: 'var(--font-geist-sans)', fontSize: 13 }}>
                {submitStatus.text}
              </div>
            )}
          </form>

          <div>
            <div style={{ border: '1px dashed var(--color-base-700)', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ aspectRatio: '16/9', background: 'url(https://tile.openstreetmap.org/13/3934/3110.png) center/cover, var(--color-dark-base-secondary)', position: 'relative', borderBottom: '1px dashed var(--color-base-700)' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 52% 48%, transparent 0, rgba(4,4,4,.5) 60%)' }}/>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 8, background: 'var(--color-accent-100)', boxShadow: '0 0 0 6px rgba(240,71,66,.2)' }}/>
                  <span className="text-mono-xs" style={{ padding: '4px 8px', background: 'var(--color-dark-base-primary)', border: '1px solid var(--color-base-700)', borderRadius: 2, color: 'var(--color-light-base-primary)' }}>Jocril · Leiria</span>
                </div>
              </div>

              {INFO_ROWS.map((row, i) => (
                <div key={row.k} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 20, padding: '16px 20px', borderTop: i === 0 ? 'none' : '1px dashed var(--color-base-800)' }}>
                  <span className="text-mono-xs" style={{ color: 'var(--color-base-500)', paddingTop: 2 }}>{row.k}</span>
                  <div style={{ display: 'grid', gap: 4 }}>
                    {row.v.map((l) => <span key={l} style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 14, color: 'var(--color-light-base-primary)' }}>{l}</span>)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, padding: 20, border: '1px dashed var(--color-base-800)', borderRadius: 6, background: 'var(--color-dark-base-secondary)' }}>
              <div className="text-mono-xs" style={{ color: 'var(--color-accent-300)', marginBottom: 10 }}>● Tempo médio de resposta</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 40, letterSpacing: '-.04em', color: 'var(--color-light-base-primary)' }}>6h 22m</span>
                <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>últimos 30 dias · horário útil</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
