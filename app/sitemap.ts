import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://loja.jocril.pt';
  const now = new Date();

  return [
    { url: base + '/',                       lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: base + '/produtos',               lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: base + '/categorias',             lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: base + '/portfolio',              lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: base + '/processos',              lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: base + '/sobre',                  lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: base + '/contacto',               lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: base + '/faq',                    lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: base + '/legais/privacidade',     lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: base + '/legais/cookies',         lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: base + '/legais/termos',          lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: base + '/legais/devolucoes',      lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: base + '/legais/envios',          lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];
}
