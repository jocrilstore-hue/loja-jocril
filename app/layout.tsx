import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ptPT } from "@clerk/localizations";
import { CartProvider } from "@/contexts/cart-context";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | Jocril',
    default: 'Jocril',
  },
  description:
    "Materiais para Ponto de Venda e Hotelaria em madeira e acrílico. Precisão industrial desde 1994.",
  icons: {
    icon: "/assets/favicon.svg",
    shortcut: "/assets/favicon.ico",
  },
  openGraph: {
    title: "Jocril",
    description:
      "Materiais para Ponto de Venda e Hotelaria em madeira e acrílico. Precisão industrial desde 1994.",
    url: siteUrl,
    siteName: "Jocril",
    locale: "pt_PT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={ptPT}>
      <html lang="pt-PT" data-theme="dark">
        <head>
          <link rel="stylesheet" href="/styles/colors_and_type.css" />
          <link rel="stylesheet" href="/styles/store-responsive.css" />
          <link rel="preload" href="/assets/portfolio/carm-premium.avif" as="image" type="image/avif" />
        </head>
        <body><CartProvider>{children}</CartProvider></body>
      </html>
    </ClerkProvider>
  );
}
