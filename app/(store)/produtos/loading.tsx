export default function Loading() {
  return (
    <main style={{ background: 'var(--color-dark-base-primary)', minHeight: '60vh' }}>
      <div
        className="text-mono-xs"
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '80px 40px',
          color: 'var(--color-base-500)',
        }}
      >
        A carregar produtos…
      </div>
    </main>
  );
}
