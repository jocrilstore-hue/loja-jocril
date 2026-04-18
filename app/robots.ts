import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/conta/',
          '/carrinho/',
          '/entrar/',
          '/pesquisa/',
          '/recuperar-password/',
          '/confirmar-email/',
          '/newsletter-confirmado/',
        ],
      },
    ],
    sitemap: 'https://loja.jocril.pt/sitemap.xml',
  };
}
