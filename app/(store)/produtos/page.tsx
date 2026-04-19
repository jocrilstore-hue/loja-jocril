import PLPClient from "./produtos-client";
import {
  listProducts,
  getCategoryBySlug,
  type ListProductsParams,
} from "@/lib/queries/products";

export const revalidate = 300;

type SearchParams = {
  cat?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: "relevance" | "price-asc" | "price-desc" | "newest";
};

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  // Resolve ?cat=<slug> → category_id
  const category = sp.cat ? await getCategoryBySlug(sp.cat) : null;

  const params: ListProductsParams = {
    search: sp.search,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    categoryIds: category ? [category.id] : undefined,
    sort: sp.sort ?? "relevance",
    limit: 100,
  };

  const products = await listProducts(params);

  return (
    <PLPClient
      products={products}
      categoryName={category?.name ?? null}
      categoryDescription={category?.description ?? null}
      totalInCategory={products.length}
      initialSort={sp.sort ?? "relevance"}
      initialMaxPrice={sp.maxPrice ? Number(sp.maxPrice) : undefined}
    />
  );
}
