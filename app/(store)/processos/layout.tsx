import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Processos',
  description: 'Corte laser, termoformação, impressão UV e montagem — os processos industriais que garantem precisão desde 1994.',
};

export default function ProcessosLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
