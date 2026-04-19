// Display metadata for categories. Keyed by DB slug.
// The DB owns category identity; this file owns display grouping, ordinal,
// image, and the short copy that the UI frames each category with.
//
// Any category slug not in CATEGORY_META renders under DEFAULT_GROUP with
// DEFAULT_IMG and no description. Add entries here as new categories land.

export type CategoryMeta = {
  group: string;
  img?: string;
  desc?: string;
};

export const DEFAULT_GROUP = "Outros";
export const DEFAULT_IMG = "/assets/portfolio/carm-premium.avif";

// Seeded from the existing curated UI grouping + the old project's slug map.
// Real DB slugs may differ — unknown slugs fall through to DEFAULT_GROUP.
export const CATEGORY_META: Record<string, CategoryMeta> = {
  "acrilicos-chao": {
    group: "Acrílicos",
    img: "/assets/portfolio/carm-premium.avif",
    desc: "Expositores verticais com prateleiras, em formatos A5 a A2.",
  },
  "acrilicos-mesa": {
    group: "Acrílicos",
    img: "/assets/portfolio/carm.avif",
    desc: "Peças compactas para balcão e ponto de venda.",
  },
  "acrilicos-parede": {
    group: "Acrílicos",
    img: "/assets/portfolio/ricola.avif",
    desc: "Placas, porta-folhetos e painéis iluminados.",
  },
  "caixas-acrilico": {
    group: "Caixas e armazenamento",
    img: "/assets/portfolio/beefeater.avif",
    desc: "Com e sem tampa, tamanhos standard e à medida.",
  },
  "tombolas-acrilico": {
    group: "Caixas e armazenamento",
    img: "/assets/portfolio/fanta.avif",
    desc: "Urnas para sorteios, coleta e amostragem.",
  },
  "molduras-acrilico": {
    group: "Impressão e serviços",
    img: "/assets/portfolio/stoli.avif",
    desc: "Molduras em acrílico e alumínio, vários formatos.",
  },
};

// Order of groups as they should appear on the categorias page.
export const GROUP_ORDER = [
  "Acrílicos",
  "Caixas e armazenamento",
  "Impressão e serviços",
  DEFAULT_GROUP,
];

export function getCategoryMeta(slug: string): CategoryMeta {
  return (
    CATEGORY_META[slug] ?? {
      group: DEFAULT_GROUP,
      img: DEFAULT_IMG,
    }
  );
}
