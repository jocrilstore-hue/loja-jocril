'use client';

import Link from 'next/link';
import Badge from '@/components/store/Badge';

const GROUPS: { kicker: string; title: string; items: [string, string][] }[] = [
  { kicker: '01', title: 'Storefront · Core', items: [
    ['Home',                   '/'],
    ['Catálogo (PLP)',          '/produtos'],
    ['Ficha de produto (PDP)', '/produtos/bolsa-resistente-a-agua-autoadesivo-a3'],
    ['Categorias',             '/categorias'],
    ['Pesquisa',               '/pesquisa'],
    ['Carrinho · Checkout',    '/carrinho'],
  ]},
  { kicker: '02', title: 'Storefront · Conteúdo', items: [
    ['Sobre',     '/sobre'],
    ['Processos', '/processos'],
    ['Portfolio', '/portfolio'],
    ['Contacto',  '/contacto'],
    ['FAQ',       '/faq'],
  ]},
  { kicker: '03', title: 'Conta cliente', items: [
    ['Login · Registo',          '/entrar'],
    ['Minha conta',              '/conta'],
    ['Detalhe de encomenda',     '/conta/encomenda/JOC-25-04821'],
    ['Recuperar palavra-passe',  '/recuperar-password'],
    ['Confirmar email',          '/confirmar-email'],
    ['Newsletter confirmada',    '/newsletter-confirmado'],
  ]},
  { kicker: '04', title: 'Legal', items: [
    ['Política de Privacidade', '/legais/privacidade'],
    ['Termos e Condições',       '/legais/termos'],
    ['Política de Envios',       '/legais/envios'],
    ['Política de Devoluções',   '/legais/devolucoes'],
    ['Política de Cookies',      '/legais/cookies'],
  ]},
  { kicker: '05', title: 'Sistema · Erros', items: [
    ['404 · Não encontrado',    '/nao-encontrado'],
    ['500 · Falha no servidor', '/erro'],
    ['Manutenção programada',   '/manutencao'],
  ]},
  { kicker: '06', title: 'Admin (B2B internal)', items: [
    ['Admin login',                  '/admin/login'],
    ['Dashboard',                    '/admin'],
    ['Encomendas',                   '/admin/encomendas'],
    ['Detalhe de encomenda',         '/admin/encomendas/JOC-25-04821'],
    ['Produtos (lista)',              '/admin/produtos'],
    ['Editor de produto (template)', '/admin/produtos/novo'],
    ['Editor de variante',           '/admin/produtos/novo'],
    ['Escalões de preço',            '/admin/escaloes-preco'],
    ['Clientes',                     '/admin/clientes'],
    ['Detalhe de cliente',           '/admin/clientes/1'],
  ]},
  { kicker: '07', title: 'Admin · Definições', items: [
    ['Definições (hub)',         '/admin/definicoes'],
    ['Envios e zonas',          '/admin/definicoes/envios'],
    ['Escalões de preço',        '/admin/definicoes/escaloes'],
    ['Códigos de desconto',     '/admin/definicoes/descontos'],
    ['IVA e impostos',           '/admin/definicoes/impostos'],
    ['Equipa · Utilizadores',   '/admin/definicoes/equipa'],
  ]},
  { kicker: '08', title: 'Admin · Biblioteca', items: [
    ['Componentes (showcase)', '/admin/componentes'],
    ['Templates de email',     '/admin/emails'],
  ]},
];

const total = GROUPS.reduce((s, g) => s + g.items.length, 0);

export default function SitemapPage() {
  return (
    <main id="main">
      <section data-screen-label="01 Sitemap" style={{ padding: '64px 40px 48px', borderBottom: '1px dashed var(--color-base-800)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40, alignItems: 'end' }}>
          <div>
            <Badge size="sm">Handoff · Sitemap</Badge>
            <h1 className="heading-1" style={{ margin: '16px 0 0', color: 'var(--color-light-base-primary)' }}>Jocril Loja.<br/>Índice completo.</h1>
          </div>
          <div>
            <p className="text-body" style={{ color: 'var(--color-base-300)', maxWidth: '48ch', marginBottom: 14 }}>
              Todas as superfícies desenhadas para a loja online e admin B2B. Clique para abrir cada uma.
            </p>
            <div className="text-mono-xs" style={{ color: 'var(--color-base-500)', display: 'flex', gap: 18, flexWrap: 'wrap' }}>
              <span>● {total} páginas</span>
              <span style={{ color: 'var(--color-base-700)' }}>·</span>
              <span>{GROUPS.length} grupos</span>
              <span style={{ color: 'var(--color-base-700)' }}>·</span>
              <span>Desktop · 1440px</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 40px 96px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {GROUPS.map((g) => (
            <div key={g.kicker} style={{ border: '1px dashed var(--color-base-800)', borderRadius: 4, overflow: 'hidden', background: 'var(--color-dark-base-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '16px 20px', borderBottom: '1px dashed var(--color-base-800)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span className="text-mono-xs" style={{ color: 'var(--color-accent-100)' }}>● {g.kicker}</span>
                  <h2 style={{ margin: 0, fontFamily: 'var(--font-geist-sans)', fontSize: 22, letterSpacing: '-.03em', color: 'var(--color-light-base-primary)' }}>{g.title}</h2>
                </div>
                <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>{g.items.length}</span>
              </div>
              <div>
                {g.items.map(([label, href], i, arr) => (
                  <Link key={href} href={href} style={{
                    display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: 14,
                    padding: '14px 20px', cursor: 'pointer', textDecoration: 'none',
                    borderBottom: i < arr.length - 1 ? '1px dashed var(--color-base-900)' : 'none',
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-dark-base-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                    <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 15, color: 'var(--color-light-base-primary)', letterSpacing: '-.015em' }}>{label}</span>
                    <span className="text-mono-xs" style={{ color: 'var(--color-base-500)' }}>{href}</span>
                    <span style={{ color: 'var(--color-base-600)', fontSize: 16 }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
