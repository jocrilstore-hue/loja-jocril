import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrinho',
  description: 'Reveja os seus artigos e conclua a encomenda.',
};

export default function CarrinhoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
