import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Produtos',
  description: 'Catálogo de materiais para Ponto de Venda e Hotelaria em madeira e acrílico — expositores, displays, sinalética e muito mais.',
};

export default function ProdutosLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
