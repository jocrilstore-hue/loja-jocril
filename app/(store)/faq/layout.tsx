import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Perguntas frequentes sobre encomendas, prazos de entrega, personalização de produtos e políticas da Jocril.',
};

export default function FaqLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
