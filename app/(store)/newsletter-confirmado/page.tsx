import Badge from '@/components/store/Badge';
import Button from '@/components/store/Button';

export default function NewsletterConfirmadoPage() {
  return (
    <main id="main">
      <section data-screen-label="01 Newsletter confirmada" style={{ minHeight: 'calc(100vh - 280px)', padding: '72px 40px', display: 'grid', placeItems: 'center' }}>
        <div style={{ maxWidth: 560, width: '100%' }}>
          <div style={{ width: 72, height: 72, border: '1px dashed var(--color-accent-100)', borderRadius: '50%', display: 'grid', placeItems: 'center', marginBottom: 24 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke="var(--color-accent-100)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>

          <Badge size="sm">Newsletter · Inscrição confirmada</Badge>
          <h1 className="heading-1" style={{ margin: '16px 0 0', color: 'var(--color-light-base-primary)' }}>Obrigado. Já faz parte.</h1>
          <p className="text-body" style={{ color: 'var(--color-base-300)', marginTop: 16 }}>A sua subscrição está confirmada. Enviaremos novidades de produto, drops de outlet e campanhas, no máximo duas vezes por mês.</p>

          <div style={{ marginTop: 32 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Button variant="primary">Descobrir o catálogo</Button>
              <Button variant="secondary">Voltar à página inicial</Button>
            </div>
          </div>

          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px dashed var(--color-base-800)', display: 'grid', gap: 6 }}>
            <div className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>● email subscrito · m••••@exemplo.pt</div>
            <div className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>Pode cancelar a qualquer momento no link ao fundo de cada email.</div>
          </div>
        </div>
      </section>
    </main>
  );
}
