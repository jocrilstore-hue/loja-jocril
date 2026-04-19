import type { Metadata } from 'next';
import StoreHero from "@/components/store/StoreHero";
import CategoriesBlock from "@/components/store/CategoriesBlock";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import ProcessesStrip from "@/components/store/ProcessesStrip";
import FooterCTA from "@/components/store/FooterCTA";
import type { CategoryCardItem } from "@/components/store/CategoriesBlock";
import { listFeaturedProducts, listCategoriesWithCounts } from "@/lib/queries/products";
import { getCategoryMeta, DEFAULT_IMG } from "@/lib/data/category-groups";

export const metadata: Metadata = {
  title: { absolute: 'Jocril — Loja Online' },
  description: 'Materiais para Ponto de Venda e Hotelaria em madeira e acrílico. Precisão industrial desde 1994.',
};

export const revalidate = 300;

export default async function Home() {
  const [featured, categories] = await Promise.all([
    listFeaturedProducts(8),
    listCategoriesWithCounts(),
  ]);

  const cats: CategoryCardItem[] = categories.slice(0, 6).map((c, i) => {
    const meta = getCategoryMeta(c.slug);
    return {
      n: String(i + 1).padStart(2, "0"),
      name: c.name,
      count: c.productCount ?? 0,
      img: meta.img ?? DEFAULT_IMG,
      href: `/produtos?cat=${c.slug}`,
    };
  });

  return (
    <main id="main">
      <StoreHero />
      <CategoriesBlock cats={cats} />
      <FeaturedProducts products={featured} />
      <ProcessesStrip />
      <FooterCTA />
    </main>
  );
}
