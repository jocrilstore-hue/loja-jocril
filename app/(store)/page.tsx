import type { Metadata } from 'next';
import StoreHero from "@/components/store/StoreHero";
import CategoriesBlock from "@/components/store/CategoriesBlock";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import ProcessesStrip from "@/components/store/ProcessesStrip";
import FooterCTA from "@/components/store/FooterCTA";

export const metadata: Metadata = {
  title: { absolute: 'Jocril — Loja Online' },
  description: 'Materiais para Ponto de Venda e Hotelaria em madeira e acrílico. Precisão industrial desde 1994.',
};

export default function Home() {
  return (
    <main id="main">
      <StoreHero />
      <CategoriesBlock />
      <FeaturedProducts />
      <ProcessesStrip />
      <FooterCTA />
    </main>
  );
}
