import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pesquisa',
  description: 'Pesquise no catálogo Jocril — materiais PLV, hotelaria, sinalética e muito mais.',
};

export default function PesquisaLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
