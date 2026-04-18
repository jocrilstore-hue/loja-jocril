import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfólio',
  description: 'Trabalhos realizados para marcas como Heineken, Ricola, Beefeater e muitas outras — expositores, displays e sinalética à medida.',
};

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
