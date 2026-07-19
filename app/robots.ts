import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';

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
    sitemap: getSiteUrl() + '/sitemap.xml',
  };
}
