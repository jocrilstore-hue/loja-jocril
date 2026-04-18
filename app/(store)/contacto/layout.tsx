import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Fale connosco. Pedidos de orçamento, informações técnicas e apoio pós-venda — respondemos em menos de 24 horas.',
};

export default function ContactoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
