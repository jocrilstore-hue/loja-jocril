import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categorias',
  description: 'Todas as categorias de produtos Jocril — PLV, hotelaria, sinalética, troféus e acessórios.',
};

export default function CategoriasLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
