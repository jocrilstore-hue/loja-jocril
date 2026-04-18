import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: '%s | Jocril',
    default: 'Jocril — Loja Online',
  },
  description:
    "Materiais para Ponto de Venda e Hotelaria em madeira e acrílico. Precisão industrial desde 1994.",
  icons: {
    icon: "/assets/favicon.svg",
    shortcut: "/assets/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT" data-theme="dark">
      <head>
        <link rel="stylesheet" href="/styles/colors_and_type.css" />
        <link rel="stylesheet" href="/styles/store-responsive.css" />
        <link rel="preload" href="/assets/portfolio/carm-premium.avif" as="image" type="image/avif" />
      </head>
      <body>{children}</body>
    </html>
  );
}
