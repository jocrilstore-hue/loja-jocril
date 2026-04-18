// Root route redirects to storefront home via the (store) route group.
// The (store) route group provides layout + layout wraps this.
// We keep this file so the root URL resolves cleanly in the storefront group.
import StoreHero from "@/components/store/StoreHero";
import CategoriesBlock from "@/components/store/CategoriesBlock";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import ProcessesStrip from "@/components/store/ProcessesStrip";
import FooterCTA from "@/components/store/FooterCTA";

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
